"use client";

import React, { useState } from "react";
import { MapPin, Hotel, Plane, Ship, Copy, Check, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function VenueSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="venue" className="py-24 px-4 bg-[#F4EFEA] border-t border-[#E2D9CE]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#C87A68] block">
            Location &amp; Accommodations
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            Venue &amp; Travel Guide
          </h2>
          <p className="text-[#2E3834] max-w-xl mx-auto font-serif italic text-lg">
            Planning your trip to Friday Harbor on San Juan Island, WA.
          </p>
        </div>

        {/* Main Venue Card */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EBF2ED] border border-[#38664F]/30 text-[#1B3B2B] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#C87A68]" />
                <span>Ceremony &amp; Reception</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
                {WEDDING_CONFIG.venue.ceremony.name}
              </h3>
              <p className="text-[#2E3834] text-base leading-relaxed">
                {WEDDING_CONFIG.venue.ceremony.description}
              </p>

              <div className="space-y-1 text-sm text-[#2E3834] border-l-2 border-[#C87A68] pl-4 py-1 font-serif">
                <p className="font-bold text-[#1B3B2B]">{WEDDING_CONFIG.venue.ceremony.address}</p>
                <p>{WEDDING_CONFIG.venue.ceremony.cityState}</p>
              </div>

              <div className="pt-2">
                <a
                  href={WEDDING_CONFIG.venue.ceremony.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] text-xs font-semibold uppercase tracking-widest transition-all shadow cursor-pointer"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-[#C87A68]" />
                </a>
              </div>
            </div>

            {/* Map Card Graphic */}
            <div className="h-64 sm:h-80 bg-[#FDFBF7] rounded-2xl border border-[#E2D9CE] relative flex items-center justify-center p-6 text-center overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F9EBE8] border border-[#E8B4A8] flex items-center justify-center text-[#C87A68]">
                  <MapPin className="w-7 h-7" />
                </div>
                <h4 className="font-serif font-bold text-[#1B3B2B] text-xl">
                  Friday Harbor, San Juan Island
                </h4>
                <p className="text-[#6B7C75] text-xs max-w-xs font-sans">
                  Accessible via scenic ferry from Anacortes, WA or direct floatplane from Seattle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ferry Warning Callout */}
        <div className="bg-[#F9EBE8] border border-[#E8B4A8] rounded-2xl p-6 sm:p-8 flex items-start space-x-4">
          <div className="p-3 bg-[#FFFFFF] border border-[#E8B4A8] rounded-xl text-[#C87A68] shrink-0">
            <Ship className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-serif font-bold text-[#1B3B2B]">
              Ferry Travel Notice
            </h4>
            <p className="text-[#2E3834] text-sm leading-relaxed">
              {WEDDING_CONFIG.travel.ferryNotice}
            </p>
          </div>
        </div>

        {/* Hotel Blocks Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Hotel className="w-6 h-6 text-[#C87A68]" />
            <h3 className="text-2xl font-serif font-bold text-[#1B3B2B]">
              Accommodations &amp; Room Blocks
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WEDDING_CONFIG.travel.hotels.map((hotel) => (
              <div
                key={hotel.name}
                className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EBF2ED] text-[#1B3B2B] uppercase tracking-wider">
                      {hotel.rate}
                    </span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#1B3B2B]">
                    {hotel.name}
                  </h4>
                  <p className="text-[#6B7C75] text-xs">{hotel.address}</p>
                  <p className="text-[#2E3834] text-sm leading-relaxed">{hotel.notes}</p>
                </div>

                <div className="pt-4 border-t border-[#E2D9CE] flex items-center justify-between">
                  <div className="text-xs space-y-0.5">
                    <span className="text-[#6B7C75] uppercase tracking-widest block text-[10px]">
                      Group Code
                    </span>
                    <span className="font-mono font-bold text-[#1B3B2B] text-sm">
                      {hotel.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(hotel.code)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F4EFEA] hover:bg-[#E2D9CE] text-[#1B3B2B] text-xs font-semibold border border-[#E2D9CE] transition-colors cursor-pointer"
                  >
                    {copiedCode === hotel.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                        <span className="text-[#1B3B2B]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C87A68]" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Airport Info */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Plane className="w-5 h-5 text-[#C87A68]" />
            <h4 className="text-lg font-serif font-bold text-[#1B3B2B]">
              Airport Travel Options
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEDDING_CONFIG.travel.airports.map((ap) => (
              <div key={ap.name} className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E2D9CE] space-y-1">
                <p className="font-bold text-[#1B3B2B] text-sm font-serif">{ap.name}</p>
                <p className="text-xs text-[#C87A68] font-semibold uppercase tracking-wider">{ap.distance}</p>
                <p className="text-xs text-[#2E3834] pt-1">{ap.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
