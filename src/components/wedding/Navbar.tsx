"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

interface NavbarProps {
  onOpenRsvp: () => void;
}

export function Navbar({ onOpenRsvp }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
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
          ? "bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E2D9CE] shadow-sm py-3"
          : "bg-gradient-to-b from-[#FDFBF7]/90 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Initials */}
          <Link
            href="/wedding"
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B3B2B] group-hover:text-[#C87A68] transition-colors">
              {WEDDING_CONFIG.couple.groom} <span className="font-script text-3xl font-normal text-[#C87A68]">&amp;</span> {WEDDING_CONFIG.couple.bride}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#2E3834] hover:text-[#C87A68] transition-colors py-1 relative group uppercase text-xs font-semibold tracking-widest"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C87A68] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenRsvp}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#C87A68] fill-[#C87A68]" />
              <span>RSVP</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenRsvp}
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1B3B2B] text-[#FDFBF7] shadow"
            >
              RSVP
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1B3B2B] hover:bg-[#F4EFEA] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-b border-[#E2D9CE] px-6 pt-4 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-serif text-[#1B3B2B] hover:text-[#C87A68] py-2 border-b border-[#E2D9CE]/60"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRsvp();
              }}
              className="w-full py-3 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest text-center shadow transition-colors flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4 text-[#C87A68] fill-[#C87A68]" />
              <span>RSVP Online</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
