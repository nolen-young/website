"use client";

import React from "react";
import { Calendar, MapPin, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";
import { CountdownTimer } from "./CountdownTimer";

interface HeroSectionProps {
  onOpenRsvp: () => void;
}

export function HeroSection({ onOpenRsvp }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-4 bg-[#FDFBF7] overflow-hidden">
      {/* Background Subtle Warm Radial Tint */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F9EBE8]/60 via-[#FDFBF7] to-[#FDFBF7] pointer-events-none" />

      {/* Decorative Top Border Flourish */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        
        {/* Script Tagline */}
        <div className="space-y-1">
          <span className="font-script text-3xl sm:text-4xl text-[#C87A68] block">
            We are getting married!
          </span>
          <div className="flex items-center justify-center space-x-3 text-[#E2D9CE]">
            <span className="h-[1px] w-12 bg-[#E2D9CE]" />
            <Heart className="w-4 h-4 text-[#C87A68] fill-[#C87A68]" />
            <span className="h-[1px] w-12 bg-[#E2D9CE]" />
          </div>
        </div>

        {/* Couple Names */}
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-serif font-bold text-[#1B3B2B] tracking-tight leading-none">
            {WEDDING_CONFIG.couple.groom}{" "}
            <span className="font-script font-normal text-[#C87A68] text-5xl sm:text-7xl lg:text-8xl px-2">
              &amp;
            </span>{" "}
            {WEDDING_CONFIG.couple.bride}
          </h1>
          <p className="text-lg sm:text-2xl text-[#2E3834] font-serif italic max-w-2xl mx-auto">
            Together with their families, invite you to celebrate their wedding day.
          </p>
        </div>

        {/* Date & Location Pill */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[#1B3B2B] text-sm sm:text-base font-medium">
          <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E2D9CE] shadow-sm">
            <Calendar className="w-4 h-4 text-[#C87A68]" />
            <span className="font-serif tracking-wide">{WEDDING_CONFIG.date.fullDate}</span>
          </div>
          <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E2D9CE] shadow-sm">
            <MapPin className="w-4 h-4 text-[#1B3B2B]" />
            <span className="font-serif tracking-wide">{WEDDING_CONFIG.venue.ceremony.cityState}</span>
          </div>
        </div>

        {/* Countdown */}
        <CountdownTimer targetDateIso={WEDDING_CONFIG.date.isoDate} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#C87A68] fill-[#C87A68]" />
            <span>RSVP For The Wedding</span>
          </button>
          <a
            href="#schedule"
            className="w-full sm:w-auto px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-widest text-[#1B3B2B] bg-[#FFFFFF] hover:bg-[#F4EFEA] border border-[#E2D9CE] transition-all text-center shadow-sm"
          >
            Weekend Details
          </a>
        </div>
      </div>
    </section>
  );
}
