"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDateIso: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDateIso }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDateIso).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDateIso]);

  if (!mounted) return null;

  const timerUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
        {timerUnits.map((unit) => (
          <div
            key={unit.label}
            className="bg-stone-900/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col justify-center transform hover:scale-105 transition-transform"
          >
            <span className="font-mono text-2xl sm:text-4xl font-bold text-amber-300 tracking-tight">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-stone-400 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
