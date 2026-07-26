"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  UserPlus,
  Utensils,
  Music,
  MessageSquare,
  QrCode,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Heart,
} from "lucide-react";
import { Guest } from "@/data/guestList";
import { WEDDING_CONFIG } from "@/data/weddingConfig";
import {
  searchGuestsByName,
  findGuestByCode,
  submitRsvp,
  RsvpPayload,
} from "@/lib/rsvpService";

interface RsvpFormProps {
  initialCode?: string | null;
  initialName?: string | null;
  onSubmitted?: (guest: Guest) => void;
}

export function RsvpForm({ initialCode, initialName, onSubmitted }: RsvpFormProps) {
  // Step State: 1 = Lookup, 2 = Attendance & Meal, 3 = +1 Details (if eligible), 4 = Music & Note, 5 = Confirmation
  const [step, setStep] = useState<number>(1);
  const [nameQuery, setNameQuery] = useState<string>(initialName || "");
  const [codeQuery, setCodeQuery] = useState<string>(initialCode || "");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Form Fields
  const [attending, setAttending] = useState<boolean>(true);
  const [mealPreference, setMealPreference] = useState<string>(WEDDING_CONFIG.meals[0].id);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");

  // +1 Fields
  const [bringingPlusOne, setBringingPlusOne] = useState<boolean>(false);
  const [plusOneFirstName, setPlusOneFirstName] = useState<string>("");
  const [plusOneLastName, setPlusOneLastName] = useState<string>("");
  const [plusOneMeal, setPlusOneMeal] = useState<string>(WEDDING_CONFIG.meals[0].id);
  const [plusOneDietary, setPlusOneDietary] = useState<string>("");

  // Song & Note
  const [songRequest, setSongRequest] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Auto Lookup on Mount if initialCode or initialName supplied
  useEffect(() => {
    if (initialCode) {
      const match = findGuestByCode(initialCode);
      if (match) {
        selectGuest(match);
      } else {
        setLookupError(`Code "${initialCode}" was not found on the guest list.`);
      }
    } else if (initialName) {
      handleNameSearch(initialName);
    }
  }, [initialCode, initialName]);

  const selectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setLookupError(null);

    // Pre-fill existing RSVP data if guest already submitted before
    if (guest.rsvpSubmitted) {
      setAttending(guest.attending ?? true);
      setMealPreference(guest.mealPreference || WEDDING_CONFIG.meals[0].id);
      setDietaryRestrictions(guest.dietaryRestrictions || "");
      if (guest.allowedPlusOne && guest.plusOne) {
        setBringingPlusOne(guest.plusOne.attending);
        setPlusOneFirstName(guest.plusOne.firstName || "");
        setPlusOneLastName(guest.plusOne.lastName || "");
        setPlusOneMeal(guest.plusOne.mealPreference || WEDDING_CONFIG.meals[0].id);
        setPlusOneDietary(guest.plusOne.dietaryRestrictions || "");
      }
      setSongRequest(guest.songRequest || "");
      setMessage(guest.message || "");
      setStep(5); // Go directly to confirmation / summary view with option to edit!
    } else {
      // Default initial states
      setAttending(true);
      setMealPreference(WEDDING_CONFIG.meals[0].id);
      setStep(2);
    }
  };

  const handleNameSearch = (query: string) => {
    setLookupError(null);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = searchGuestsByName(query);
    setIsSearching(false);
    setSearchResults(results);

    if (results.length === 0) {
      setLookupError(
        `We couldn't find "${query}" on our guest list. Please double check spelling, or try entering your unique invite code below!`
      );
    } else if (results.length === 1) {
      selectGuest(results[0]);
    }
  };

  const handleCodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    if (!codeQuery.trim()) return;

    const match = findGuestByCode(codeQuery);
    if (match) {
      selectGuest(match);
    } else {
      setLookupError(`Code "${codeQuery}" not found. Please check your invitation card.`);
    }
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!attending) {
        // Declining: skip meal and +1 steps directly to note/song or confirmation
        setStep(4);
        return;
      }
      if (selectedGuest?.allowedPlusOne) {
        setStep(3); // Go to +1 step
      } else {
        setStep(4); // Go to song & note step
      }
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      handleSubmitFinal();
    }
  };

  const handleSubmitFinal = () => {
    if (!selectedGuest) return;

    const payload: RsvpPayload = {
      attending,
      mealPreference: attending ? mealPreference : undefined,
      dietaryRestrictions: attending ? dietaryRestrictions : undefined,
      plusOne:
        selectedGuest.allowedPlusOne && bringingPlusOne
          ? {
              attending: true,
              firstName: plusOneFirstName,
              lastName: plusOneLastName,
              mealPreference: plusOneMeal,
              dietaryRestrictions: plusOneDietary,
            }
          : selectedGuest.allowedPlusOne
          ? { attending: false }
          : undefined,
      songRequest,
      message,
    };

    const updated = submitRsvp(selectedGuest.id, payload);
    if (updated) {
      setSelectedGuest(updated);
      setStep(5);
      if (onSubmitted) onSubmitted(updated);

      // Trigger Confetti!
      if (attending) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore if canvas confetti unavailable
        }
      }
    }
  };

  const handleResetGuest = () => {
    setSelectedGuest(null);
    setSearchResults([]);
    setNameQuery("");
    setCodeQuery("");
    setLookupError(null);
    setStep(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Step Header Indicator */}
      {selectedGuest && (
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-sm font-serif font-bold text-stone-200">
              RSVP for {selectedGuest.firstName} {selectedGuest.lastName}
            </span>
          </div>
          <button
            onClick={handleResetGuest}
            className="text-xs text-stone-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Not you? Change</span>
          </button>
        </div>
      )}

      {/* STEP 1: GUEST LOOKUP (NAME SEARCH OR CODE) */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Search className="w-6 h-6" />
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Find Your Invitation
            </h3>
            <p className="text-stone-400 text-sm">
              Please enter your full name as written on your invitation, or enter your personalized guest code.
            </p>
          </div>

          {/* Search by Name */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Option 1: Search by Guest Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={nameQuery}
                onChange={(e) => handleNameSearch(e.target.value)}
                placeholder="e.g. Alex Rivers or Jordan Smith"
                className="w-full px-4 py-3.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-base"
              />
              <Search className="absolute right-4 top-3.5 w-5 h-5 text-stone-500" />
            </div>

            {/* Live Search Results List */}
            {searchResults.length > 1 && (
              <div className="bg-stone-900 border border-stone-800 rounded-xl divide-y divide-stone-800 overflow-hidden">
                <div className="p-3 text-xs font-semibold text-stone-400 bg-stone-950">
                  Multiple guests found. Please select your name:
                </div>
                {searchResults.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => selectGuest(g)}
                    className="w-full p-3.5 text-left flex items-center justify-between hover:bg-amber-950/30 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-serif font-bold text-stone-100">
                        {g.firstName} {g.lastName}
                      </p>
                      <p className="text-xs text-stone-400">
                        {g.allowedPlusOne ? "+1 Allowed" : "Single Ticket"} •{" "}
                        {g.rsvpSubmitted ? "Already Responded" : "Pending RSVP"}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-800"></div>
            <span className="flex-shrink mx-4 text-stone-500 text-xs uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-stone-800"></div>
          </div>

          {/* Search by Code */}
          <form onSubmit={handleCodeSearch} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Option 2: Enter Invitation Code / QR Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeQuery}
                onChange={(e) => setCodeQuery(e.target.value.toUpperCase())}
                placeholder="e.g. NOLEN-SYREL-001"
                className="flex-grow px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-mono placeholder-stone-500 uppercase focus:outline-none focus:border-amber-500 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors cursor-pointer"
              >
                Submit Code
              </button>
            </div>
          </form>

          {/* Error Message */}
          {lookupError && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: ATTENDANCE & MEAL PREFERENCE */}
      {step === 2 && selectedGuest && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-bold text-stone-100">
              Will you be attending?
            </h3>
            <p className="text-stone-400 text-sm">
              {WEDDING_CONFIG.date.fullDate} • {WEDDING_CONFIG.venue.ceremony.name}
            </p>
          </div>

          {/* Attendance Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`p-5 rounded-2xl border-2 text-left flex items-start space-x-3 transition-all cursor-pointer ${
                attending
                  ? "border-amber-500 bg-amber-950/30 text-amber-100 shadow-lg"
                  : "border-stone-800 bg-stone-900/50 text-stone-400 hover:border-stone-700"
              }`}
            >
              <CheckCircle2
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  attending ? "text-amber-400" : "text-stone-600"
                }`}
              />
              <div>
                <p className="font-serif font-bold text-lg text-stone-100">
                  Joyfully Accepts
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  I will be there to celebrate with Nolen & Syrel!
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`p-5 rounded-2xl border-2 text-left flex items-start space-x-3 transition-all cursor-pointer ${
                !attending
                  ? "border-rose-500 bg-rose-950/30 text-rose-100 shadow-lg"
                  : "border-stone-800 bg-stone-900/50 text-stone-400 hover:border-stone-700"
              }`}
            >
              <XCircle
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  !attending ? "text-rose-400" : "text-stone-600"
                }`}
              />
              <div>
                <p className="font-serif font-bold text-lg text-stone-100">
                  Regretfully Declines
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Will be celebrating with you from afar.
                </p>
              </div>
            </button>
          </div>

          {/* Meal Selection for Primary Guest if Attending */}
          {attending && (
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300">
                  Select Entrée Choice for {selectedGuest.firstName}
                </h4>
              </div>

              <div className="space-y-3">
                {WEDDING_CONFIG.meals.map((meal) => (
                  <label
                    key={meal.id}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      mealPreference === meal.id
                        ? "border-amber-500 bg-stone-900 text-stone-100 shadow"
                        : "border-stone-800 bg-stone-900/40 text-stone-400 hover:bg-stone-900"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="meal"
                          value={meal.id}
                          checked={mealPreference === meal.id}
                          onChange={() => setMealPreference(meal.id)}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="font-serif font-bold text-stone-100">
                          {meal.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {meal.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-400 mt-2 pl-7">
                      {meal.description}
                    </p>
                  </label>
                ))}
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-stone-300">
                  Dietary Restrictions or Allergies for {selectedGuest.firstName}:
                </label>
                <input
                  type="text"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="e.g. Vegetarian, Peanut allergy, Celiac, Dairy free"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <span>{attending && selectedGuest.allowedPlusOne ? "Continue to +1 Info" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PLUS-ONE DETAILS (If guest has allowedPlusOne) */}
      {step === 3 && selectedGuest && selectedGuest.allowedPlusOne && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <UserPlus className="w-6 h-6" />
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-100">
              Plus One (+1) Information
            </h3>
            <p className="text-stone-400 text-sm">
              Your invitation includes a guest (+1). Will you be bringing a guest?
            </p>
          </div>

          {/* Plus One Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setBringingPlusOne(true)}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                bringingPlusOne
                  ? "border-amber-500 bg-amber-950/40 text-amber-200 font-bold"
                  : "border-stone-800 bg-stone-900/40 text-stone-400"
              }`}
            >
              Yes, I am bringing a guest
            </button>
            <button
              type="button"
              onClick={() => setBringingPlusOne(false)}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                !bringingPlusOne
                  ? "border-stone-600 bg-stone-900 text-stone-300 font-bold"
                  : "border-stone-800 bg-stone-900/40 text-stone-400"
              }`}
            >
              No guest (+1) needed
            </button>
          </div>

          {/* If bringing +1, collect +1 details */}
          {bringingPlusOne && (
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Guest (+1) Personal & Meal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs text-stone-300">Guest First Name *</label>
                  <input
                    type="text"
                    value={plusOneFirstName}
                    onChange={(e) => setPlusOneFirstName(e.target.value)}
                    placeholder="Guest's First Name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-stone-300">Guest Last Name *</label>
                  <input
                    type="text"
                    value={plusOneLastName}
                    onChange={(e) => setPlusOneLastName(e.target.value)}
                    placeholder="Guest's Last Name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Meal Selection for +1 */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Select Entrée Choice for Guest (+1)
                </label>
                {WEDDING_CONFIG.meals.map((meal) => (
                  <label
                    key={`plusone-${meal.id}`}
                    className={`block p-3.5 rounded-xl border transition-all cursor-pointer ${
                      plusOneMeal === meal.id
                        ? "border-amber-500 bg-stone-900 text-stone-100"
                        : "border-stone-800 bg-stone-900/40 text-stone-400 hover:bg-stone-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="plusone-meal"
                          value={meal.id}
                          checked={plusOneMeal === meal.id}
                          onChange={() => setPlusOneMeal(meal.id)}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="font-serif font-bold text-stone-100 text-sm">
                          {meal.name}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Plus one dietary */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-300">
                  Dietary Restrictions for Guest (+1):
                </label>
                <input
                  type="text"
                  value={plusOneDietary}
                  onChange={(e) => setPlusOneDietary(e.target.value)}
                  placeholder="e.g. Gluten-free, Vegan, Nut allergy"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MUSIC & NOTE TO COUPLE */}
      {step === 4 && selectedGuest && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-bold text-stone-100">
              Almost Done!
            </h3>
            <p className="text-stone-400 text-sm">
              Help us build our dance playlist and send a warm message to Nolen & Syrel.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Song Request (Dance Floor Guarantee!)</span>
              </label>
              <input
                type="text"
                value={songRequest}
                onChange={(e) => setSongRequest(e.target.value)}
                placeholder="e.g. September by Earth Wind & Fire, Dancing Queen..."
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Note / Message to Nolen & Syrel</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Leave a sweet note, well wishes, or advice for the happy couple!"
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(selectedGuest.allowedPlusOne && attending ? 3 : 2)}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmitFinal}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base transition-all shadow-xl flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Submit RSVP Response</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION BADGE / SUMMARY VIEW */}
      {step === 5 && selectedGuest && (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-stone-100">
              {selectedGuest.attending ? "RSVP Confirmed!" : "Response Recorded"}
            </h3>
            <p className="text-stone-400 text-sm">
              Thank you, {selectedGuest.firstName}! We have saved your response.
            </p>
          </div>

          {/* Digital Ticket / Pass Card Mockup */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  Wedding Guest Pass
                </span>
                <span className="font-serif font-bold text-xl text-stone-100">
                  {selectedGuest.firstName} {selectedGuest.lastName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                  Status
                </span>
                <span
                  className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                    selectedGuest.attending
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}
                >
                  {selectedGuest.attending ? "ATTENDING" : "DECLINED"}
                </span>
              </div>
            </div>

            {/* Response Breakdown */}
            {selectedGuest.attending && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-300">
                <div className="grid grid-cols-2 gap-4 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Primary Meal</span>
                    <span className="font-semibold text-amber-200">
                      {WEDDING_CONFIG.meals.find((m) => m.id === selectedGuest.mealPreference)?.name || "Selected"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Dietary Notes</span>
                    <span className="font-semibold text-stone-300">
                      {selectedGuest.dietaryRestrictions || "None"}
                    </span>
                  </div>
                </div>

                {selectedGuest.plusOne && selectedGuest.plusOne.attending && (
                  <div className="grid grid-cols-2 gap-4 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Plus-One (+1)</span>
                      <span className="font-semibold text-amber-200">
                        {selectedGuest.plusOne.firstName} {selectedGuest.plusOne.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Plus-One Meal</span>
                      <span className="font-semibold text-stone-300">
                        {WEDDING_CONFIG.meals.find((m) => m.id === selectedGuest.plusOne?.mealPreference)?.name || "Selected"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Personalized QR Code & Invite Code */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">
                  Invitation Code
                </span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {selectedGuest.code}
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl shadow shrink-0">
                {/* Visual QR Code Mockup */}
                <QrCode className="w-10 h-10 text-stone-950" />
              </div>
            </div>
          </div>

          {/* Edit / Change Response Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold text-sm transition-colors text-center cursor-pointer"
            >
              Update / Change Response
            </button>
            <button
              onClick={handleResetGuest}
              className="flex-1 py-3 rounded-xl bg-stone-950 hover:bg-stone-900 border border-stone-800 text-stone-400 text-sm transition-colors text-center cursor-pointer"
            >
              Done / Lookup Another Guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
