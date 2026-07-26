# 💒 Wedding Subsite Architecture & RSVP Hosting Guide
**For Nolen & Syrel's Wedding Website**

This document provides a detailed breakdown of the technical architecture, deployment options, and backend RSVP management options for Nolen & Syrel's wedding subsite.

---

## 📌 Executive Summary

We have created a personal wedding subsite at `/wedding` and an interactive RSVP portal at `/wedding/rsvp` (plus an Admin Dashboard at `/wedding/admin`).

### Key Features Built:
1. **Wedding Homepage (`/wedding`)**:
   - **Hero Section**: Couple names, date (October 17, 2026), location (Friday Harbor, WA), and real-time live countdown timer.
   - **Our Story**: Interactive timeline and fun facts about Nolen & Syrel.
   - **Schedule of Events**: Complete weekend timeline with dress codes, locations, and downloadable `.ics` calendar files.
   - **Venue & Travel**: Venue maps, airport advice, state ferry notice, and hotel room block copyable discount codes.
   - **Wedding Party**: Bridesmaids & groomsmen cards.
   - **Registry**: Honeymoon & home fund progress cards + store registry links.
   - **FAQs**: Accordion answering dress code, +1s, kids, and travel questions.

2. **RSVP Engine (`/wedding/rsvp`)**:
   - **Personalized Links & QR Codes**: Supports URLs like `/wedding/rsvp?code=NOLEN-SYREL-001` to pre-fill guest details automatically.
   - **Name Lookup**: Guests can search by First & Last Name against the official guest list.
   - **Guest Validation**: Only guests on the guest list are allowed to RSVP.
   - **+1 Handling**: Automatically checks if the guest is allowed a +1. Prompts for +1 attendance, first/last name, meal preference, and dietary needs.
   - **Catering Menu**: Primary guest & +1 select entrée choice (Filet Mignon, Pacific Salmon, Truffle Risotto, Roasted Chicken) + allergy/dietary fields.
   - **Song Request & Note**: Captures dance floor song requests and personal messages for the couple.
   - **Digital Ticket & Confetti**: Visual guest pass with mock QR code + capability for guests to re-edit responses anytime.

3. **Admin Dashboard (`/wedding/admin`)**:
   - Live RSVP response rate, headcount tracking (primary + plus-ones), meal totals summary, guest table filtering, CSV export, and individual guest invitation link generator.

---

## 🛠️ Architecture & Hosting Options (Cost & UX Comparison)

Since the website is currently deployed on **Cloudflare Pages**, and Nolen has access to **Microsoft Azure credits** and **GitHub perks**, here are the top 3 recommended backend approaches for hosting and managing RSVPs:

### Option 1: Cloudflare Pages + Google Sheets Webhook (Recommended • $0/month)
* **How it works**:
  - The website remains 100% static on Cloudflare Pages (blazing fast, global CDN).
  - A small Google Apps Script webhook bridges the website RSVP form directly to a private **Google Sheet**.
  - When a guest submits their RSVP, it updates the Google Sheet in real time.
* **Why it's great**:
  - **Zero Cost**: Completely free ($0/mo).
  - **Best Couple UX**: Nolen and Syrel can view, filter, and edit their guest list directly in a spreadsheet on their phones or laptops without needing SQL or database admin tools.
  - **Easy Invitation Import**: Trivial to paste guest names and generate invitation codes.

### Option 2: Azure Static Web Apps + Azure Table Storage / Functions (Using Azure Credits • $0)
* **How it works**:
  - Deploy the Next.js app to **Azure Static Web Apps (SWA)**.
  - Attach a managed C# or Node.js **Azure Function** backend.
  - Store RSVPs in **Azure Table Storage** or **Azure Cosmos DB** (NoSQL).
* **Why it's great**:
  - Leverages Microsoft employee Azure credits ($150/mo credit).
  - Production-grade enterprise SLA, automated GitHub Actions deployment.

### Option 3: Cloudflare Pages + Cloudflare D1 (Serverless SQLite • $0/month)
* **How it works**:
  - Deploy Cloudflare Pages Functions (`/api/rsvp.ts`) backed by **Cloudflare D1**.
  - D1 is a serverless SQL database running at the edge.
* **Why it's great**:
  - Everything stays within the Cloudflare ecosystem.
  - 100,000 free database write operations per day.

---

## 🚀 How to Run the Local Demo

To preview the website locally on your NixOS machine:

```bash
# 1. Enter the nix environment (or rely on direnv)
nix develop

# 2. Start Next.js development server
npm run dev
```

Then open your browser to:
- **Wedding Homepage**: `http://localhost:3000/wedding`
- **RSVP Portal**: `http://localhost:3000/wedding/rsvp`
- **Sample Personalized Link**: `http://localhost:3000/wedding/rsvp?code=NOLEN-SYREL-001`
- **Admin RSVP Dashboard**: `http://localhost:3000/wedding/admin`

---

## 📁 File Structure Reference

```
src/
├── app/
├── page.tsx               # Main personal homepage with wedding feature banner
│   └── wedding/
│       ├── page.tsx           # Main Wedding Subsite (Hero, Story, Schedule, Venue, etc.)
│       ├── rsvp/
│       │   └── page.tsx       # Dedicated RSVP Portal
│       └── admin/
│           └── page.tsx       # RSVP Admin Dashboard & CSV Exporter
├── components/
│   └── wedding/
│       ├── Navbar.tsx         # Sticky navigation with mobile menu
│       ├── HeroSection.tsx    # Romantic hero header
│       ├── CountdownTimer.tsx # Live countdown to Oct 17, 2026
│       ├── StorySection.tsx   # Timeline & fun facts
│       ├── ScheduleSection.tsx# Schedule of events + .ics calendar export
│       ├── VenueSection.tsx   # Venue details, hotel blocks & ferry notice
│       ├── PartySection.tsx   # Wedding party bios
│       ├── RegistrySection.tsx# Honeymoon funds & registries
│       ├── FaqSection.tsx     # Categorized FAQ accordion
│       ├── RsvpForm.tsx       # Multi-step guest lookup, +1, meal & song flow
│       ├── RsvpModal.tsx      # Modal wrapper for RSVP
│       └── Footer.tsx         # Romantic footer & admin link
├── data/
│   ├── weddingConfig.ts   # Centralized text, schedule, venue & meal config
│   └── guestList.ts       # Guest schema & sample dataset
└── lib/
    └── rsvpService.ts     # Client state & storage service layer
```
