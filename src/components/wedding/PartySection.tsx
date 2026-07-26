"use client";

import React from "react";
import { Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function PartySection() {
  return (
    <section id="party" className="py-24 px-4 bg-[#FDFBF7] border-t border-[#E2D9CE]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#C87A68] block">
            Standing By Our Side
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            The Wedding Party
          </h2>
          <p className="text-[#2E3834] max-w-xl mx-auto font-serif italic text-lg">
            Meet our dearest friends and family who make our lives so full of love.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WEDDING_CONFIG.weddingParty.map((member) => (
            <div
              key={member.name}
              className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-[#F4EFEA] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B3B2B]/80 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#C87A68] text-white text-[10px] font-semibold uppercase tracking-wider mb-1">
                    {member.role}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {member.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[#C87A68] font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <Heart className="w-3 h-3 fill-[#C87A68]" />
                    <span>{member.relation}</span>
                  </p>
                  <p className="text-[#2E3834] text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
