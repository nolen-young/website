export interface PlusOneData {
  attending: boolean;
  firstName?: string;
  lastName?: string;
  mealPreference?: string;
  dietaryRestrictions?: string;
}

export interface Guest {
  id: string;
  code: string; // Used for personalized URL e.g. /wedding/rsvp?code=NOLEN-SYREL-001
  firstName: string;
  lastName: string;
  email?: string;
  allowedPlusOne: boolean;
  maxPlusOnes: number;
  rsvpSubmitted: boolean;
  attending?: boolean;
  mealPreference?: string;
  dietaryRestrictions?: string;
  plusOne?: PlusOneData;
  songRequest?: string;
  message?: string;
  updatedAt?: string;
}

export const INITIAL_GUEST_LIST: Guest[] = [
  {
    id: "g1",
    code: "NOLEN-SYREL-001",
    firstName: "Alex",
    lastName: "Rivers",
    email: "alex.rivers@example.com",
    allowedPlusOne: true,
    maxPlusOnes: 1,
    rsvpSubmitted: false,
  },
  {
    id: "g2",
    code: "NOLEN-SYREL-002",
    firstName: "Jordan",
    lastName: "Smith",
    email: "jordan.smith@example.com",
    allowedPlusOne: true,
    maxPlusOnes: 1,
    rsvpSubmitted: true,
    attending: true,
    mealPreference: "filet",
    dietaryRestrictions: "None",
    plusOne: {
      attending: true,
      firstName: "Morgan",
      lastName: "Smith",
      mealPreference: "salmon",
      dietaryRestrictions: "Gluten free",
    },
    songRequest: "September - Earth, Wind & Fire",
    message: "So thrilled for you both! Can't wait to celebrate!",
    updatedAt: "2026-07-20T14:30:00Z",
  },
  {
    id: "g3",
    code: "NOLEN-SYREL-003",
    firstName: "Taylor",
    lastName: "Johnson",
    email: "taylor.j@example.com",
    allowedPlusOne: false,
    maxPlusOnes: 0,
    rsvpSubmitted: false,
  },
  {
    id: "g4",
    code: "NOLEN-SYREL-004",
    firstName: "Sam",
    lastName: "Wilson",
    email: "sam.wilson@example.com",
    allowedPlusOne: true,
    maxPlusOnes: 1,
    rsvpSubmitted: false,
  },
  {
    id: "g5",
    code: "NOLEN-SYREL-005",
    firstName: "Casey",
    lastName: "Miller",
    email: "casey.m@example.com",
    allowedPlusOne: false,
    maxPlusOnes: 0,
    rsvpSubmitted: true,
    attending: false,
    message: "Wishing you both a lifetime of happiness! So sorry to miss it.",
    updatedAt: "2026-07-15T09:12:00Z",
  },
  {
    id: "g6",
    code: "NOLEN-SYREL-006",
    firstName: "Riley",
    lastName: "Davis",
    email: "riley.davis@example.com",
    allowedPlusOne: true,
    maxPlusOnes: 1,
    rsvpSubmitted: false,
  },
  {
    id: "g7",
    code: "NOLEN-SYREL-007",
    firstName: "Chris",
    lastName: "Evans",
    email: "chris.e@example.com",
    allowedPlusOne: true,
    maxPlusOnes: 1,
    rsvpSubmitted: false,
  },
  {
    id: "g8",
    code: "NOLEN-SYREL-008",
    firstName: "Jamie",
    lastName: "Lee",
    email: "jamie.l@example.com",
    allowedPlusOne: true,
    maxPlusOnes: 1,
    rsvpSubmitted: false,
  },
];
