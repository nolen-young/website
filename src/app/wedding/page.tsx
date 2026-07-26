"use client";

import React, { useState, Suspense } from "react";
import { Navbar } from "@/components/wedding/Navbar";
import { HeroSection } from "@/components/wedding/HeroSection";
import { StorySection } from "@/components/wedding/StorySection";
import { ScheduleSection } from "@/components/wedding/ScheduleSection";
import { VenueSection } from "@/components/wedding/VenueSection";
import { PartySection } from "@/components/wedding/PartySection";
import { RegistrySection } from "@/components/wedding/RegistrySection";
import { FaqSection } from "@/components/wedding/FaqSection";
import { Footer } from "@/components/wedding/Footer";
import { RsvpModal } from "@/components/wedding/RsvpModal";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { Sparkles, Calendar, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export default function WeddingPage() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 text-amber-200 p-8 text-center">Loading Wedding Site...</div>}>
      <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
        <Navbar onOpenRsvp={() => setIsRsvpOpen(true)} />

        <main>
          <HeroSection onOpenRsvp={() => setIsRsvpOpen(true)} />
          <StorySection />
          <ScheduleSection />
          <VenueSection />

          {/* Embedded RSVP Banner Section */}
          <section id="rsvp-section" className="py-24 px-4 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-t border-stone-800">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RSVP Online</span>
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
                  Kindly Respond By Sept 1, 2026
                </h2>
                <p className="text-stone-400 font-serif italic text-base sm:text-lg max-w-xl mx-auto">
                  Search your name or enter your personalized invitation code to submit your RSVP and dinner preference.
                </p>
              </div>

              {/* Inline Form */}
              <RsvpForm />
            </div>
          </section>

          <PartySection />
          <RegistrySection />
          <FaqSection />
        </main>

        <Footer />

        {/* Modal Overlay for Navigation Bar RSVP button */}
        <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />
      </div>
    </Suspense>
  );
}
