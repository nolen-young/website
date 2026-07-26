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
    <section id="venue" className="py-24 px-4 bg-stone-900/60 border-t border-stone-800">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Location & Accommodations
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            Venue & Travel Guide
          </h3>
          <p className="text-stone-400 max-w-xl mx-auto font-serif italic text-lg">
            Everything you need to plan your island getaway to Friday Harbor, WA.
          </p>
        </div>

        {/* Main Venue Card */}
        <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Ceremony & Reception Venue</span>
              </div>

              <h4 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                {WEDDING_CONFIG.venue.ceremony.name}
              </h4>
              <p className="text-stone-300 text-base leading-relaxed">
                {WEDDING_CONFIG.venue.ceremony.description}
              </p>

              <div className="space-y-2 text-sm text-stone-400 border-l-2 border-amber-500/50 pl-4 py-1">
                <p className="font-semibold text-stone-200">{WEDDING_CONFIG.venue.ceremony.address}</p>
                <p>{WEDDING_CONFIG.venue.ceremony.cityState}</p>
              </div>

              <div className="pt-2">
                <a
                  href={WEDDING_CONFIG.venue.ceremony.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="h-64 sm:h-80 bg-stone-900 rounded-2xl border border-stone-800 relative flex items-center justify-center p-6 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-stone-900 to-stone-950" />
              <div className="relative z-10 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <MapPin className="w-8 h-8" />
                </div>
                <h5 className="font-serif font-bold text-stone-200 text-lg">
                  Friday Harbor, San Juan Island
                </h5>
                <p className="text-stone-400 text-xs max-w-xs">
                  Accessible via scenic ferry from Anacortes, WA or direct floatplane from Seattle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ferry Warning Callout */}
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6 sm:p-8 flex items-start space-x-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
            <Ship className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-serif font-bold text-amber-200">
              Ferry Travel Notice
            </h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              {WEDDING_CONFIG.travel.ferryNotice}
            </p>
          </div>
        </div>

        {/* Hotel Blocks Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Hotel className="w-6 h-6 text-amber-400" />
            <h4 className="text-2xl font-serif font-bold text-stone-100">
              Accommodations & Room Blocks
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WEDDING_CONFIG.travel.hotels.map((hotel) => (
              <div
                key={hotel.name}
                className="bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                      {hotel.rate}
                    </span>
                  </div>
                  <h5 className="text-xl font-serif font-bold text-stone-100">
                    {hotel.name}
                  </h5>
                  <p className="text-stone-400 text-sm">{hotel.address}</p>
                  <p className="text-stone-300 text-sm leading-relaxed">{hotel.notes}</p>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-xs space-y-1">
                    <span className="text-stone-500 uppercase tracking-widest block">
                      Group Code
                    </span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {hotel.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(hotel.code)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium border border-stone-800 transition-colors cursor-pointer"
                  >
                    {copiedCode === hotel.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
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
        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Plane className="w-5 h-5 text-amber-400" />
            <h5 className="text-lg font-serif font-bold text-stone-100">
              Airport Options
            </h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEDDING_CONFIG.travel.airports.map((ap) => (
              <div key={ap.name} className="p-4 bg-stone-900/60 rounded-xl border border-stone-800/80 space-y-1">
                <p className="font-semibold text-stone-200 text-sm">{ap.name}</p>
                <p className="text-xs text-amber-400 font-mono">{ap.distance}</p>
                <p className="text-xs text-stone-400 pt-1">{ap.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
