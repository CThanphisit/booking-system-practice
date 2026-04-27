"use client";

import { useState } from "react";
import { Search, Calendar, Users } from "lucide-react";
import { SearchParams } from "@/types";

type Props = {
  onSearch: (params: Partial<SearchParams>) => void;
  initialValues?: Partial<SearchParams>;
};

export default function SearchBar({ onSearch, initialValues }: Props) {
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut ?? "");
  const [guests, setGuests] = useState(initialValues?.guests ?? 1);

  // หาวันขั้นต่ำ (วันนี้)
  const today = new Date().toISOString().split("T")[0];
  // checkOut ต้องหลัง checkIn อย่างน้อย 1 วัน
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : today;

  const handleSearch = () => {
    onSearch({ checkIn, checkOut, guests });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Check-in */}
        <div className="flex-1 flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-white/60 text-xs mb-0.5">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) setCheckOut("");
              }}
              className="w-full bg-transparent text-white text-sm focus:outline-none [color-scheme:dark] cursor-pointer"
            />
          </div>
        </div>

        <div className="hidden sm:block w-px bg-white/20 my-2" />

        {/* Check-out */}
        <div className="flex-1 flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-white/60 text-xs mb-0.5">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              min={minCheckOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-white text-sm focus:outline-none [color-scheme:dark] cursor-pointer"
            />
          </div>
        </div>

        <div className="hidden sm:block w-px bg-white/20 my-2" />

        {/* Guests */}
        <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors">
          <Users className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <label className="block text-white/60 text-xs mb-0.5">
              จำนวนคน
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-6 h-6 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/20 text-sm leading-none"
              >
                −
              </button>
              <span className="text-white text-sm w-4 text-center font-medium">
                {guests}
              </span>
              <button
                onClick={() => setGuests((g) => Math.min(10, g + 1))}
                className="w-6 h-6 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/20 text-sm leading-none"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>ค้นหา</span>
        </button>
      </div>
    </div>
  );
}
