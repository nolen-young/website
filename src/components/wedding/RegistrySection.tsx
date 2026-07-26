"use client";

import React from "react";
import { Gift, Plane, Home, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function RegistrySection() {
  return (
    <section id="registry" className="py-24 px-4 bg-stone-900/60 border-t border-stone-800">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Gifts & Honeymoon Fund
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            Registry
          </h3>
          <p className="text-stone-300 max-w-xl mx-auto font-serif italic text-base sm:text-lg">
            {WEDDING_CONFIG.registry.description}
          </p>
        </div>

        {/* Funds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WEDDING_CONFIG.registry.funds.map((fund, i) => (
            <div
              key={fund.name}
              className="bg-stone-950 border border-stone-800 rounded-3xl p-8 space-y-6 hover:border-amber-500/30 transition-all shadow-xl relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-400">
                    {i === 0 ? <Plane className="w-6 h-6" /> : <Home className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {fund.category}
                  </span>
                </div>

                <h4 className="text-2xl font-serif font-bold text-stone-100">
                  {fund.name}
                </h4>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {fund.description}
                </p>

                {/* Visual Progress Bar Mockup */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-stone-400 font-mono">
                    <span>Gift Contribution</span>
                    <span className="text-amber-400 font-semibold">{i === 0 ? "72% Funded" : "45% Funded"}</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: i === 0 ? "72%" : "45%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-800/80">
                <a
                  href={fund.url}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-sm border border-stone-800 transition-colors cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Contribute to Fund</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Store Registries */}
        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-8 space-y-6">
          <h4 className="text-xl font-serif font-bold text-stone-100 text-center">
            Store Registries
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WEDDING_CONFIG.registry.stores.map((store) => (
              <a
                key={store.name}
                href={store.url}
                className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{store.logo}</span>
                  <span className="font-semibold text-stone-200 text-sm group-hover:text-amber-200 transition-colors">
                    {store.name}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
