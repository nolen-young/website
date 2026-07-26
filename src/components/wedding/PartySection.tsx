"use client";

import React from "react";
import { Users, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function PartySection() {
  return (
    <section id="party" className="py-24 px-4 bg-stone-950 border-t border-stone-800">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Standing By Our Side
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            The Wedding Party
          </h3>
          <p className="text-stone-400 max-w-xl mx-auto font-serif italic text-lg">
            Meet the wonderful friends and family who make our lives complete.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WEDDING_CONFIG.weddingParty.map((member) => (
            <div
              key={member.name}
              className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-stone-800 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    {member.role}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white">
                    {member.name}
                  </h4>
                </div>
              </div>

              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-xs text-amber-400/80 font-mono mb-2 flex items-center space-x-1">
                    <Heart className="w-3 h-3 fill-amber-400/40" />
                    <span>{member.relation}</span>
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
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
