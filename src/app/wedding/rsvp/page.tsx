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
    <div className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/wedding"
            className="inline-flex items-center space-x-2 text-stone-400 hover:text-amber-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wedding Site</span>
          </Link>

          <div className="flex items-center space-x-2 font-serif text-lg font-bold text-amber-200">
            <span>{WEDDING_CONFIG.couple.groom} & {WEDDING_CONFIG.couple.bride}</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            RSVP Portal
          </h1>
          <p className="text-stone-400 font-serif italic text-sm sm:text-base">
            Please submit your RSVP details by September 1, 2026.
          </p>
        </div>

        {/* Embedded RSVP Form with searchParams */}
        <RsvpForm initialCode={code} initialName={name} />
      </div>

      <footer className="text-center text-xs text-stone-500 pt-12">
        <p>{WEDDING_CONFIG.couple.groom} & {WEDDING_CONFIG.couple.bride}&apos;s Wedding • {WEDDING_CONFIG.date.fullDate}</p>
      </footer>
    </div>
  );
}

export default function DedicatedRsvpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 text-amber-200 p-8 text-center">Loading RSVP Portal...</div>}>
      <RsvpPageContent />
    </Suspense>
  );
}
