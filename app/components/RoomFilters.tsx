"use client";

import { RoomType } from "@/types";
import { SlidersHorizontal } from "lucide-react";

const TYPES: { label: string; value: RoomType | "ALL" }[] = [
  { label: "ทุกประเภท", value: "ALL" },
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Family", value: "Family" },
];

const PRICES = [
  { label: "ทุกราคา", value: 99999 },
  { label: "ไม่เกิน ฿2,000", value: 2000 },
  { label: "ไม่เกิน ฿4,000", value: 4000 },
  { label: "ไม่เกิน ฿6,000", value: 6000 },
];

type Props = {
  selectedType: RoomType | "ALL";
  selectedMaxPrice: number;
  totalCount: number;
  filteredCount: number;
  onTypeChange: (type: RoomType | "ALL") => void;
  onPriceChange: (price: number) => void;
};

export default function RoomFilters({
  selectedType,
  selectedMaxPrice,
  totalCount,
  filteredCount,
  onTypeChange,
  onPriceChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />

        {/* Type filter */}
        <div className="flex gap-1.5 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm transition-all ${
                selectedType === t.value
                  ? "bg-stone-900 text-white font-medium"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-stone-200 hidden sm:block" />

        {/* Price filter */}
        <select
          value={selectedMaxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="text-sm border border-stone-200 rounded-full px-3.5 py-1.5 bg-white text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300 cursor-pointer"
        >
          {PRICES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <p className="text-sm text-stone-500 shrink-0">
        พบ{" "}
        <span className="font-medium text-stone-800">{filteredCount}</span>
        {" "}จาก{" "}
        <span className="font-medium text-stone-800">{totalCount}</span>{" "}
        ห้อง
      </p>
    </div>
  );
}
