"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Search,
  CheckCircle2,
  XCircle,
  UserPlus,
  Utensils,
  MessageSquare,
  QrCode,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Heart,
  Sparkles,
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
  // Step State: 1 = Lookup, 2 = Primary Attendance & Meal, 3 = +1 Guest Details, 4 = Note to Couple, 5 = Confirmation
  const [step, setStep] = useState<number>(1);
  const [nameQuery, setNameQuery] = useState<string>(initialName || "");
  const [codeQuery, setCodeQuery] = useState<string>(initialCode || "");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Primary Guest Form Fields
  const [attending, setAttending] = useState<boolean>(true);
  const [mealPreference, setMealPreference] = useState<string>(WEDDING_CONFIG.meals[0].id);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");

  // +1 Guest Form Fields
  const [bringingPlusOne, setBringingPlusOne] = useState<boolean>(true);
  const [plusOneFirstName, setPlusOneFirstName] = useState<string>("");
  const [plusOneLastName, setPlusOneLastName] = useState<string>("");
  const [plusOneMeal, setPlusOneMeal] = useState<string>(WEDDING_CONFIG.meals[0].id);
  const [plusOneDietary, setPlusOneDietary] = useState<string>("");

  // Note to Couple
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (initialCode) {
      const match = findGuestByCode(initialCode);
      if (match) {
        selectGuest(match);
      } else {
        setLookupError(`Code "${initialCode}" was not found on the guest list.`);
      }
    } else if (initialName) {
      setNameQuery(initialName);
      const results = searchGuestsByName(initialName);
      setSearchResults(results);
      if (results.length === 1) {
        selectGuest(results[0]);
      }
    }
  }, [initialCode, initialName]);

  const selectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setLookupError(null);

    if (guest.rsvpSubmitted) {
      setAttending(guest.attending ?? true);
      setMealPreference(guest.mealPreference || WEDDING_CONFIG.meals[0].id);
      setDietaryRestrictions(guest.dietaryRestrictions || "");
      if (guest.allowedPlusOne) {
        if (guest.plusOne) {
          setBringingPlusOne(guest.plusOne.attending);
          setPlusOneFirstName(guest.plusOne.firstName || "");
          setPlusOneLastName(guest.plusOne.lastName || "");
          setPlusOneMeal(guest.plusOne.mealPreference || WEDDING_CONFIG.meals[0].id);
          setPlusOneDietary(guest.plusOne.dietaryRestrictions || "");
        } else {
          setBringingPlusOne(true);
        }
      }
      setMessage(guest.message || "");
      setStep(5);
    } else {
      setAttending(true);
      setMealPreference(WEDDING_CONFIG.meals[0].id);
      setDietaryRestrictions("");
      if (guest.allowedPlusOne) {
        setBringingPlusOne(true);
        setPlusOneFirstName("");
        setPlusOneLastName("");
        setPlusOneMeal(WEDDING_CONFIG.meals[0].id);
        setPlusOneDietary("");
      } else {
        setBringingPlusOne(false);
      }
      setStep(2);
    }
  };

  const handleNameQueryChange = (query: string) => {
    setNameQuery(query);
    setLookupError(null);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = searchGuestsByName(query);
    setSearchResults(results);
  };

  const handleNameSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    if (!nameQuery.trim()) return;

    const results = searchGuestsByName(nameQuery);
    setSearchResults(results);

    if (results.length === 0) {
      setLookupError(
        `We couldn't find "${nameQuery}" on our guest list. Please check your spelling or enter your unique invitation code below.`
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
        setStep(4);
        return;
      }
      if (selectedGuest?.allowedPlusOne) {
        setStep(3);
      } else {
        setStep(4);
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
      message,
    };

    const updated = submitRsvp(selectedGuest.id, payload);
    if (updated) {
      setSelectedGuest(updated);
      setStep(5);
      if (onSubmitted) onSubmitted(updated);

      if (attending) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            colors: ["#1B3B2B", "#C87A68", "#E8B4A8"],
            origin: { y: 0.6 },
          });
        } catch (e) {}
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

  // Step Progress Indicator
  const getStepProgress = () => {
    if (step === 1) return null;
    const totalSteps = selectedGuest?.allowedPlusOne && attending ? 4 : 3;
    let currentDisplayStep = 1;
    if (step === 2) currentDisplayStep = 1;
    if (step === 3) currentDisplayStep = 2;
    if (step === 4) currentDisplayStep = selectedGuest?.allowedPlusOne && attending ? 3 : 2;
    if (step === 5) currentDisplayStep = totalSteps;

    return (
      <div className="flex items-center justify-between text-xs font-serif text-[#6B7C75] border-b border-[#E2D9CE] pb-3">
        <span className="font-bold text-[#1B3B2B]">
          Step {currentDisplayStep} of {totalSteps}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 === currentDisplayStep
                  ? "w-6 bg-[#C87A68]"
                  : i + 1 < currentDisplayStep
                  ? "w-3 bg-[#1B3B2B]"
                  : "w-3 bg-[#E2D9CE]"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
      {/* Header Indicator */}
      {selectedGuest && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#C87A68] fill-[#C87A68]" />
              <span className="text-sm font-serif font-bold text-[#1B3B2B]">
                RSVP for {selectedGuest.firstName} {selectedGuest.lastName}
              </span>
              {selectedGuest.allowedPlusOne && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF2ED] text-[#1B3B2B] text-[10px] font-bold uppercase tracking-wider border border-[#38664F]/30">
                  +1 Included
                </span>
              )}
            </div>
            <button
              onClick={handleResetGuest}
              className="text-xs text-[#6B7C75] hover:text-[#C87A68] flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Not you? Change</span>
            </button>
          </div>
          {getStepProgress()}
        </div>
      )}

      {/* STEP 1: GUEST LOOKUP */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-script text-3xl text-[#C87A68] block">
              Kindly Respond
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#1B3B2B]">
              Find Your Invitation
            </h3>
            <p className="text-[#2E3834] text-sm font-sans max-w-md mx-auto">
              Please enter your full name as written on your invitation, or enter your unique guest code.
            </p>
          </div>

          {/* Search by Name */}
          <form onSubmit={handleNameSearchSubmit} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
              Option 1: Search by Guest Name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={nameQuery}
                  onChange={(e) => handleNameQueryChange(e.target.value)}
                  placeholder="e.g. Alex Rivers or Jordan Smith"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] transition-colors text-base font-serif"
                />
                <Search className="absolute right-4 top-3.5 w-5 h-5 text-[#6B7C75]" />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>

            {/* Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-[#FDFBF7] border border-[#E2D9CE] rounded-2xl divide-y divide-[#E2D9CE] overflow-hidden mt-3 shadow-sm">
                <div className="p-3 text-xs font-semibold text-[#6B7C75] bg-[#F4EFEA]">
                  {searchResults.length === 1
                    ? "Guest found! Click below to begin RSVP:"
                    : `${searchResults.length} guests found. Please select your name:`}
                </div>
                {searchResults.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => selectGuest(g)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[#F9EBE8] transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="font-serif font-bold text-lg text-[#1B3B2B] group-hover:text-[#C87A68] transition-colors">
                        {g.firstName} {g.lastName}
                      </p>
                      <p className="text-xs text-[#6B7C75]">
                        {g.allowedPlusOne ? "+1 Allowed" : "Single Ticket"} &bull;{" "}
                        {g.rsvpSubmitted ? "Already Responded (Click to view/edit)" : "Pending RSVP"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#1B3B2B] group-hover:bg-[#C87A68] text-white text-xs font-semibold uppercase tracking-wider transition-colors">
                      <span>Select</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#E2D9CE]"></div>
            <span className="flex-shrink mx-4 text-[#6B7C75] text-xs font-semibold uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-[#E2D9CE]"></div>
          </div>

          {/* Search by Code */}
          <form onSubmit={handleCodeSearch} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
              Option 2: Enter Invitation Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeQuery}
                onChange={(e) => setCodeQuery(e.target.value.toUpperCase())}
                placeholder="e.g. NOLEN-SYREL-001"
                className="flex-grow px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] font-mono placeholder-[#6B7C75] uppercase focus:outline-none focus:border-[#C87A68] text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Submit Code
              </button>
            </div>
          </form>

          {/* Error Message */}
          {lookupError && (
            <div className="p-4 rounded-2xl bg-[#F9EBE8] border border-[#E8B4A8] text-[#A65747] text-xs sm:text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-[#C87A68] shrink-0 mt-0.5" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: PRIMARY GUEST ATTENDANCE & MEAL PREFERENCE */}
      {step === 2 && selectedGuest && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="font-script text-3xl text-[#C87A68] block">
              Celebration Attendance
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#1B3B2B]">
              Will you be attending?
            </h3>
            <p className="text-[#6B7C75] text-xs uppercase tracking-wider font-semibold pt-1">
              {WEDDING_CONFIG.date.fullDate} • {WEDDING_CONFIG.venue.ceremony.name}
            </p>
          </div>

          {/* Plus-One Callout Banner */}
          {selectedGuest.allowedPlusOne && (
            <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#38664F]/30 text-[#1B3B2B] flex items-center space-x-3 text-xs sm:text-sm">
              <Sparkles className="w-5 h-5 text-[#C87A68] shrink-0" />
              <div>
                <strong className="font-serif font-bold text-[#1B3B2B]">Your invitation includes a Plus One (+1)!</strong>
                <p className="text-[#2E3834] text-xs mt-0.5">
                  You will be prompted to enter your guest&apos;s name and dinner selection in the next step.
                </p>
              </div>
            </div>
          )}

          {/* Attendance Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`p-5 rounded-2xl border-2 text-left flex items-start space-x-3 transition-all cursor-pointer ${
                attending
                  ? "border-[#1B3B2B] bg-[#EBF2ED] text-[#1B3B2B] shadow-sm"
                  : "border-[#E2D9CE] bg-[#FDFBF7] text-[#6B7C75] hover:border-[#C87A68]"
              }`}
            >
              <CheckCircle2
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  attending ? "text-[#1B3B2B]" : "text-[#E2D9CE]"
                }`}
              />
              <div>
                <p className="font-serif font-bold text-lg text-[#1B3B2B]">
                  Joyfully Accepts
                </p>
                <p className="text-xs text-[#2E3834] mt-1">
                  I will be there to celebrate with Nolen &amp; Syrel!
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`p-5 rounded-2xl border-2 text-left flex items-start space-x-3 transition-all cursor-pointer ${
                !attending
                  ? "border-[#C87A68] bg-[#F9EBE8] text-[#A65747] shadow-sm"
                  : "border-[#E2D9CE] bg-[#FDFBF7] text-[#6B7C75] hover:border-[#C87A68]"
              }`}
            >
              <XCircle
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  !attending ? "text-[#C87A68]" : "text-[#E2D9CE]"
                }`}
              />
              <div>
                <p className="font-serif font-bold text-lg text-[#1B3B2B]">
                  Regretfully Declines
                </p>
                <p className="text-xs text-[#2E3834] mt-1">
                  Will be celebrating with you from afar.
                </p>
              </div>
            </button>
          </div>

          {/* Meal Selection for Primary Guest */}
          {attending && (
            <div className="space-y-4 pt-4 border-t border-[#E2D9CE]">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-[#C87A68]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
                  Select Entrée Choice for {selectedGuest.firstName}
                </h4>
              </div>

              <div className="space-y-3">
                {WEDDING_CONFIG.meals.map((meal) => (
                  <label
                    key={meal.id}
                    className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                      mealPreference === meal.id
                        ? "border-[#1B3B2B] bg-[#EBF2ED] text-[#1B3B2B] shadow-sm"
                        : "border-[#E2D9CE] bg-[#FDFBF7] text-[#2E3834] hover:bg-[#F4EFEA]"
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
                          className="w-4 h-4 text-[#1B3B2B] focus:ring-[#1B3B2B]"
                        />
                        <span className="font-serif font-bold text-[#1B3B2B] text-base">
                          {meal.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {meal.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4EFEA] text-[#C87A68] border border-[#E2D9CE]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#2E3834] mt-2 pl-7 leading-relaxed font-sans">
                      {meal.description}
                    </p>
                  </label>
                ))}
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#1B3B2B]">
                  Dietary Restrictions or Allergies for {selectedGuest.firstName}:
                </label>
                <input
                  type="text"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="e.g. Vegetarian, Peanut allergy, Celiac, Dairy free"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] text-sm"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-[#6B7C75] hover:text-[#1B3B2B] text-xs uppercase tracking-wider font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-7 py-3 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center space-x-2 cursor-pointer shadow"
            >
              <span>{attending && selectedGuest.allowedPlusOne ? "Continue to +1 Info" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PLUS-ONE GUEST DETAILS */}
      {step === 3 && selectedGuest && selectedGuest.allowedPlusOne && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="font-script text-3xl text-[#C87A68] block">
              Accompanied Guest
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#1B3B2B]">
              Plus One (+1) Information
            </h3>
            <p className="text-[#2E3834] text-sm font-serif">
              {selectedGuest.firstName}&apos;s invitation includes a Plus One (+1) guest.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setBringingPlusOne(true)}
              className={`p-4 rounded-2xl border text-center font-serif text-sm transition-all cursor-pointer ${
                bringingPlusOne
                  ? "border-[#1B3B2B] bg-[#EBF2ED] text-[#1B3B2B] font-bold shadow-sm"
                  : "border-[#E2D9CE] bg-[#FDFBF7] text-[#6B7C75]"
              }`}
            >
              Yes, bringing a guest (+1)
            </button>
            <button
              type="button"
              onClick={() => setBringingPlusOne(false)}
              className={`p-4 rounded-2xl border text-center font-serif text-sm transition-all cursor-pointer ${
                !bringingPlusOne
                  ? "border-[#1B3B2B] bg-[#F4EFEA] text-[#1B3B2B] font-bold shadow-sm"
                  : "border-[#E2D9CE] bg-[#FDFBF7] text-[#6B7C75]"
              }`}
            >
              No guest needed
            </button>
          </div>

          {/* Input Fields for +1 */}
          {bringingPlusOne && (
            <div className="space-y-4 pt-4 border-t border-[#E2D9CE]">
              <div className="flex items-center space-x-2 text-[#C87A68]">
                <UserPlus className="w-4 h-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Guest (+1) Personal &amp; Dinner Selection
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1B3B2B]">Guest First Name *</label>
                  <input
                    type="text"
                    value={plusOneFirstName}
                    onChange={(e) => setPlusOneFirstName(e.target.value)}
                    placeholder="Guest's First Name"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] text-sm font-serif"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1B3B2B]">Guest Last Name *</label>
                  <input
                    type="text"
                    value={plusOneLastName}
                    onChange={(e) => setPlusOneLastName(e.target.value)}
                    placeholder="Guest's Last Name"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] text-sm font-serif"
                  />
                </div>
              </div>

              {/* Meal Selection for +1 */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
                  Select Entrée Choice for Guest (+1)
                </label>
                {WEDDING_CONFIG.meals.map((meal) => (
                  <label
                    key={`plusone-${meal.id}`}
                    className={`block p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      plusOneMeal === meal.id
                        ? "border-[#1B3B2B] bg-[#EBF2ED] text-[#1B3B2B]"
                        : "border-[#E2D9CE] bg-[#FDFBF7] text-[#2E3834] hover:bg-[#F4EFEA]"
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
                          className="w-4 h-4 text-[#1B3B2B] focus:ring-[#1B3B2B]"
                        />
                        <span className="font-serif font-bold text-[#1B3B2B] text-base">
                          {meal.name}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Plus one dietary */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1B3B2B]">
                  Dietary Restrictions for Guest (+1):
                </label>
                <input
                  type="text"
                  value={plusOneDietary}
                  onChange={(e) => setPlusOneDietary(e.target.value)}
                  placeholder="e.g. Gluten-free, Vegan, Nut allergy"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] text-sm"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-[#6B7C75] hover:text-[#1B3B2B] text-xs uppercase tracking-wider font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-7 py-3 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center space-x-2 cursor-pointer shadow"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: NOTE TO COUPLE */}
      {step === 4 && selectedGuest && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="font-script text-3xl text-[#C87A68] block">
              Warm Wishes
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#1B3B2B]">
              A Note for the Couple
            </h3>
            <p className="text-[#2E3834] text-sm font-serif">
              Leave a sweet note or message for Nolen &amp; Syrel (optional).
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C87A68] flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Note / Message for Nolen &amp; Syrel</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Leave a message, advice, or warm wishes for Nolen & Syrel!"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E2D9CE] text-[#1B3B2B] placeholder-[#6B7C75] focus:outline-none focus:border-[#C87A68] text-sm resize-none font-serif"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(selectedGuest.allowedPlusOne && attending ? 3 : 2)}
              className="px-4 py-2 rounded-xl text-[#6B7C75] hover:text-[#1B3B2B] text-xs uppercase tracking-wider font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmitFinal}
              className="px-8 py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#12281D] text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#C87A68] fill-[#C87A68]" />
              <span>Submit RSVP Response</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION PASS */}
      {step === 5 && selectedGuest && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF2ED] border border-[#38664F]/40 flex items-center justify-center text-[#1B3B2B] shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#1B3B2B]" />
            </div>
            <span className="font-script text-3xl text-[#C87A68] block">
              Thank You!
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#1B3B2B]">
              {selectedGuest.attending ? "RSVP Confirmed!" : "Response Recorded"}
            </h3>
            <p className="text-[#2E3834] text-sm font-serif">
              We look forward to seeing you, {selectedGuest.firstName}!
            </p>
          </div>

          {/* Digital Pass Card */}
          <div className="bg-[#FDFBF7] border border-[#E2D9CE] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E2D9CE] pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C87A68] block">
                  Wedding Guest Pass
                </span>
                <span className="font-serif font-bold text-2xl text-[#1B3B2B]">
                  {selectedGuest.firstName} {selectedGuest.lastName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7C75] block">
                  Status
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedGuest.attending
                      ? "bg-[#EBF2ED] text-[#1B3B2B] border border-[#38664F]/30"
                      : "bg-[#F9EBE8] text-[#A65747] border border-[#E8B4A8]"
                  }`}
                >
                  {selectedGuest.attending ? "ATTENDING" : "DECLINED"}
                </span>
              </div>
            </div>

            {selectedGuest.attending && (
              <div className="space-y-4 text-xs sm:text-sm text-[#2E3834]">
                {/* Primary Guest Details Card */}
                <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2D9CE] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E2D9CE]/60 pb-2">
                    <span className="font-serif font-bold text-[#1B3B2B] text-sm">
                      {selectedGuest.firstName} {selectedGuest.lastName} (Primary Guest)
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#EBF2ED] text-[#1B3B2B]">
                      Attending
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[#6B7C75] block text-[11px] font-serif">Entrée Selection</span>
                      <span className="font-bold text-[#1B3B2B] font-serif">
                        {WEDDING_CONFIG.meals.find((m) => m.id === selectedGuest.mealPreference)?.name || "Selected"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7C75] block text-[11px] font-serif">Dietary Notes</span>
                      <span className="font-semibold text-[#2E3834]">
                        {selectedGuest.dietaryRestrictions || "None"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plus-One Guest Details Card */}
                {selectedGuest.allowedPlusOne && (
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2D9CE] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#E2D9CE]/60 pb-2">
                      <span className="font-serif font-bold text-[#1B3B2B] text-sm">
                        {selectedGuest.plusOne?.attending && selectedGuest.plusOne.firstName
                          ? `${selectedGuest.plusOne.firstName} ${selectedGuest.plusOne.lastName || ""}`
                          : "Plus One (+1) Guest"}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          selectedGuest.plusOne?.attending
                            ? "bg-[#EBF2ED] text-[#1B3B2B]"
                            : "bg-[#F4EFEA] text-[#6B7C75]"
                        }`}
                      >
                        {selectedGuest.plusOne?.attending ? "Attending" : "Not Bringing +1"}
                      </span>
                    </div>

                    {selectedGuest.plusOne?.attending ? (
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <span className="text-[#6B7C75] block text-[11px] font-serif">Entrée Selection</span>
                          <span className="font-bold text-[#1B3B2B] font-serif">
                            {WEDDING_CONFIG.meals.find((m) => m.id === selectedGuest.plusOne?.mealPreference)?.name || "Selected"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6B7C75] block text-[11px] font-serif">Dietary Notes</span>
                          <span className="font-semibold text-[#2E3834]">
                            {selectedGuest.plusOne?.dietaryRestrictions || "None"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B7C75] italic pt-1">
                        No +1 guest registered for this invitation.
                      </p>
                    )}
                  </div>
                )}

                {/* Personal Message Preview */}
                {selectedGuest.message && (
                  <div className="bg-[#F4EFEA] p-3.5 rounded-xl border border-[#E2D9CE] text-xs">
                    <span className="text-[#6B7C75] block text-[10px] uppercase tracking-wider font-semibold mb-1">
                      Note to Nolen &amp; Syrel
                    </span>
                    <p className="text-[#2E3834] font-serif italic">&ldquo;{selectedGuest.message}&rdquo;</p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-[#E2D9CE] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-[#6B7C75] uppercase tracking-widest block">
                  Invitation Code
                </span>
                <span className="font-mono text-sm font-bold text-[#1B3B2B]">
                  {selectedGuest.code}
                </span>
              </div>

              <div className="p-2 bg-[#FFFFFF] rounded-2xl border border-[#E2D9CE] shadow-sm">
                <QrCode className="w-9 h-9 text-[#1B3B2B]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-full bg-[#F4EFEA] hover:bg-[#E2D9CE] border border-[#E2D9CE] text-[#1B3B2B] font-semibold text-xs uppercase tracking-widest transition-colors text-center cursor-pointer"
            >
              Update / Edit Response
            </button>
            <button
              onClick={handleResetGuest}
              className="flex-1 py-3 rounded-full bg-[#FFFFFF] hover:bg-[#FDFBF7] border border-[#E2D9CE] text-[#6B7C75] font-semibold text-xs uppercase tracking-widest transition-colors text-center cursor-pointer"
            >
              Done / Lookup Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
