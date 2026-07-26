"use client";

import React from "react";
import { X } from "lucide-react";
import { RsvpForm } from "./RsvpForm";

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string | null;
  initialName?: string | null;
}

export function RsvpModal({ isOpen, onClose, initialCode, initialName }: RsvpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#1B3B2B]/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2.5 rounded-full bg-[#FFFFFF] border border-[#E2D9CE] text-[#1B3B2B] hover:text-[#C87A68] hover:bg-[#F4EFEA] transition-colors shadow-md cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Embedded Form */}
        <RsvpForm initialCode={initialCode} initialName={initialName} />
      </div>
    </div>
  );
}
