import Link from "next/link";
import { Heart, Calendar, MapPin, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2E3834] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F9EBE8] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-12 z-10">
        {/* Personal Header */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1B3B2B] tracking-tight">
            Nolen Young
          </h1>
          <p className="text-[#6B7C75] text-sm sm:text-base font-serif italic">
            Software Engineer | Seattle, WA
          </p>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E2D9CE] text-[#6B7C75] text-xs">
            <span>Site Status:</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[#1B3B2B] font-semibold">Publicly Accessible</span>
          </div>
        </div>

        {/* Featured Wedding Subsite Card */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 sm:p-12 text-left space-y-6 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Heart className="w-36 h-36 text-[#C87A68]" />
          </div>

          <div className="space-y-4">
            <span className="font-script text-3xl text-[#C87A68] block">
              Special Announcement
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
              We&apos;re Getting Married! 💍
            </h2>

            <p className="text-[#2E3834] text-base leading-relaxed max-w-xl font-sans">
              Nolen &amp; Syrel are overjoyed to celebrate our wedding with family and friends on{" "}
              <strong className="font-serif text-[#1B3B2B] font-bold">{WEDDING_CONFIG.date.fullDate}</strong> in{" "}
              <strong className="font-serif text-[#1B3B2B] font-bold">{WEDDING_CONFIG.venue.ceremony.cityState}</strong>.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#1B3B2B] pt-2">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#E2D9CE]">
                <Calendar className="w-4 h-4 text-[#C87A68]" />
                <span>October 17, 2026</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#EBF2ED] border border-[#38664F]/30">
                <MapPin className="w-4 h-4 text-[#1B3B2B]" />
                <span>Friday Harbor, WA</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E2D9CE]">
            <Link
              href="/wedding"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Visit Wedding Subsite</span>
              <ExternalLink className="w-4 h-4 text-[#C87A68]" />
            </Link>

            <Link
              href="/wedding/rsvp"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FDFBF7] hover:bg-[#F4EFEA] border border-[#E2D9CE] text-[#1B3B2B] font-semibold text-xs uppercase tracking-widest transition-all text-center cursor-pointer"
            >
              Direct Guest RSVP Portal
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-[#6B7C75] font-serif italic">
          Nolen Young &amp; Syrel &bull; Personal Website &amp; Wedding Subsite
        </p>
      </div>
    </main>
  );
}
