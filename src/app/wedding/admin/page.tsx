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
  Lock,
  LogOut,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { Guest } from "@/data/guestList";
import { WEDDING_CONFIG } from "@/data/weddingConfig";
import { getGuests, resetGuestListToDefault } from "@/lib/rsvpService";

const AUTH_KEY = "nolen_syrel_admin_auth_v1";

function AdminDashboardContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<"all" | "attending" | "declined" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if session previously authenticated
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_KEY);
      if (stored === "true") {
        setIsAuthenticated(true);
        setGuests(getGuests());
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const expectedPasscode = WEDDING_CONFIG.couple.adminPasscode;

    if (passcode.trim() === expectedPasscode) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_KEY, "true");
      }
      setGuests(getGuests());
    } else {
      setAuthError("Incorrect admin passcode. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_KEY);
    }
  };

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

  // PASSCODE LOCK SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#2E3834] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF2ED] border border-[#38664F]/30 flex items-center justify-center text-[#1B3B2B] shadow-sm">
            <Lock className="w-7 h-7 text-[#1B3B2B]" />
          </div>

          <div className="space-y-1">
            <span className="font-script text-3xl text-[#C87A68] block">
              Couple Access Only
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#1B3B2B]">
              Admin Security Passcode
            </h1>
            <p className="text-xs text-[#6B7C75] font-serif">
              Please enter the passcode to access guest RSVPs, meal orders, and data downloads.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B3B2B] flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#C87A68]" />
                <span>Enter Admin PIN / Passcode</span>
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. 2027"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] text-center font-mono placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] text-base"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-[#F9EBE8] border border-[#E8B4A8] text-[#A65747] text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C87A68]" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer shadow"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-[#E2D9CE]">
            <Link
              href="/wedding"
              className="inline-flex items-center space-x-1 text-xs text-[#6B7C75] hover:text-[#C87A68] font-serif"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Wedding Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stats Calculations
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
      g.code.toLowerCase().includes(query) ||
      (g.email && g.email.toLowerCase().includes(query));

    return matchesFilter && nameMatch;
  });

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      "Code",
      "First Name",
      "Last Name",
      "Email",
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
      "Message",
      "Updated At",
    ];

    const rows = guests.map((g) => [
      g.code,
      g.firstName,
      g.lastName,
      g.email || "",
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#2E3834] py-10 px-4 sm:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9CE] pb-6">
          <div className="space-y-1">
            <Link
              href="/wedding"
              className="inline-flex items-center space-x-1 text-xs text-[#C87A68] hover:text-[#1B3B2B] font-semibold uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Wedding Site</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-[#1B3B2B] flex items-center space-x-3">
              <span>RSVP Management Dashboard</span>
              <span className="text-xs font-mono font-normal px-3 py-1 rounded-full bg-[#EBF2ED] text-[#1B3B2B] border border-[#38664F]/30">
                Secured
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCsv}
              className="px-5 py-2.5 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center space-x-2 shadow cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C87A68]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleResetData}
              className="px-4 py-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#F4EFEA] border border-[#E2D9CE] text-[#6B7C75] hover:text-[#1B3B2B] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full bg-[#F9EBE8] hover:bg-[#E8B4A8] border border-[#E8B4A8] text-[#A65747] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7C75]">
                Attending Headcount
              </span>
              <CheckCircle2 className="w-5 h-5 text-[#1B3B2B]" />
            </div>
            <p className="text-4xl font-bold font-serif text-[#1B3B2B]">
              {totalAttendingHeadcount}
            </p>
            <p className="text-xs text-[#6B7C75]">
              {attendingPrimaryCount} Primary + {attendingPlusOneCount} Plus-Ones
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7C75]">
                Response Rate
              </span>
              <Users className="w-5 h-5 text-[#C87A68]" />
            </div>
            <p className="text-4xl font-bold font-serif text-[#C87A68]">
              {totalSubmitted} / {guests.length}
            </p>
            <p className="text-xs text-[#6B7C75]">
              {Math.round((totalSubmitted / (guests.length || 1)) * 100)}% Invitations Responded
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7C75]">
                Declined Count
              </span>
              <XCircle className="w-5 h-5 text-[#A65747]" />
            </div>
            <p className="text-4xl font-bold font-serif text-[#A65747]">
              {totalDeclinedCount}
            </p>
            <p className="text-xs text-[#6B7C75]">Unable to attend</p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7C75]">
                Pending Responses
              </span>
              <Clock className="w-5 h-5 text-[#C87A68]" />
            </div>
            <p className="text-4xl font-bold font-serif text-[#1B3B2B]">
              {totalPendingCount}
            </p>
            <p className="text-xs text-[#6B7C75]">Awaiting guest response</p>
          </div>
        </div>

        {/* Meal Breakdown Summary */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-[#C87A68]" />
            <h3 className="font-serif font-bold text-xl text-[#1B3B2B]">
              Catering Entrée Orders
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WEDDING_CONFIG.meals.map((m) => (
              <div key={m.id} className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E2D9CE] space-y-1">
                <p className="text-xs font-serif font-bold text-[#1B3B2B]">{m.name}</p>
                <p className="text-2xl font-serif font-bold text-[#C87A68]">
                  {mealCounts[m.id] || 0} <span className="text-xs font-sans text-[#6B7C75]">plates</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guest List Table */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {(["all", "attending", "declined", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    filter === f
                      ? "bg-[#1B3B2B] text-[#FDFBF7]"
                      : "bg-[#FDFBF7] text-[#2E3834] hover:text-[#C87A68] border border-[#E2D9CE]"
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

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or code..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] text-xs placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68]"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#6B7C75]" />
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E2D9CE] rounded-2xl">
            <table className="w-full text-left text-xs text-[#2E3834]">
              <thead className="bg-[#F4EFEA] text-[#1B3B2B] font-serif uppercase tracking-wider border-b border-[#E2D9CE]">
                <tr>
                  <th className="p-3.5 font-bold">Guest Name</th>
                  <th className="p-3.5 font-bold">Invite Code</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold">Entrée</th>
                  <th className="p-3.5 font-bold">Plus-One (+1)</th>
                  <th className="p-3.5 font-bold">Dietary / Notes</th>
                  <th className="p-3.5 text-right font-bold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9CE]/60 bg-[#FFFFFF]">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="p-3.5 font-serif font-bold text-[#1B3B2B]">
                      {g.firstName} {g.lastName}
                    </td>
                    <td className="p-3.5 font-mono text-[#C87A68] font-bold">{g.code}</td>
                    <td className="p-3.5">
                      {!g.rsvpSubmitted ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#F4EFEA] text-[#6B7C75] text-[10px] font-semibold">
                          Pending
                        </span>
                      ) : g.attending ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#EBF2ED] text-[#1B3B2B] border border-[#38664F]/30 text-[10px] font-bold">
                          Attending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#F9EBE8] text-[#A65747] border border-[#E8B4A8] text-[10px] font-bold">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-serif text-[#1B3B2B]">
                      {g.attending && g.mealPreference
                        ? WEDDING_CONFIG.meals.find((m) => m.id === g.mealPreference)?.name
                        : "—"}
                    </td>
                    <td className="p-3.5">
                      {g.allowedPlusOne ? (
                        g.plusOne?.attending ? (
                          <div className="space-y-0.5">
                            <span className="font-serif font-bold text-[#1B3B2B] block">
                              {g.plusOne.firstName} {g.plusOne.lastName}
                            </span>
                            <span className="text-[10px] text-[#6B7C75] block">
                              Meal: {g.plusOne.mealPreference}
                            </span>
                          </div>
                        ) : g.rsvpSubmitted ? (
                          <span className="text-[#6B7C75]">Not bringing +1</span>
                        ) : (
                          <span className="text-[#C87A68] font-semibold">+1 Eligible</span>
                        )
                      ) : (
                        <span className="text-[#6B7C75]">None</span>
                      )}
                    </td>
                    <td className="p-3.5 text-[#2E3834] max-w-xs truncate">
                      {g.dietaryRestrictions || g.message || "—"}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleCopyLink(g.code)}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#F4EFEA] hover:bg-[#E2D9CE] text-[#1B3B2B] border border-[#E2D9CE] text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {copiedCode === g.code ? (
                          <>
                            <Check className="w-3 h-3 text-[#1B3B2B]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#C87A68]" />
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
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] text-[#1B3B2B] p-8 text-center font-serif">Loading Admin...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
