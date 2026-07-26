"use client";

import React, { useState } from "react";
import { Clock, MapPin, Shirt, CalendarPlus, Check } from "lucide-react";
import { WEDDING_CONFIG, ScheduleItem } from "@/data/weddingConfig";

export function ScheduleSection() {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCalendar = (item: ScheduleItem) => {
    const title = `${item.title} - ${WEDDING_CONFIG.couple.groom} & ${WEDDING_CONFIG.couple.bride}'s Wedding`;
    const details = `${item.description}\nAttire: ${item.attire || "N/A"}\nLocation: ${item.location}`;
    const location = `${item.location}, ${WEDDING_CONFIG.venue.ceremony.address}`;
    
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
    <section id="schedule" className="py-24 px-4 bg-[#FDFBF7] border-t border-[#E2D9CE]">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#C87A68] block">
            The Celebration Timeline
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1B3B2B]">
            Schedule of Events
          </h2>
          <p className="text-[#2E3834] max-w-xl mx-auto font-serif italic text-lg">
            What to expect throughout our weekend celebration in Friday Harbor.
          </p>
        </div>

        {/* Schedule List */}
        <div className="relative border-l-2 border-[#1B3B2B]/20 ml-4 sm:ml-28 space-y-10">
          {WEDDING_CONFIG.schedule.map((item) => (
            <div key={item.id} className="relative pl-6 sm:pl-10 group">
              {/* Dot icon */}
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#FDFBF7] border-2 border-[#1B3B2B] group-hover:bg-[#C87A68] group-hover:border-[#C87A68] transition-colors" />

              <div className="bg-[#FFFFFF] border border-[#E2D9CE] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D9CE] pb-4">
                  <div className="flex items-center space-x-2 text-[#1B3B2B] font-serif text-sm font-semibold">
                    <Clock className="w-4 h-4 text-[#C87A68]" />
                    <span>{item.time}</span>
                  </div>
                  {item.attire && (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F9EBE8] text-[#A65747] text-xs font-semibold uppercase tracking-wider w-fit border border-[#E8B4A8]">
                      <Shirt className="w-3.5 h-3.5" />
                      <span>{item.attire}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#1B3B2B]">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[#6B7C75] text-sm">
                    <MapPin className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-[#2E3834] text-sm sm:text-base pt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleAddToCalendar(item)}
                    className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#F4EFEA] hover:bg-[#E2D9CE] text-[#1B3B2B] border border-[#E2D9CE] transition-colors cursor-pointer"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                        <span className="text-[#1B3B2B]">Added to Calendar</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-3.5 h-3.5 text-[#C87A68]" />
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
