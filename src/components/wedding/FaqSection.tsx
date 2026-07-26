"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { WEDDING_CONFIG, FaqItem } from "@/data/weddingConfig";

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
    <section id="faq" className="py-24 px-4 bg-stone-950 border-t border-stone-800">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Got Questions?
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            Frequently Asked Questions
          </h3>
          <p className="text-stone-400 font-serif italic text-lg">
            Have questions about our big day? We have answers for you below.
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
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-amber-600 text-stone-950 font-bold shadow-md"
                  : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
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
                className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="font-serif font-bold text-lg text-stone-100">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-stone-300 text-sm sm:text-base border-t border-stone-800/60 leading-relaxed">
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
