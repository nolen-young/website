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
    <footer className="bg-stone-950 border-t border-stone-800 py-16 px-4 text-stone-400">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <h4 className="font-serif text-3xl font-bold text-amber-200">
              {WEDDING_CONFIG.couple.groom} & {WEDDING_CONFIG.couple.bride}
            </h4>
            <p className="text-sm text-stone-400">
              {WEDDING_CONFIG.date.fullDate} • {WEDDING_CONFIG.venue.ceremony.cityState}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <a href="#story" className="hover:text-amber-200 transition-colors">
              Story
            </a>
            <a href="#schedule" className="hover:text-amber-200 transition-colors">
              Schedule
            </a>
            <a href="#venue" className="hover:text-amber-200 transition-colors">
              Venue
            </a>
            <a href="#faq" className="hover:text-amber-200 transition-colors">
              FAQs
            </a>
            <Link
              href="/wedding/admin"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1 font-mono text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Nolen & Syrel&apos;s Wedding</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-stone-200 transition-colors underline">
              Return to Nolen&apos;s Main Site
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors"
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
