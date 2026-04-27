"use client";

import { useState } from "react";
import { Booking, MyBooking } from "@/types";
import BookingDetailSummary from "./BookingDetailSummary";

export default function BookingDetailSummaryClient({
  booking,
}: {
  booking: MyBooking;
}) {
  const [toast, setToast] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.code);
    setToast("คัดลอก booking code แล้ว");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <>
      <BookingDetailSummary booking={booking} onCopy={handleCopy} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
