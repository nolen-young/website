export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  attire?: string;
  icon?: string;
}

export interface FunFact {
  title: string;
  description: string;
  category: "how_we_met" | "first_date" | "proposal" | "hobbies" | "fun_fact";
  iconName: string;
}

export interface HotelBlock {
  name: string;
  address: string;
  phone: string;
  code: string;
  rate: string;
  bookingUrl: string;
  notes: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "general" | "rsvp" | "travel" | "attire";
}

export interface WeddingPartyMember {
  name: string;
  role: string;
  relation: string;
  bio: string;
  image: string;
}

export interface MealOption {
  id: string;
  name: string;
  description: string;
  tags: string[]; // e.g. ["GF", "Vegan", "Chef Choice"]
}

export const WEDDING_CONFIG = {
  couple: {
    groom: "Nolen",
    bride: "Syrel",
    groomFullName: "Nolen Young",
    brideFullName: "Syrel",
    hashtag: "#SyrelFoundHerNolen",
    initials: "N & S",
  },
  date: {
    fullDate: "Saturday, October 17, 2026",
    isoDate: "2026-10-17T16:00:00-07:00",
    year: "2026",
    time: "4:00 PM PST",
  },
  venue: {
    ceremony: {
      name: "The San Juan Island Ocean Resort",
      address: "1250 Oceanview Drive, Friday Harbor, WA 98250",
      cityState: "Friday Harbor, Washington",
      googleMapsUrl: "https://maps.google.com/?q=Friday+Harbor+WA",
      description: "An outdoor cliffside lawn overlooking the Salish Sea, followed by dinner and dancing in the Grand Pavilion.",
    },
    reception: {
      name: "The Grand Pavilion & Fireside Terrace",
      address: "1250 Oceanview Drive, Friday Harbor, WA 98250",
      description: "Cocktail hour on the terrace starting at 5:00 PM, followed by dinner, toasts, and dancing until midnight.",
    },
  },
  attire: {
    code: "Formal / Black-Tie Optional",
    description: "We invite you to dress up with us! Tuxedos or dark suits for gentlemen, and floor-length gowns or elegant cocktail dresses for ladies.",
    palette: [
      { name: "Forest Evergreen", hex: "#1B3B2B" },
      { name: "Pinkish Taupe", hex: "#C87A68" },
      { name: "Soft Ivory", hex: "#FDFBF7" },
      { name: "Sage Green", hex: "#7A9A8B" },
    ],
  },
  schedule: [
    {
      id: "welcome",
      time: "Friday, Oct 16 • 6:30 PM",
      title: "Welcome Sunset Drinks & Bites",
      location: "Harbor Lounge Deck",
      description: "Kick off the weekend with us! Casual drinks, heavy appetizers, and stunning island sunset views.",
      attire: "Smart Casual",
    },
    {
      id: "ceremony",
      time: "Saturday, Oct 17 • 4:00 PM",
      title: "Wedding Ceremony",
      location: "Oceanfront Lawn",
      description: "Please arrive 15-20 minutes early to take your seats. Ceremony starts promptly at 4:00 PM.",
      attire: "Formal / Black-Tie Optional",
    },
    {
      id: "cocktail",
      time: "Saturday, Oct 17 • 5:00 PM",
      title: "Cocktail Hour",
      location: "Fireside Terrace",
      description: "Signature cocktails, lawn games, and butler-passed hors d'oeuvres while the newlyweds take photos.",
      attire: "Formal",
    },
    {
      id: "reception",
      time: "Saturday, Oct 17 • 6:30 PM",
      title: "Dinner, Toasts & Dancing",
      location: "The Grand Pavilion",
      description: "Three-course plated dinner, wedding cake, heartfelt toasts, and live DJ until late!",
      attire: "Formal",
    },
    {
      id: "brunch",
      time: "Sunday, Oct 18 • 10:00 AM",
      title: "Farewell Coffee & Brunch",
      location: "Harbor Bistro Courtyard",
      description: "Drop by for coffee, pastries, and hugs before heading home or taking the ferry.",
      attire: "Casual",
    },
  ] as ScheduleItem[],

  meals: [
    {
      id: "filet",
      name: "Herb-Crusted Filet Mignon",
      description: "Prime beef tenderloin served with truffle mashed potatoes, roasted asparagus, and red wine reduction.",
      tags: ["GF"],
    },
    {
      id: "salmon",
      name: "Wild Pacific Salmon",
      description: "Pan-seared Atlantic salmon with lemon dill butter, wild rice pilaf, and charred broccolini.",
      tags: ["GF"],
    },
    {
      id: "risotto",
      name: "Wild Mushroom & Truffle Risotto",
      description: "Creamy arborio rice with roasted chanterelles, fresh herbs, and parmesan reggiano (or vegan cheese option).",
      tags: ["Vegetarian", "GF Available"],
    },
    {
      id: "chicken",
      name: "Rosemary Roasted Chicken Breast",
      description: "Farm-raised chicken with garlic herb glaze, roasted fingerling potatoes, and seasonal root vegetables.",
      tags: ["GF"],
    },
  ] as MealOption[],

  funFacts: [
    {
      title: "How We Met",
      description: "Nolen & Syrel met through mutual tech friends in Seattle over coffee and a debate about software architecture!",
      category: "how_we_met",
      iconName: "Coffee",
    },
    {
      title: "The First Date",
      description: "Their first official date was an 8-hour adventure including tacos, board games, and walking along Alki Beach until midnight.",
      category: "first_date",
      iconName: "Heart",
    },
    {
      title: "The Proposal",
      description: "Nolen proposed during a weekend hike in the Cascade Mountains at sunrise overlooking a pristine alpine lake.",
      category: "proposal",
      iconName: "Sparkles",
    },
    {
      title: "Favorite Shared Hobby",
      description: "Building cool tech projects together, cooking gourmet dinners, and traveling to National Parks.",
      category: "hobbies",
      iconName: "Compass",
    },
  ] as FunFact[],

  travel: {
    airports: [
      {
        name: "Seattle-Tacoma International Airport (SEA)",
        distance: "2.5 hours via car & ferry",
        notes: "Fly into SEA, rent a car, and drive to Anacortes Ferry Terminal.",
      },
      {
        name: "Paine Field Snohomish County Airport (PAE)",
        distance: "1.5 hours via car & ferry",
        notes: "Convenient alternative closer to Anacortes ferry.",
      },
    ],
    hotels: [
      {
        name: "San Juan Island Resort & Suites",
        address: "1250 Oceanview Dr, Friday Harbor, WA",
        phone: "(360) 555-0199",
        code: "NOLENSYREL2026",
        rate: "$199 / night",
        bookingUrl: "#",
        notes: "Primary room block location where ceremony & reception take place.",
      },
      {
        name: "Friday Harbor House",
        address: "130 1st St, Friday Harbor, WA",
        phone: "(360) 555-0144",
        code: "YOUNG2026",
        rate: "$179 / night",
        bookingUrl: "#",
        notes: "Boutique hotel 5 minutes from venue, overlooking harbor.",
      },
    ] as HotelBlock[],
    ferryNotice: "Important: Washington State Ferries require advance reservations for vehicles traveling between Anacortes and Friday Harbor. We recommend booking ferry tickets 30 days in advance!",
  },

  registry: {
    description: "Your presence at our wedding is the greatest gift of all! If you would like to give a gift, we have set up a Honeymoon & New Home fund as well as registries below.",
    funds: [
      {
        name: "Honeymoon in Japan Fund",
        description: "Help us explore Tokyo, Kyoto, and relax in traditional hot spring onsens!",
        url: "#",
        category: "Travel",
      },
      {
        name: "First Home Renovation Fund",
        description: "Contributions toward building our dream home office and backyard garden.",
        url: "#",
        category: "Home",
      },
    ],
    stores: [
      { name: "Zola Registry", logo: "🎁", url: "#" },
      { name: "Crate & Barrel", logo: "🏡", url: "#" },
      { name: "Target Registry", logo: "🎯", url: "#" },
    ],
  },

  faqs: [
    {
      question: "When should I RSVP by?",
      answer: "Please submit your RSVP by September 1, 2026 so we can finalize headcounts and meal orders with our caterers.",
      category: "rsvp",
    },
    {
      question: "Can I bring a +1?",
      answer: "Due to venue capacity, only guests explicitly indicated on your invitation/RSVP page are allowed a plus one. When you search your name on the RSVP tab, it will automatically inform you if a +1 is included.",
      category: "rsvp",
    },
    {
      question: "Are kids invited?",
      answer: "We love your little ones, but our wedding will be an adults-only celebration (18+) except for immediate family in the wedding party. We hope this allows parents to relax and enjoy the night!",
      category: "general",
    },
    {
      question: "What is the dress code?",
      answer: "The dress code is Formal / Black-Tie Optional. Gentlemen can wear a tuxedo or dark suit and tie. Ladies can wear floor-length gowns, formal cocktail dresses, or elegant dressy separates.",
      category: "attire",
    },
    {
      question: "Is the wedding indoors or outdoors?",
      answer: "The ceremony will be outdoors on the oceanfront lawn (weather permitting), followed by cocktail hour on the covered terrace, and dinner/dancing indoors in the climate-controlled Grand Pavilion.",
      category: "general",
    },
    {
      question: "What should I do if I have dietary restrictions?",
      answer: "You will be able to select your meal preference and list any dietary restrictions, food allergies, or vegan/gluten-free requirements directly during your RSVP flow on this website!",
      category: "rsvp",
    },
  ] as FaqItem[],

  weddingParty: [
    {
      name: "Marcus Vance",
      role: "Best Man",
      relation: "Nolen's College Best Friend",
      bio: "Nolen's roommate from college and designated board game strategist.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Maid of Honor",
      relation: "Syrel's Sister & Bestie",
      bio: "Syrel's sister, coffee addict, and master wedding planner assistant.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "David Chen",
      role: "Groomsman",
      relation: "Nolen's Tech Teammate",
      bio: "Co-conspirator in midnight hackathons and outdoor hiking enthusiast.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Sophia Martinez",
      role: "Bridesmaid",
      relation: "Syrel's Childhood Friend",
      bio: "Has known Syrel since 3rd grade and holds all the funniest middle school memories.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    },
  ] as WeddingPartyMember[],
};
