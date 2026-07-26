"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowUp, ShieldCheck } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#12281D] border-t border-[#1B3B2B] py-16 px-4 text-[#EBF2ED]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <span className="font-script text-3xl text-[#E8B4A8] block">
              Celebrating Love
            </span>
            <h4 className="font-serif text-3xl font-bold text-[#FDFBF7]">
              {WEDDING_CONFIG.couple.groom} &amp; {WEDDING_CONFIG.couple.bride}
            </h4>
            <p className="text-xs text-[#7A9A8B] font-serif uppercase tracking-wider">
              {WEDDING_CONFIG.date.fullDate} • {WEDDING_CONFIG.venue.ceremony.cityState}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs uppercase tracking-widest font-semibold">
            <a href="#story" className="text-[#FDFBF7] hover:text-[#E8B4A8] transition-colors">
              Story
            </a>
            <a href="#schedule" className="text-[#FDFBF7] hover:text-[#E8B4A8] transition-colors">
              Schedule
            </a>
            <a href="#venue" className="text-[#FDFBF7] hover:text-[#E8B4A8] transition-colors">
              Venue
            </a>
            <a href="#faq" className="text-[#FDFBF7] hover:text-[#E8B4A8] transition-colors">
              FAQs
            </a>
            <Link
              href="/wedding/admin"
              className="text-[#E8B4A8] hover:text-[#FDFBF7] transition-colors flex items-center space-x-1 font-mono text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1B3B2B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A9A8B]">
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#C87A68] fill-[#C87A68]" />
            <span>for Nolen &amp; Syrel&apos;s Wedding</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-[#FDFBF7] transition-colors underline">
              Return to Main Site
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#1B3B2B] hover:bg-[#2D5842] text-[#FDFBF7] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
