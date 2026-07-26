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
    adminPasscode: process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "2027",
  },
  date: {
    fullDate: "Saturday, October 2, 2027",
    isoDate: "2027-10-02T16:00:00-07:00",
    year: "2027",
    time: "4:00 PM PST",
  },
  venue: {
    ceremony: {
      name: "Woodland Meadow Farms",
      address: "13428 Shorts School Rd, Snohomish, WA 98290",
      cityState: "Snohomish, Washington",
      googleMapsUrl: "https://maps.app.goo.gl/fScsCcTGRF3bGeKT8",
      description: "A scenic outdoor pine grove and garden venue nestled in the Snohomish River Valley, featuring covered pavilion seating, fire pits, and rustic Pacific Northwest charm.",
    },
    reception: {
      name: "The Pavilion at Woodland Meadow Farms",
      address: "13428 Shorts School Rd, Snohomish, WA 98290",
      description: "Cocktail hour on the lawn at 5:00 PM, followed by dinner, toasts, and dancing under the pavilion string lights.",
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
      time: "Friday, Oct 1 • 6:30 PM",
      title: "Welcome Drinks & Small Bites",
      location: "Downtown Snohomish Lounge",
      description: "Kick off the weekend with us! Casual drinks and appetizers in historic downtown Snohomish.",
      attire: "Smart Casual",
    },
    {
      id: "ceremony",
      time: "Saturday, Oct 2 • 4:00 PM",
      title: "Wedding Ceremony",
      location: "Pine Grove Lawn at Woodland Meadow Farms",
      description: "Please arrive 15-20 minutes early to take your seats among the trees. Ceremony begins promptly at 4:00 PM.",
      attire: "Formal / Black-Tie Optional",
    },
    {
      id: "cocktail",
      time: "Saturday, Oct 2 • 5:00 PM",
      title: "Cocktail Hour",
      location: "Meadow Patio & Fire Pits",
      description: "Signature cocktails, lawn games, and butler-passed hors d'oeuvres while the newlyweds take photos.",
      attire: "Formal",
    },
    {
      id: "reception",
      time: "Saturday, Oct 2 • 6:30 PM",
      title: "Dinner, Toasts & Dancing",
      location: "The Pavilion at Woodland Meadow Farms",
      description: "Plated farm-to-table dinner, wedding cake, heartfelt toasts, and dancing until late!",
      attire: "Formal",
    },
    {
      id: "brunch",
      time: "Sunday, Oct 3 • 10:00 AM",
      title: "Farewell Coffee & Pastries",
      location: "Historic Downtown Snohomish Courtyard",
      description: "Drop by for fresh coffee, pastries, and hugs before heading home or departing for the airport.",
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
      description: "Creamy arborio rice with roasted chanterelles, fresh herbs, and parmesan reggiano.",
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
        name: "Paine Field Snohomish County Airport (PAE)",
        distance: "20 minutes drive to venue",
        notes: "Closest and most convenient airport in Everett, WA with direct flights on Alaska Airlines.",
      },
      {
        name: "Seattle-Tacoma International Airport (SEA)",
        distance: "45 minutes drive to venue",
        notes: "Major hub with all airlines. Rental car or ride-share recommended.",
      },
    ],
    hotels: [
      {
        name: "The Snohomish Inn",
        address: "323 2nd St, Snohomish, WA 98290",
        phone: "(360) 568-1800",
        code: "NOLENSYREL2027",
        rate: "$169 / night",
        bookingUrl: "#",
        notes: "Located in historic downtown Snohomish, 10 minutes drive from Woodland Meadow Farms.",
      },
      {
        name: "Hotel Indigo Everett Waterfront",
        address: "1028 13th St, Everett, WA 98201",
        phone: "(425) 217-3000",
        code: "YOUNG2027",
        rate: "$189 / night",
        bookingUrl: "#",
        notes: "Boutique waterfront hotel in Everett, 20 minutes from the venue.",
      },
    ] as HotelBlock[],
    ferryNotice: "Snohomish Travel Tip: Woodland Meadow Farms is easily accessible by car via US-2 E or WA-9. Rideshare services (Uber/Lyft) operate in the area, but reserving rides in advance is recommended for the end of the evening.",
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
      answer: "Please submit your RSVP by August 15, 2027 so we can finalize headcounts and catering orders.",
      category: "rsvp",
    },
    {
      question: "Can I bring a +1?",
      answer: "Due to venue capacity, only guests explicitly indicated on your invitation/RSVP portal are allowed a plus one. When you search your name on the RSVP tab, it will automatically inform you if a +1 is included.",
      category: "rsvp",
    },
    {
      question: "Are kids invited?",
      answer: "We love your little ones, but our wedding will be an adults-only celebration (18+) except for immediate family in the wedding party. We hope this allows parents to relax and enjoy the night!",
      category: "general",
    },
    {
      question: "What is the dress code?",
      answer: "The dress code is Formal / Black-Tie Optional. Gentlemen can wear a tuxedo or dark suit and tie. Ladies can wear floor-length gowns, formal cocktail dresses, or elegant dressy separates. Grass-friendly shoes are recommended for the lawn ceremony!",
      category: "attire",
    },
    {
      question: "Is the wedding indoors or outdoors?",
      answer: "The ceremony will take place outdoors on the pine grove lawn (weather permitting), followed by cocktail hour on the outdoor patio, and dinner/dancing under the covered, heated pavilion.",
      category: "general",
    },
    {
      question: "What should I do if I have dietary restrictions?",
      answer: "You can select your meal preference and list any dietary restrictions, food allergies, or vegan/gluten-free requirements directly during your RSVP flow on this website!",
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
