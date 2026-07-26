"use client";

import React from "react";
import { Coffee, Heart, Sparkles, Compass } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

const ICON_MAP: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-6 h-6 text-amber-400" />,
  Heart: <Heart className="w-6 h-6 text-rose-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-amber-300" />,
  Compass: <Compass className="w-6 h-6 text-emerald-400" />,
};

export function StorySection() {
  return (
    <section id="story" className="py-24 px-4 bg-stone-900/60 border-t border-stone-800/60">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Our Journey Together
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            Our Story & Fun Facts
          </h3>
          <p className="text-stone-400 max-w-2xl mx-auto font-serif italic text-lg">
            From late-night coding sessions and coffee dates to mountain hikes and wedding bells.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WEDDING_CONFIG.funFacts.map((fact, index) => (
            <div
              key={fact.title}
              className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-all duration-300 shadow-lg relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                {ICON_MAP[fact.iconName] || <Heart className="w-16 h-16 text-amber-400" />}
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl shrink-0">
                  {ICON_MAP[fact.iconName] || <Sparkles className="w-6 h-6 text-amber-400" />}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Chapter 0{index + 1}
                    </span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-stone-100">
                    {fact.title}
                  </h4>
                  <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
                    {fact.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Banner */}
        <div className="bg-gradient-to-r from-amber-950/30 via-stone-950 to-emerald-950/30 border border-amber-900/30 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <p className="text-2xl sm:text-3xl font-serif italic text-amber-200">
            &ldquo;In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.&rdquo;
          </p>
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 block">
            — Maya Angelou
          </span>
        </div>
      </div>
    </section>
  );
}
