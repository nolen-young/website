import { Guest, INITIAL_GUEST_LIST, PlusOneData } from "../data/guestList";

const STORAGE_KEY = "nolen_syrel_wedding_guest_list_v1";

/**
 * Helper to get guests from localStorage or fallback to initial dataset.
 */
export function getGuests(): Guest[] {
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

/**
 * Save guests back to localStorage.
 */
export function saveGuests(guests: Guest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  } catch (err) {
    console.error("Error saving guests to localStorage:", err);
  }
}

/**
 * Find guest by code (case-insensitive).
 */
export function findGuestByCode(code: string): Guest | null {
  if (!code || !code.trim()) return null;
  const cleanCode = code.trim().toUpperCase();
  const guests = getGuests();
  return guests.find((g) => g.code.toUpperCase() === cleanCode) || null;
}

/**
 * Search guests by full name or partial name matching.
 */
export function searchGuestsByName(nameQuery: string): Guest[] {
  if (!nameQuery || !nameQuery.trim()) return [];
  const queryParts = nameQuery.trim().toLowerCase().split(/\s+/);
  const guests = getGuests();

  return guests.filter((g) => {
    const fn = g.firstName.toLowerCase();
    const ln = g.lastName.toLowerCase();
    const fullName = `${fn} ${ln}`;

    // If single word query, check if first name or last name starts with/includes it
    if (queryParts.length === 1) {
      const q = queryParts[0];
      return fn.includes(q) || ln.includes(q);
    }

    // If multi-word query, match both first and last name components
    return queryParts.every((part) => fullName.includes(part));
  });
}

export interface RsvpPayload {
  attending: boolean;
  mealPreference?: string;
  dietaryRestrictions?: string;
  plusOne?: PlusOneData;
  songRequest?: string;
  message?: string;
}

/**
 * Submit or update RSVP for a guest.
 */
export function submitRsvp(guestId: string, payload: RsvpPayload): Guest | null {
  const guests = getGuests();
  const index = guests.findIndex((g) => g.id === guestId);
  if (index === -1) return null;

  const existing = guests[index];
  const updatedGuest: Guest = {
    ...existing,
    rsvpSubmitted: true,
    attending: payload.attending,
    mealPreference: payload.attending ? payload.mealPreference : undefined,
    dietaryRestrictions: payload.attending ? payload.dietaryRestrictions : undefined,
    plusOne: existing.allowedPlusOne ? payload.plusOne : undefined,
    songRequest: payload.songRequest || "",
    message: payload.message || "",
    updatedAt: new Date().toISOString(),
  };

  guests[index] = updatedGuest;
  saveGuests(guests);
  return updatedGuest;
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
