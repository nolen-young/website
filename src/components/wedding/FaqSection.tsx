"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "rsvp", label: "RSVP & Invites" },
    { id: "general", label: "General & Venue" },
    { id: "attire", label: "Dress Code" },
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? WEDDING_CONFIG.faqs
      : WEDDING_CONFIG.faqs.filter((faq) => faq.category === selectedCategory);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 bg-[#FDFBF7] border-t border-[#E2D9CE]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#C87A68] block">
            Got Questions?
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            Frequently Asked Questions
          </h2>
          <p className="text-[#2E3834] font-serif italic text-lg">
            Answers to common questions about our celebration.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpenIndex(0);
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1B3B2B] text-[#FDFBF7] shadow"
                  : "bg-[#FFFFFF] text-[#2E3834] hover:text-[#C87A68] border border-[#E2D9CE]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-[#C87A68] shrink-0" />
                    <span className="font-serif font-bold text-lg text-[#1B3B2B]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6B7C75] transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-[#C87A68]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-[#2E3834] text-sm sm:text-base border-t border-[#E2D9CE]/60 leading-relaxed font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
