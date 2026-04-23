"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { MyBooking } from "@/types";
import { format, parseISO } from "date-fns";

type Props = {
  booking: MyBooking;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => Promise<void>;
};

const REASONS = [
  "เปลี่ยนแผนการเดินทาง",
  "เหตุฉุกเฉิน",
  "จองผิดวันที่",
  "หาที่พักอื่นได้",
  "อื่นๆ",
];

// คำนวณ refund policy ตามเวลาที่เหลือก่อน check-in
function getRefundPolicy(checkInDate: string) {
  const hoursLeft =
    (new Date(checkInDate).getTime() - Date.now()) / 1000 / 3600;
  if (hoursLeft >= 48) return { percent: 100, label: "คืนเงิน 100%" };
  if (hoursLeft >= 0) return { percent: 50, label: "คืนเงิน 50%" };
  return { percent: 0, label: "ไม่คืนเงิน" };
}

export default function CancelModal({ booking, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const refund = getRefundPolicy(booking.checkInDate);
  const refundAmount = Math.floor((booking.totalAmount * refund.percent) / 100);

  const handleConfirm = async () => {
    if (!reason) return;
    setLoading(true);
    await onConfirm(booking.id, reason);
    setLoading(false);
    onClose();
  };

  const checkIn = parseISO(booking.checkInDate);
  const checkOut = parseISO(booking.checkOutDate);

  const checkInDate = format(checkIn, "dd/MM/yyyy");
  const checkOutDate = format(checkOut, "dd/MM/yyyy");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-semibold text-stone-900">ยืนยันการยกเลิก</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Booking summary */}
          <div className="bg-stone-50 rounded-xl px-4 py-3 text-sm space-y-1">
            <p className="font-medium text-stone-900">
              ห้อง {booking.room.roomNumber} · {booking.room.type}
            </p>
            <p className="text-stone-500 text-xs">
              {checkInDate} → {checkOutDate} · {booking.nights} คืน
            </p>
            <p className="font-mono text-xs text-stone-400">{booking.code}</p>
          </div>

          {/* Refund info */}
          <div
            className={`rounded-xl px-4 py-3 text-sm border ${
              refund.percent === 100
                ? "bg-emerald-50 border-emerald-100"
                : refund.percent === 50
                  ? "bg-amber-50 border-amber-100"
                  : "bg-red-50 border-red-100"
            }`}
          >
            <p
              className={`font-medium mb-0.5 ${
                refund.percent === 100
                  ? "text-emerald-800"
                  : refund.percent === 50
                    ? "text-amber-800"
                    : "text-red-700"
              }`}
            >
              {refund.label}
            </p>
            <p
              className={`text-xs ${
                refund.percent === 100
                  ? "text-emerald-600"
                  : refund.percent === 50
                    ? "text-amber-600"
                    : "text-red-500"
              }`}
            >
              {refund.percent > 0
                ? `คืน ฿${refundAmount.toLocaleString()} จาก ฿${booking.totalAmount.toLocaleString()}`
                : "เกินระยะเวลาคืนเงินแล้ว"}
            </p>
          </div>

          {/* Reason */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">
              เหตุผลการยกเลิก <span className="text-red-500">*</span>
            </p>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-sm ${
                    reason === r
                      ? "border-stone-900 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-stone-900"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
          >
            ไม่ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason || loading}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "ยืนยันยกเลิก"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
