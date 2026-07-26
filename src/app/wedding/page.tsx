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
import { Heart } from "lucide-react";

export default function WeddingPage() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] text-[#1B3B2B] p-8 text-center font-serif text-xl">Loading Wedding Website...</div>}>
      <div className="min-h-screen bg-[#FDFBF7] text-[#2E3834] font-sans selection:bg-[#C87A68] selection:text-white">
        <Navbar onOpenRsvp={() => setIsRsvpOpen(true)} />

        <main>
          <HeroSection onOpenRsvp={() => setIsRsvpOpen(true)} />
          <StorySection />
          <ScheduleSection />
          <VenueSection />

          {/* Embedded RSVP Banner Section */}
          <section id="rsvp-section" className="py-24 px-4 bg-[#F4EFEA] border-t border-[#E2D9CE]">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <span className="font-script text-3xl text-[#C87A68] block">
                  Celebration Attendance
                </span>
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
                  Kindly Respond By August 15, 2027
                </h2>
                <p className="text-[#2E3834] font-serif italic text-base sm:text-lg max-w-xl mx-auto">
                  Search your name or enter your personalized invitation code to submit your RSVP and dinner preference.
                </p>
                <div className="flex items-center justify-center space-x-3 text-[#E2D9CE] pt-2">
                  <span className="h-[1px] w-12 bg-[#E2D9CE]" />
                  <Heart className="w-3.5 h-3.5 text-[#C87A68] fill-[#C87A68]" />
                  <span className="h-[1px] w-12 bg-[#E2D9CE]" />
                </div>
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

        {/* Modal Overlay */}
        <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />
      </div>
    </Suspense>
  );
}
