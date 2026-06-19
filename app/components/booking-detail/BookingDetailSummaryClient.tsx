"use client";

import { toast } from "react-toastify";
import { MyBooking } from "@/types";
import BookingDetailSummary from "./BookingDetailSummary";

export default function BookingDetailSummaryClient({
  booking,
}: {
  booking: MyBooking;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(booking.code);
    toast.success("คัดลอก booking code แล้ว");
  };

  return <BookingDetailSummary booking={booking} onCopy={handleCopy} />;
}
