"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Booking, MyBooking } from "@/types";

type Props = { booking: MyBooking };

const CANCEL_REASONS = [
  "เปลี่ยนแผนการเดินทาง",
  "เหตุฉุกเฉิน",
  "จองผิดวันที่",
  "หาที่พักอื่นได้",
  "อื่นๆ",
];

function getRefundPolicy(checkInDate: string) {
  const hoursLeft = (new Date(checkInDate).getTime() - Date.now()) / 3600000;
  if (hoursLeft >= 48) return { percent: 100, label: "คืนเงิน 100%" };
  if (hoursLeft >= 0) return { percent: 50, label: "คืนเงิน 50%" };
  return { percent: 0, label: "ไม่คืนเงิน" };
}

export default function BookingDetailActions({ booking }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  if (!canCancel) return null;

  const refund = getRefundPolicy(booking.checkInDate);
  const refundAmount = Math.floor(
    (Number(booking.totalAmount) * refund.percent) / 100,
  );

  const handleCancel = async () => {
    if (!reason) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}booking/${booking.id}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "เกิดข้อผิดพลาด");
      }

      setShowModal(false);
      router.refresh(); // refresh server component เพื่อดึงข้อมูลใหม่
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-stone-200 rounded-2xl px-6 py-5">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">
          การดำเนินการ
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
          ยกเลิกการจอง
        </button>
      </div>

      {/* Cancel Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <h3 className="font-semibold text-stone-900">ยืนยันการยกเลิก</h3>
              <button
                onClick={() => setShowModal(false)}
                className="ml-auto text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Booking summary */}
              <div className="bg-stone-50 rounded-xl px-4 py-3 text-sm">
                <p className="font-medium text-stone-900">
                  ห้อง {booking.room?.roomNumber} · {booking.room?.type}
                </p>
                <p className="text-stone-500 text-xs mt-0.5 font-mono">
                  {booking.code}
                </p>
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
                  className={`font-medium ${refund.percent === 100 ? "text-emerald-800" : refund.percent === 50 ? "text-amber-800" : "text-red-700"}`}
                >
                  {refund.label}
                </p>
                <p
                  className={`text-xs mt-0.5 ${refund.percent === 100 ? "text-emerald-600" : refund.percent === 50 ? "text-amber-600" : "text-red-500"}`}
                >
                  {refund.percent > 0
                    ? `คืน ฿${refundAmount.toLocaleString()} จาก ฿${Number(booking.totalAmount).toLocaleString()}`
                    : "เกินระยะเวลาคืนเงินแล้ว"}
                </p>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-stone-700">
                  เหตุผล <span className="text-red-500">*</span>
                </p>
                {CANCEL_REASONS.map((r) => (
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

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
              >
                ไม่ยกเลิก
              </button>
              <button
                onClick={handleCancel}
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
      )}
    </>
  );
}
