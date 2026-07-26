"use client";

import React from "react";
import { Sparkles, Calendar, MapPin, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";
import { CountdownTimer } from "./CountdownTimer";

interface HeroSectionProps {
  onOpenRsvp: () => void;
}

export function HeroSection({ onOpenRsvp }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden bg-stone-950">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-stone-950 to-stone-950" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-700/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium tracking-widest uppercase">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/50" />
          <span>We Are Getting Married!</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/50" />
        </div>

        {/* Couple Names */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-extrabold text-stone-100 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              {WEDDING_CONFIG.couple.groom}
            </span>{" "}
            <span className="text-amber-500 font-serif italic text-4xl sm:text-6xl font-normal">
              &
            </span>{" "}
            <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 bg-clip-text text-transparent">
              {WEDDING_CONFIG.couple.bride}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-400 font-serif italic max-w-2xl mx-auto">
            Together with our families, we invite you to celebrate our wedding day.
          </p>
        </div>

        {/* Date & Location Pill */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-stone-300 text-sm sm:text-base font-medium">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-stone-900/80 border border-stone-800">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{WEDDING_CONFIG.date.fullDate}</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-stone-900/80 border border-stone-800">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{WEDDING_CONFIG.venue.ceremony.cityState}</span>
          </div>
        </div>

        {/* Countdown */}
        <CountdownTimer targetDateIso={WEDDING_CONFIG.date.isoDate} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-xl shadow-amber-950/40 hover:shadow-amber-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>RSVP For The Wedding</span>
          </button>
          <a
            href="#schedule"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-medium text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-800 transition-all text-center"
          >
            View Weekend Details
          </a>
        </div>
      </div>
    </section>
  );
}
