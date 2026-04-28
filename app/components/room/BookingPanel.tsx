"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, AlertCircle, Moon } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { Room } from "@/types";
import { RoomDateRangePicker } from "./RoomDateRangePicker";
import { useAuth } from "@/app/context/AuthContext";

type Props = {
  room: Room;
  bookedDates?: Date[];
};

export default function BookingPanel({ room, bookedDates = [] }: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const isAvailable = room.status === "AVAILABLE";

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return differenceInCalendarDays(checkOut, checkIn);
  }, [checkIn, checkOut]);

  const totalPrice = nights * Number(room.pricePerNight);

  const handleBook = () => {
    setError("");
    console.log("user", !user?.id);
    if (!user?.id) {
      router.push(`/login?callbackUrl=/rooms/${room.id}`);
    } else {
      if (!checkIn || !checkOut)
        return setError("กรุณาเลือกวัน Check-in และ Check-out");
      if (nights <= 0) return setError("กรุณาเลือกวันให้ถูกต้อง");
      if (guests > room.maxOccupancy) {
        return setError(`ห้องนี้รองรับสูงสุด ${room.maxOccupancy} คน`);
      }

      const params = new URLSearchParams({
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: String(guests),
      });
      router.push(`/booking/${room.id}?${params.toString()}`);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm sticky top-24">
      {/* Price header */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-bold text-stone-900">
          ฿{Number(room.pricePerNight).toLocaleString()}
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
        <RoomDateRangePicker
          value={{
            from: checkIn,
            to: checkOut,
          }}
          onChange={(range) => {
            setCheckIn(range?.from);
            setCheckOut(range?.to);
          }}
          bookedDates={bookedDates}
        />

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
              {Number(room.pricePerNight).toLocaleString()} × {nights} คืน
            </span>
            <span>฿{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100">
            <span>รวมทั้งหมด</span>
            <span className="text-lg">฿{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

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
