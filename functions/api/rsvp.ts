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

  const scriptUrl = env.GOOGLE_SCRIPT_URL || env.NEXT_PUBLIC_RSVP_WEBHOOK_URL;
  const adminPasscode = env.ADMIN_PASSCODE || env.NEXT_PUBLIC_ADMIN_PASSCODE || "2027";
  const webhookSecret = env.GOOGLE_WEBHOOK_SECRET || "";

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

  try {
    if (request.method === "POST") {
      const body = (await request.json()) as Record<string, unknown>;
      const action = body.action as string | undefined;

      // Server-side Admin Passcode Verification before calling Google Sheets
      if (action === "admin_list" || action === "admin_verify") {
        const providedPin = String(body.passcode || "").trim();
        if (providedPin !== adminPasscode) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Incorrect admin passcode. Access denied.",
            }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      // Forward request to Google Apps Script Web App
      const payloadToSend = {
        ...body,
        secret: webhookSecret,
      };

      const googleRes = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          // Use text/plain to avoid CORS preflight issues with Google Apps Script redirects
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payloadToSend),
        redirect: "follow",
      });

      const responseText = await googleRes.text();
      return new Response(responseText, {
        status: googleRes.ok ? 200 : googleRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      return new Response(responseText, {
        status: googleRes.ok ? 200 : googleRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
