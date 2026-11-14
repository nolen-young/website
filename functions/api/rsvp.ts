/**
 * Cloudflare Pages Function Proxy for Wedding RSVPs
 * Route: /api/rsvp
 *
 * Environment Variables configured in Cloudflare Pages Dashboard:
 * - GOOGLE_SCRIPT_URL: The deployed Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)
 * - ADMIN_PASSCODE: Secret PIN for unlocking the /wedding/admin dashboard (defaults to "2027" if not set)
 * - GOOGLE_WEBHOOK_SECRET: (Optional) Shared secret token verified by Google Apps Script
 */

interface Env {
  GOOGLE_SCRIPT_URL?: string;
  NEXT_PUBLIC_RSVP_WEBHOOK_URL?: string;
  ADMIN_PASSCODE?: string;
  NEXT_PUBLIC_ADMIN_PASSCODE?: string;
  GOOGLE_WEBHOOK_SECRET?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequest = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const scriptUrl = (env.GOOGLE_SCRIPT_URL || env.NEXT_PUBLIC_RSVP_WEBHOOK_URL || "").trim();
  const configuredPasscode = (env.ADMIN_PASSCODE || env.NEXT_PUBLIC_ADMIN_PASSCODE || "").trim();
  const adminPasscode = configuredPasscode || "2027";
  const webhookSecret = (env.GOOGLE_WEBHOOK_SECRET || "").trim();
  const passcodeSource = env.ADMIN_PASSCODE
    ? "ADMIN_PASSCODE"
    : env.NEXT_PUBLIC_ADMIN_PASSCODE
    ? "NEXT_PUBLIC_ADMIN_PASSCODE"
    : "DEFAULT_2027";

  try {
    // Allow quick GET /api/rsvp?action=status diagnostic check (never exposes actual secrets)
    if (request.method === "GET") {
      const url = new URL(request.url);
      if (url.searchParams.get("action") === "status" || !scriptUrl) {
        return new Response(
          JSON.stringify({
            success: true,
            proxyActive: true,
            hasGoogleScriptUrl: Boolean(scriptUrl),
            passcodeSource,
            passcodeLength: adminPasscode.length,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (request.method === "POST") {
      const body = (await request.json()) as Record<string, unknown>;
      const action = body.action as string | undefined;

      // Server-side Admin Passcode Verification ALWAYS runs first
      if (action === "admin_list" || action === "admin_verify" || action === "add_guest") {
        const providedPin = String(body.passcode || "").trim();
        if (providedPin !== adminPasscode) {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Incorrect admin passcode (Cloudflare checked against ${passcodeSource}, length ${adminPasscode.length}).`,
            }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // If GOOGLE_SCRIPT_URL is not set yet, tell client that passcode IS valid
        // so it can unlock the dashboard in Local Demo Mode!
        if (!scriptUrl) {
          return new Response(
            JSON.stringify({
              success: true,
              authenticated: true,
              fallback: true,
              passcodeSource,
              message: "Admin authenticated via Cloudflare. GOOGLE_SCRIPT_URL is not set yet, using local storage.",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      if (!scriptUrl) {
        return new Response(
          JSON.stringify({
            success: false,
            fallback: true,
            error: "GOOGLE_SCRIPT_URL is not configured in Cloudflare environment variables.",
          }),
          {
            status: 503,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Forward request to Google Apps Script Web App
      const payloadToSend = {
        ...body,
        secret: webhookSecret,
      };

      // Note: Google Apps Script returns a 302 redirect to script.googleusercontent.com/macros/echo.
      // Cloudflare Workers fetch() preserves the POST method across 302 redirects if redirect: "follow"
      // is used, which Google rejects with an HTML 405 error page.
      // By handling the 302 redirect manually and switching to GET on the Location URL,
      // we reliably receive the JSON output from Google Apps Script!
      let googleRes = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payloadToSend),
        redirect: "manual",
      });

      if (googleRes.status === 301 || googleRes.status === 302 || googleRes.status === 303 || googleRes.status === 307 || googleRes.status === 308) {
        const redirectUrl = googleRes.headers.get("location");
        if (redirectUrl) {
          googleRes = await fetch(redirectUrl, {
            method: "GET",
            redirect: "follow",
          });
        }
      }

      const responseText = await googleRes.text();
      try {
        const parsed = JSON.parse(responseText);
        return new Response(JSON.stringify(parsed), {
          status: googleRes.ok ? 200 : googleRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        // Google returned an HTML error page or login redirect instead of JSON
        return new Response(
          JSON.stringify({
            success: false,
            authenticated: true,
            fallback: true,
            error: "Google Apps Script URL did not return valid JSON (check that 'Who has access' is set to 'Anyone').",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (!scriptUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          fallback: true,
          error: "GOOGLE_SCRIPT_URL is not configured in Cloudflare environment variables.",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (request.method === "GET") {
      const url = new URL(request.url);
      const targetUrl = new URL(scriptUrl);
      url.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
      if (webhookSecret) {
        targetUrl.searchParams.set("secret", webhookSecret);
      }

      const googleRes = await fetch(targetUrl.toString(), {
        method: "GET",
        redirect: "follow",
      });

      const responseText = await googleRes.text();
      try {
        const parsed = JSON.parse(responseText);
        return new Response(JSON.stringify(parsed), {
          status: googleRes.ok ? 200 : googleRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        // Google returned an HTML error page or login redirect instead of JSON
        return new Response(
          JSON.stringify({
            success: false,
            authenticated: true,
            fallback: true,
            error: "Google Apps Script URL did not return valid JSON (check that 'Who has access' is set to 'Anyone').",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        success: false,
        error: `Cloudflare Proxy Error: ${message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};
