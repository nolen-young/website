"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Download,
  Copy,
  Check,
  RotateCcw,
  Search,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Guest } from "@/data/guestList";
import { WEDDING_CONFIG } from "@/data/weddingConfig";
import { getGuests, resetGuestListToDefault, saveGuests } from "@/lib/rsvpService";

function AdminDashboardContent() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<"all" | "attending" | "declined" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setGuests(getGuests());
  }, []);

  const handleResetData = () => {
    if (window.confirm("Reset all guest RSVP state back to default sample dataset?")) {
      const reset = resetGuestListToDefault();
      setGuests(reset);
    }
  };

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/wedding/rsvp?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Stats Calculations
  const totalInvitedGuests = guests.reduce(
    (acc, g) => acc + 1 + (g.allowedPlusOne ? 1 : 0),
    0
  );

  const totalSubmitted = guests.filter((g) => g.rsvpSubmitted).length;
  
  const attendingPrimaryCount = guests.filter((g) => g.rsvpSubmitted && g.attending).length;
  const attendingPlusOneCount = guests.filter(
    (g) => g.rsvpSubmitted && g.attending && g.plusOne?.attending
  ).length;
  const totalAttendingHeadcount = attendingPrimaryCount + attendingPlusOneCount;

  const totalDeclinedCount = guests.filter((g) => g.rsvpSubmitted && !g.attending).length;
  const totalPendingCount = guests.filter((g) => !g.rsvpSubmitted).length;

  // Meal breakdown
  const mealCounts: Record<string, number> = {};
  WEDDING_CONFIG.meals.forEach((m) => (mealCounts[m.id] = 0));

  guests.forEach((g) => {
    if (g.rsvpSubmitted && g.attending) {
      if (g.mealPreference && mealCounts[g.mealPreference] !== undefined) {
        mealCounts[g.mealPreference]++;
      }
      if (g.plusOne?.attending && g.plusOne.mealPreference && mealCounts[g.plusOne.mealPreference] !== undefined) {
        mealCounts[g.plusOne.mealPreference]++;
      }
    }
  });

  // Filtered list
  const filteredGuests = guests.filter((g) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "attending"
        ? g.rsvpSubmitted && g.attending
        : filter === "declined"
        ? g.rsvpSubmitted && !g.attending
        : !g.rsvpSubmitted;

    const query = searchQuery.toLowerCase().trim();
    const nameMatch =
      !query ||
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(query) ||
      g.code.toLowerCase().includes(query);

    return matchesFilter && nameMatch;
  });

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      "Code",
      "First Name",
      "Last Name",
      "Status",
      "Attending",
      "Entree",
      "Dietary Notes",
      "Has +1",
      "+1 Attending",
      "+1 First Name",
      "+1 Last Name",
      "+1 Entree",
      "+1 Dietary Notes",
      "Song Request",
      "Message",
      "Updated At",
    ];

    const rows = guests.map((g) => [
      g.code,
      g.firstName,
      g.lastName,
      g.rsvpSubmitted ? "Responded" : "Pending",
      g.attending ? "Yes" : g.rsvpSubmitted ? "No" : "",
      g.mealPreference || "",
      `"${(g.dietaryRestrictions || "").replace(/"/g, '""')}"`,
      g.allowedPlusOne ? "Yes" : "No",
      g.plusOne?.attending ? "Yes" : "No",
      g.plusOne?.firstName || "",
      g.plusOne?.lastName || "",
      g.plusOne?.mealPreference || "",
      `"${(g.plusOne?.dietaryRestrictions || "").replace(/"/g, '""')}"`,
      `"${(g.songRequest || "").replace(/"/g, '""')}"`,
      `"${(g.message || "").replace(/"/g, '""')}"`,
      g.updatedAt || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nolen-syrel-wedding-rsvps-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <Link
              href="/wedding"
              className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Wedding Site</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-stone-100 flex items-center space-x-3">
              <span>RSVP Admin Dashboard</span>
              <span className="text-xs font-mono font-normal px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Nolen & Syrel
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors flex items-center space-x-2 shadow cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleResetData}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Test Data</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                Total Attending Headcount
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400">
              {totalAttendingHeadcount}
            </p>
            <p className="text-xs text-stone-400">
              {attendingPrimaryCount} Primary Guests + {attendingPlusOneCount} Plus-Ones
            </p>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                RSVP Response Rate
              </span>
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-amber-300">
              {totalSubmitted} / {guests.length}
            </p>
            <p className="text-xs text-stone-400">
              {Math.round((totalSubmitted / (guests.length || 1)) * 100)}% Invitations Responded
            </p>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                Declined Invitations
              </span>
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-rose-400">
              {totalDeclinedCount}
            </p>
            <p className="text-xs text-stone-400">Unable to attend</p>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                Pending Responses
              </span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold font-mono text-amber-400">
              {totalPendingCount}
            </p>
            <p className="text-xs text-stone-400">Awaiting guest response</p>
          </div>
        </div>

        {/* Meal Breakdown Summary */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-stone-100">
              Catering Entrée Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WEDDING_CONFIG.meals.map((m) => (
              <div key={m.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                <p className="text-xs text-stone-400">{m.name}</p>
                <p className="text-2xl font-mono font-bold text-amber-300">
                  {mealCounts[m.id] || 0} <span className="text-xs text-stone-500">plates</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guest List Table & Controls */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {(["all", "attending", "declined", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    filter === f
                      ? "bg-amber-600 text-stone-950"
                      : "bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800"
                  }`}
                >
                  {f} ({
                    f === "all"
                      ? guests.length
                      : f === "attending"
                      ? guests.filter((g) => g.rsvpSubmitted && g.attending).length
                      : f === "declined"
                      ? guests.filter((g) => g.rsvpSubmitted && !g.attending).length
                      : guests.filter((g) => !g.rsvpSubmitted).length
                  })
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or code..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-500" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-stone-800 rounded-xl">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 font-mono uppercase tracking-widest border-b border-stone-800">
                <tr>
                  <th className="p-3.5">Guest Name</th>
                  <th className="p-3.5">Invite Code</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Entrée</th>
                  <th className="p-3.5">Plus-One (+1)</th>
                  <th className="p-3.5">Dietary / Notes</th>
                  <th className="p-3.5 text-right">Personal Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 bg-stone-900/40">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-stone-950/60 transition-colors">
                    <td className="p-3.5 font-serif font-bold text-stone-100">
                      {g.firstName} {g.lastName}
                    </td>
                    <td className="p-3.5 font-mono text-amber-400 font-semibold">{g.code}</td>
                    <td className="p-3.5">
                      {!g.rsvpSubmitted ? (
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                          Pending
                        </span>
                      ) : g.attending ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          Attending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-stone-300">
                      {g.attending && g.mealPreference
                        ? WEDDING_CONFIG.meals.find((m) => m.id === g.mealPreference)?.name
                        : "—"}
                    </td>
                    <td className="p-3.5">
                      {g.allowedPlusOne ? (
                        g.plusOne?.attending ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-amber-200 block">
                              {g.plusOne.firstName} {g.plusOne.lastName}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400 block">
                              Meal: {g.plusOne.mealPreference}
                            </span>
                          </div>
                        ) : g.rsvpSubmitted ? (
                          <span className="text-stone-500">Not bringing +1</span>
                        ) : (
                          <span className="text-amber-400/70">+1 Eligible</span>
                        )
                      ) : (
                        <span className="text-stone-600">None</span>
                      )}
                    </td>
                    <td className="p-3.5 text-stone-400 max-w-xs truncate">
                      {g.dietaryRestrictions || g.message || "—"}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleCopyLink(g.code)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-950 hover:bg-stone-800 text-amber-300 border border-stone-800 text-[11px] transition-colors cursor-pointer"
                      >
                        {copiedCode === g.code ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 text-amber-200 p-8 text-center">Loading Admin...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
