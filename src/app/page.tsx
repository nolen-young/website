import Link from "next/link";
import { Heart, Sparkles, Calendar, MapPin, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/data/weddingConfig";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-12 z-10">
        {/* Personal Header */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Nolen Young
          </h1>
          <p className="text-zinc-400 font-mono text-sm sm:text-base">
            Software Development Engineer | Seattle, WA
          </p>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <span>Site Status:</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Publicly Accessible</span>
          </div>
        </div>

        {/* Featured Wedding Subsite Card */}
        <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border border-amber-500/40 rounded-3xl p-6 sm:p-10 text-left space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart className="w-32 h-32 text-rose-500" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Announcement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
              We&apos;re Getting Married! 💍
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Nolen & Syrel are excited to celebrate our wedding with family and friends on{" "}
              <strong className="text-amber-200">{WEDDING_CONFIG.date.fullDate}</strong> in{" "}
              <strong className="text-amber-200">{WEDDING_CONFIG.venue.ceremony.cityState}</strong>.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-400">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>October 17, 2026</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Friday Harbor, WA</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href="/wedding"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Visit Wedding Subsite</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <Link
              href="/wedding/rsvp"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-200 font-semibold text-sm transition-all text-center cursor-pointer"
            >
              Direct Guest RSVP Portal
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-zinc-600 font-mono">
          Personal website & wedding portal powered by Next.js & NixOS.
        </p>
      </div>
    </main>
  );
}
