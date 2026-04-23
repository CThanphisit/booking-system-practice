"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MyBooking, BookingStatus } from "@/types";
import BookingCard from "./BookingCard";
import BookingStats from "./BookingStats";
import CancelModal from "./CancelModal";

type Tab = "ALL" | BookingStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "ALL", label: "ทั้งหมด" },
  { value: "PENDING", label: "รอยืนยัน" },
  { value: "CONFIRMED", label: "ยืนยันแล้ว" },
  { value: "CHECKED_IN", label: "เช็คอินแล้ว" },
  { value: "COMPLETED", label: "เสร็จสิ้น" },
  { value: "CANCELLED", label: "ยกเลิก" },
];

type Props = { initialBookings: MyBooking[] };

export default function MyBookingsClient({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<MyBooking[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<Tab>("ALL");
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState<MyBooking | null>(null);
  const [toast, setToast] = useState("");

  // ─── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return bookings
      .filter((b) => activeTab === "ALL" || b.status === activeTab)
      .filter((b) => {
        const q = search.toLowerCase();
        return (
          b.code.toLowerCase().includes(q) ||
          b.room.roomNumber.includes(q) ||
          b.room.type.toLowerCase().includes(q)
        );
      });
  }, [bookings, activeTab, search]);

  // ─── Tab count ─────────────────────────────────────────────────────────────
  const countFor = (tab: Tab) =>
    tab === "ALL"
      ? bookings.length
      : bookings.filter((b) => b.status === tab).length;

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`คัดลอก ${code} แล้ว`);
  };

  const handleCancel = async (id: string, _reason: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/cancel/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "CANCELLED" }),
          credentials: "include",
        },
      );

      if (res.ok) {
        showToast("ยกเลิกการจองเรียบร้อยแล้ว");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <BookingStats bookings={bookings} />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="ค้นหา booking code, หมายเลขห้อง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          />
        </div>
        <button className="flex items-center gap-2 text-sm border border-stone-200 rounded-xl px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-600 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          เรียงตามวันที่
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const cnt = countFor(tab.value);
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? "border-stone-900 text-stone-900 font-medium"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
              {cnt > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Booking list */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={setCancelTarget}
              onCopyCode={handleCopyCode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-stone-300" />
          </div>
          <p className="text-stone-500 font-medium">ไม่พบการจอง</p>
          <p className="text-stone-400 text-sm mt-1">
            {search ? "ลองเปลี่ยนคำค้นหา" : "ยังไม่มีการจองในหมวดนี้"}
          </p>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancel}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
