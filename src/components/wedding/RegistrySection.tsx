"use client";

import React from "react";
import { Gift, Plane, Home, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function RegistrySection() {
  return (
    <section id="registry" className="py-24 px-4 bg-[#F4EFEA] border-t border-[#E2D9CE]">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#C87A68] block">
            Gifts &amp; Honeymoon Fund
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            Registry
          </h2>
          <p className="text-[#2E3834] max-w-xl mx-auto font-serif italic text-base sm:text-lg">
            {WEDDING_CONFIG.registry.description}
          </p>
        </div>

        {/* Funds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WEDDING_CONFIG.registry.funds.map((fund, i) => (
            <div
              key={fund.name}
              className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 space-y-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 bg-[#F9EBE8] border border-[#E8B4A8] rounded-2xl text-[#C87A68]">
                    {i === 0 ? <Plane className="w-6 h-6" /> : <Home className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EBF2ED] text-[#1B3B2B] uppercase tracking-wider">
                    {fund.category}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#1B3B2B]">
                  {fund.name}
                </h3>
                <p className="text-[#2E3834] text-sm sm:text-base leading-relaxed">
                  {fund.description}
                </p>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-[#6B7C75] font-serif">
                    <span>Gift Contribution</span>
                    <span className="text-[#C87A68] font-bold">{i === 0 ? "72% Funded" : "45% Funded"}</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4EFEA] rounded-full overflow-hidden border border-[#E2D9CE]">
                    <div
                      className="h-full bg-gradient-to-r from-[#C87A68] to-[#1B3B2B] rounded-full"
                      style={{ width: i === 0 ? "72%" : "45%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E2D9CE]">
                <a
                  href={fund.url}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors shadow cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#C87A68]" />
                  <span>Contribute to Fund</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Store Registries */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 space-y-6 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-[#1B3B2B] text-center">
            Store Registries
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WEDDING_CONFIG.registry.stores.map((store) => (
              <a
                key={store.name}
                href={store.url}
                className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] hover:border-[#C87A68] hover:bg-[#F9EBE8]/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{store.logo}</span>
                  <span className="font-serif font-bold text-[#1B3B2B] text-base group-hover:text-[#C87A68] transition-colors">
                    {store.name}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#6B7C75] group-hover:text-[#C87A68] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
