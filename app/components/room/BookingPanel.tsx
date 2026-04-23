"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Moon, AlertCircle } from "lucide-react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { Room } from "@/types";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
  room: Room;
};

export default function BookingPanel({ room }: Props) {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : today;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  }, [checkIn, checkOut]);

  const totalPrice = nights * room.pricePerNight;
  const isAvailable = room.status === "AVAILABLE";

  const handleBook = () => {
    setError("");
    if (!checkIn) return setError("กรุณาเลือกวัน Check-in");
    if (!checkOut) return setError("กรุณาเลือกวัน Check-out");
    if (nights <= 0) return setError("วัน Check-out ต้องหลัง Check-in");
    if (guests > room.maxOccupancy)
      return setError(`ห้องนี้รองรับสูงสุด ${room.maxOccupancy} คน`);

    const toUTC = (dateStr: string) => {
      return new Date(dateStr + "T00:00:00").toISOString();
    };

    // ส่ง query params ไปหน้า booking form
    const params = new URLSearchParams({
      checkIn: toUTC(checkIn),
      checkOut: toUTC(checkOut),
      guests: String(guests),
    });
    router.push(`/booking/${room.id}?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm sticky top-24">
      {/* Price header */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-bold text-stone-900">
          ฿{room.pricePerNight.toLocaleString()}
        </span>
        <span className="text-stone-500 text-sm">/คืน</span>
      </div>

      {/* Status */}
      {!isAvailable && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          ห้องนี้กำลังปิดปรับปรุงชั่วคราว
        </div>
      )}

      <div className="space-y-3">
        {/* Check-in */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            วัน Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            disabled={!isAvailable}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
              setError("");
            }}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:bg-stone-50 disabled:text-stone-400 cursor-pointer"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            วัน Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            disabled={!isAvailable || !checkIn}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setError("");
            }}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:bg-stone-50 disabled:text-stone-400 cursor-pointer"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            จำนวนผู้เข้าพัก (สูงสุด {room.maxOccupancy} คน)
          </label>
          <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={!isAvailable || guests <= 1}
              className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 disabled:text-stone-300 transition-colors text-lg leading-none"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-medium text-stone-800">
              {guests} คน
            </span>
            <button
              onClick={() =>
                setGuests((g) => Math.min(room.maxOccupancy, g + 1))
              }
              disabled={!isAvailable || guests >= room.maxOccupancy}
              className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 disabled:text-stone-300 transition-colors text-lg leading-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-3 bg-red-50 px-4 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="mt-5 pt-5 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-between text-sm text-stone-600">
            <span className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5" />฿
              {room.pricePerNight.toLocaleString()} × {nights} คืน
            </span>
            <span>฿{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100">
            <span>รวมทั้งหมด</span>
            <span className="text-lg">฿{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleBook}
        disabled={!isAvailable}
        className={`w-full mt-5 py-3.5 rounded-xl font-semibold text-sm transition-all ${
          isAvailable
            ? "bg-stone-900 hover:bg-stone-700 text-white active:scale-[0.98]"
            : "bg-stone-100 text-stone-400 cursor-not-allowed"
        }`}
      >
        {isAvailable ? "จองเลย" : "ไม่พร้อมให้บริการ"}
      </button>

      <p className="text-center text-xs text-stone-400 mt-3">
        ยังไม่มีการเรียกเก็บเงิน — ยืนยันในขั้นตอนถัดไป
      </p>
    </div>
  );
}
