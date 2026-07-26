"use client";

import React from "react";
import { Coffee, Heart, Sparkles, Compass } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

const ICON_MAP: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-5 h-5 text-[#C87A68]" />,
  Heart: <Heart className="w-5 h-5 text-[#C87A68]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#C87A68]" />,
  Compass: <Compass className="w-5 h-5 text-[#1B3B2B]" />,
};

export function StorySection() {
  return (
    <section id="story" className="py-24 px-4 bg-[#F4EFEA] border-t border-[#E2D9CE]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#C87A68] block">
            Our Journey Together
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            Our Story &amp; Fun Facts
          </h2>
          <div className="flex items-center justify-center space-x-3 text-[#E2D9CE] pt-1">
            <span className="h-[1px] w-12 bg-[#E2D9CE]" />
            <Heart className="w-3.5 h-3.5 text-[#C87A68] fill-[#C87A68]" />
            <span className="h-[1px] w-12 bg-[#E2D9CE]" />
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WEDDING_CONFIG.funFacts.map((fact, index) => (
            <div
              key={fact.title}
              className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 hover:shadow-md transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex items-start space-x-5">
                <div className="p-3.5 bg-[#F9EBE8] border border-[#E8B4A8] rounded-2xl shrink-0">
                  {ICON_MAP[fact.iconName] || <Heart className="w-5 h-5 text-[#C87A68]" />}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C87A68]">
                    Chapter 0{index + 1}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1B3B2B]">
                    {fact.title}
                  </h3>
                  <p className="text-[#2E3834] leading-relaxed text-sm sm:text-base">
                    {fact.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Banner */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm max-w-4xl mx-auto">
          <p className="text-2xl sm:text-3xl font-serif italic text-[#1B3B2B]">
            &ldquo;In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.&rdquo;
          </p>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C87A68] block">
            — Maya Angelou
          </span>
        </div>
      </div>
    </section>
  );
}
