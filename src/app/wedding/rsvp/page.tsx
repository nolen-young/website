"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { Heart, ArrowLeft } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

function RsvpPageContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const name = searchParams.get("name");

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2E3834] py-12 px-4 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2D9CE] pb-4">
          <Link
            href="/wedding"
            className="inline-flex items-center space-x-2 text-[#1B3B2B] hover:text-[#C87A68] transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wedding Site</span>
          </Link>

          <div className="flex items-center space-x-2 font-serif text-xl font-bold text-[#1B3B2B]">
            <span>{WEDDING_CONFIG.couple.groom} &amp; {WEDDING_CONFIG.couple.bride}</span>
            <Heart className="w-4 h-4 text-[#C87A68] fill-[#C87A68]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <span className="font-script text-3xl text-[#C87A68] block">
            Online Attendance
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            RSVP Portal
          </h1>
          <p className="text-[#2E3834] font-serif italic text-sm sm:text-base">
            Please submit your response by September 1, 2026.
          </p>
        </div>

        {/* Embedded Form */}
        <RsvpForm initialCode={code} initialName={name} />
      </div>

      <footer className="text-center text-xs text-[#6B7C75] pt-12 font-serif">
        <p>{WEDDING_CONFIG.couple.groom} &amp; {WEDDING_CONFIG.couple.bride}&apos;s Wedding • {WEDDING_CONFIG.date.fullDate}</p>
      </footer>
    </div>
  );
}

export default function DedicatedRsvpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] text-[#1B3B2B] p-8 text-center font-serif">Loading RSVP Portal...</div>}>
      <RsvpPageContent />
    </Suspense>
  );
}
