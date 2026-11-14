import { Guest, INITIAL_GUEST_LIST, PlusOneData } from "../data/guestList";

const STORAGE_KEY = "nolen_syrel_wedding_guest_list_v1";
const DIRECT_WEBHOOK_URL = process.env.NEXT_PUBLIC_RSVP_WEBHOOK_URL || "";

export interface RsvpPayload {
  attending: boolean;
  dietaryRestrictions?: string;
  plusOne?: PlusOneData;
  songRequest?: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  fallback?: boolean;
  error?: string;
  guest?: Guest | null;
  guests?: Guest[];
}

/**
 * Internal helper to call Cloudflare Pages Function (/api/rsvp) first,
 * or NEXT_PUBLIC_RSVP_WEBHOOK_URL directly if configured,
 * and return null if no backend is reachable (allowing localStorage fallback).
 */
async function callRsvpBackend(body: Record<string, unknown>): Promise<ApiResponse | null> {
  if (typeof window === "undefined") return null;

  // 1. Try Cloudflare Pages Function proxy (/api/rsvp)
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as ApiResponse;
      // If proxy returned 401 (invalid admin passcode), return it immediately without falling back
      if (res.status === 401) {
        return data;
      }
      // If proxy succeeded (and didn't signal missing env var fallback)
      if (!data.fallback && res.status !== 503) {
        return data;
      }
    }
  } catch {
    // Proxy endpoint not available (e.g. running `next dev` locally), continue to fallback check
  }

  // 2. Try direct Google Apps Script URL if NEXT_PUBLIC_RSVP_WEBHOOK_URL is set
  if (DIRECT_WEBHOOK_URL) {
    try {
      const res = await fetch(DIRECT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(body),
        redirect: "follow",
      });
      const data = (await res.json()) as ApiResponse;
      return data;
    } catch (err) {
      console.error("Error calling direct RSVP webhook:", err);
    }
  }

  return null;
}

/**
 * Helper to get guests from localStorage or fallback to initial dataset.
 */
export function getLocalGuests(): Guest[] {
  if (typeof window === "undefined") {
    return INITIAL_GUEST_LIST;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUEST_LIST));
      return INITIAL_GUEST_LIST;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error("Error reading guests from localStorage:", err);
    return INITIAL_GUEST_LIST;
  }
}

export const getGuests = getLocalGuests;

/**
 * Save guests back to localStorage.
 */
export function saveLocalGuests(guests: Guest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  } catch (err) {
    console.error("Error saving guests to localStorage:", err);
  }
}

/**
 * Update or insert a single guest inside the localStorage cache.
 */
function upsertLocalGuest(guest: Guest): void {
  const guests = getLocalGuests();
  const idx = guests.findIndex(
    (g) => g.code.toUpperCase() === guest.code.toUpperCase() || g.id === guest.id
  );
  if (idx !== -1) {
    guests[idx] = guest;
  } else {
    guests.push(guest);
  }
  saveLocalGuests(guests);
}

/**
 * Find guest by code (case-insensitive) via Backend API with local fallback.
 */
export async function findGuestByCode(code: string): Promise<Guest | null> {
  if (!code || !code.trim()) return null;
  const cleanCode = code.trim().toUpperCase();

  const apiRes = await callRsvpBackend({ action: "code", code: cleanCode });
  if (apiRes && apiRes.success) {
    if (apiRes.guest) {
      upsertLocalGuest(apiRes.guest);
    }
    return apiRes.guest || null;
  }

  // Fallback to localStorage
  const guests = getLocalGuests();
  return guests.find((g) => g.code.toUpperCase() === cleanCode) || null;
}

/**
 * Search guests by full name or partial name matching via Backend API with local fallback.
 */
export async function searchGuestsByName(nameQuery: string): Promise<Guest[]> {
  if (!nameQuery || !nameQuery.trim()) return [];
  const cleanQuery = nameQuery.trim();

  const apiRes = await callRsvpBackend({ action: "search", query: cleanQuery });
  if (apiRes && apiRes.success && Array.isArray(apiRes.guests)) {
    apiRes.guests.forEach(upsertLocalGuest);
    return apiRes.guests;
  }

  // Fallback to localStorage
  const queryParts = cleanQuery.toLowerCase().split(/\s+/);
  const guests = getLocalGuests();

  return guests.filter((g) => {
    const fn = g.firstName.toLowerCase();
    const ln = g.lastName.toLowerCase();
    const fullName = `${fn} ${ln}`;

    if (queryParts.length === 1) {
      const q = queryParts[0];
      return fn.includes(q) || ln.includes(q);
    }

    return queryParts.every((part) => fullName.includes(part));
  });
}

/**
 * Submit or update RSVP for a guest via Backend API with local fallback.
 */
export async function submitRsvp(
  guest: Guest,
  payload: RsvpPayload
): Promise<{ guest: Guest | null; syncedToCloud: boolean; error?: string }> {
  const apiRes = await callRsvpBackend({
    action: "submit",
    id: guest.id,
    code: guest.code,
    ...payload,
  });

  if (apiRes && apiRes.success && apiRes.guest) {
    upsertLocalGuest(apiRes.guest);
    return { guest: apiRes.guest, syncedToCloud: true };
  }

  // Update local storage fallback
  const guests = getLocalGuests();
  const index = guests.findIndex(
    (g) => g.id === guest.id || g.code.toUpperCase() === guest.code.toUpperCase()
  );

  const updatedGuest: Guest = {
    ...guest,
    rsvpSubmitted: true,
    attending: payload.attending,
    dietaryRestrictions: payload.attending ? payload.dietaryRestrictions : undefined,
    plusOne: guest.allowedPlusOne ? payload.plusOne : undefined,
    songRequest: payload.songRequest || "",
    message: payload.message || "",
    updatedAt: new Date().toISOString(),
  };

  if (index !== -1) {
    guests[index] = updatedGuest;
  } else {
    guests.push(updatedGuest);
  }
  saveLocalGuests(guests);

  return {
    guest: updatedGuest,
    syncedToCloud: false,
    error: apiRes?.error,
  };
}

/**
 * Authenticate Admin Passcode & Fetch All Guests from Google Sheets (or fallback to local).
 */
export async function fetchAdminGuests(passcode: string): Promise<{
  authenticated: boolean;
  guests: Guest[];
  source: "cloud" | "local";
  error?: string;
}> {
  const apiRes = await callRsvpBackend({
    action: "admin_list",
    passcode: passcode.trim(),
  });

  if (apiRes) {
    if (!apiRes.success) {
      return {
        authenticated: false,
        guests: [],
        source: "cloud",
        error: apiRes.error || "Incorrect admin passcode. Access denied.",
      };
    }
    if (Array.isArray(apiRes.guests)) {
      saveLocalGuests(apiRes.guests);
      return {
        authenticated: true,
        guests: apiRes.guests,
        source: "cloud",
      };
    }
  }

  // Fallback for local development when Cloudflare proxy / Google Sheet is not configured
  const expectedPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "2027";
  if (passcode.trim() === expectedPasscode) {
    return {
      authenticated: true,
      guests: getLocalGuests(),
      source: "local",
    };
  }

  return {
    authenticated: false,
    guests: [],
    source: "local",
    error: "Incorrect admin passcode. Access denied.",
  };
}

/**
 * Reset local storage back to initial guest list (useful for testing & admin).
 */
export function resetGuestListToDefault(): Guest[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUEST_LIST));
  }
  return INITIAL_GUEST_LIST;
}
