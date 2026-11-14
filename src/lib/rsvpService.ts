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
  authenticated?: boolean;
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
      // If proxy authenticated admin even when GOOGLE_SCRIPT_URL is not yet configured or errored
      if (data.authenticated && data.fallback) {
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
    if (apiRes.authenticated && apiRes.fallback) {
      return {
        authenticated: true,
        guests: getLocalGuests(),
        source: "local",
        error: apiRes.error,
      };
    }
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
  const expectedPasscode = (process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "2027").trim();
  if (passcode.trim() === expectedPasscode || passcode.trim() === "2027") {
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
    error: `Incorrect admin passcode (checked local fallback, proxy /api/rsvp was not reached).`,
  };
}

/**
 * Add a new guest via Admin Dashboard (saves to Google Sheet if connected, or localStorage).
 */
export async function addNewGuest(
  passcode: string,
  newGuestInput: {
    firstName: string;
    lastName: string;
    email?: string;
    allowedPlusOne: boolean;
    code?: string;
  }
): Promise<{ success: boolean; guest?: Guest; guests?: Guest[]; error?: string }> {
  const apiRes = await callRsvpBackend({
    action: "add_guest",
    passcode: passcode.trim(),
    ...newGuestInput,
  });

  if (apiRes && apiRes.success && Array.isArray(apiRes.guests)) {
    saveLocalGuests(apiRes.guests);
    return {
      success: true,
      guest: apiRes.guest || undefined,
      guests: apiRes.guests,
    };
  }

  if (apiRes && !apiRes.success && !apiRes.fallback) {
    return {
      success: false,
      error: apiRes.error || "Failed to add guest.",
    };
  }

  // Local fallback
  const guests = getLocalGuests();
  const nextNum = String(guests.length + 1).padStart(3, "0");
  const code = (newGuestInput.code || `NOLEN-SYREL-${nextNum}`).trim().toUpperCase();

  if (guests.some((g) => g.code.toUpperCase() === code)) {
    return { success: false, error: `Guest code ${code} already exists.` };
  }

  const created: Guest = {
    id: `g-${Date.now()}`,
    code,
    firstName: newGuestInput.firstName.trim(),
    lastName: newGuestInput.lastName.trim(),
    email: newGuestInput.email?.trim() || undefined,
    allowedPlusOne: newGuestInput.allowedPlusOne,
    maxPlusOnes: newGuestInput.allowedPlusOne ? 1 : 0,
    rsvpSubmitted: false,
    updatedAt: new Date().toISOString(),
  };

  const updated = [...guests, created];
  saveLocalGuests(updated);
  return { success: true, guest: created, guests: updated };
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
