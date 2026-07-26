"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, Sparkles } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

interface NavbarProps {
  onOpenRsvp: () => void;
}

export function Navbar({ onOpenRsvp }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Our Story", href: "#story" },
    { name: "Schedule", href: "#schedule" },
    { name: "Venue & Travel", href: "#venue" },
    { name: "Wedding Party", href: "#party" },
    { name: "Registry", href: "#registry" },
    { name: "FAQs", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-stone-900/90 backdrop-blur-md border-b border-amber-900/20 shadow-lg py-3"
          : "bg-gradient-to-b from-stone-950/80 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Initials */}
          <Link
            href="/wedding"
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <span className="font-serif text-2xl font-bold tracking-wider text-amber-200 group-hover:text-amber-100 transition-colors">
              {WEDDING_CONFIG.couple.groom} & {WEDDING_CONFIG.couple.bride}
            </span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40 group-hover:scale-110 transition-transform" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-stone-300 hover:text-amber-200 transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenRsvp}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-lg shadow-amber-950/30 hover:shadow-amber-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>RSVP Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenRsvp}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-600 text-stone-950 shadow"
            >
              RSVP
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900/95 backdrop-blur-xl border-b border-stone-800 px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-200 hover:text-amber-300 py-2 border-b border-stone-800/50"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRsvp();
              }}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-center shadow-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>RSVP Online</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
