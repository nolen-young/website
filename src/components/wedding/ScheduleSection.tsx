"use client";

import React, { useState } from "react";
import { Clock, MapPin, Shirt, CalendarPlus, Check } from "lucide-react";
import { WEDDING_CONFIG, ScheduleItem } from "@/data/weddingConfig";

export function ScheduleSection() {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCalendar = (item: ScheduleItem) => {
    // Generate .ics calendar download file
    const title = `${item.title} - ${WEDDING_CONFIG.couple.groom} & ${WEDDING_CONFIG.couple.bride}'s Wedding`;
    const details = `${item.description}\nAttire: ${item.attire || "N/A"}\nLocation: ${item.location}`;
    const location = `${item.location}, ${WEDDING_CONFIG.venue.ceremony.address}`;
    
    // Fallback date generation
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NolenAndSyrelWedding//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${details.replace(/\n/g, "\\n")}
LOCATION:${location}
DTSTART:20261017T230000Z
DTEND:20261018T050000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${item.id}-wedding-event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 3000);
  };

  return (
    <section id="schedule" className="py-24 px-4 bg-stone-950">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            The Celebration Timeline
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100">
            Schedule of Events
          </h3>
          <p className="text-stone-400 max-w-xl mx-auto font-serif italic text-lg">
            Here is what to expect throughout our wedding weekend on San Juan Island.
          </p>
        </div>

        {/* Schedule List */}
        <div className="relative border-l-2 border-stone-800 ml-4 sm:ml-32 space-y-10">
          {WEDDING_CONFIG.schedule.map((item) => (
            <div key={item.id} className="relative pl-6 sm:pl-10 group">
              {/* Dot icon */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-stone-950 border-2 border-amber-500 group-hover:bg-amber-500 transition-colors" />

              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-amber-500/30 transition-all shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>{item.time}</span>
                  </div>
                  {item.attire && (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-medium w-fit">
                      <Shirt className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.attire}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-serif font-bold text-stone-100">
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-stone-400 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-stone-300 text-sm sm:text-base pt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleAddToCalendar(item)}
                    className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 transition-colors cursor-pointer"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Added to Calendar</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add to Calendar (.ics)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
