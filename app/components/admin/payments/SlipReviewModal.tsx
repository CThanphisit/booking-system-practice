"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Loader2, ZoomIn } from "lucide-react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

export type PaymentDetail = {
  id: string;
  amount: string;
  slipUrl: string;
  status: string;
  createdAt: string;
  booking: {
    code: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guestCount: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      phoneNumber: string;
    };
    room: { roomNumber: string; type: string };
  };
};

type Props = {
  payment: PaymentDetail;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, note: string) => Promise<void>;
};

export default function SlipReviewModal({ payment, onClose, onApprove, onReject }: Props) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [zoomSlip, setZoomSlip] = useState(false);

  const { booking } = payment;
  const isWaiting = payment.status === "WAITING_REVIEW";

  const handleApprove = async () => {
    setLoading("approve");
    await onApprove(payment.id);
    setLoading(null);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return;
    setLoading("reject");
    await onReject(payment.id, rejectNote);
    setLoading(null);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div>
              <h3 className="font-semibold text-gray-900">ตรวจสอบสลิปการโอนเงิน</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{booking.code}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 divide-x divide-gray-100">

              {/* Left: สลิป */}
              <div className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">สลิปการโอนเงิน</p>
                <div
                  className="relative cursor-zoom-in group"
                  onClick={() => setZoomSlip(true)}
                >
                  <img
                    src={payment.slipUrl}
                    alt="สลิป"
                    className="w-full max-h-72 object-contain rounded-xl border border-gray-200 bg-gray-50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">คลิกเพื่อดูรูปขนาดเต็ม</p>

                <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ยอดที่ต้องชำระ</span>
                    <span className="font-semibold text-gray-900">฿{Number(payment.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Upload เมื่อ</span>
                    <span>{format(parseISO(payment.createdAt), "d MMM yyyy HH:mm", { locale: th })}</span>
                  </div>
                </div>
              </div>

              {/* Right: ข้อมูลการจอง */}
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">ข้อมูลผู้จอง</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-gray-900">{booking.user.first_name} {booking.user.last_name}</p>
                    <p className="text-gray-500">{booking.user.email}</p>
                    <p className="text-gray-500">{booking.user.phoneNumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">ข้อมูลการจอง</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-700">ห้อง {booking.room.roomNumber} · {booking.room.type}</p>
                    <p className="text-gray-500">
                      {format(parseISO(booking.checkInDate), "d MMM", { locale: th })} →{" "}
                      {format(parseISO(booking.checkOutDate), "d MMM yyyy", { locale: th })}
                    </p>
                    <p className="text-gray-500">{booking.nights} คืน · {booking.guestCount} คน</p>
                  </div>
                </div>

                {/* Reject form */}
                {showRejectForm && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">เหตุผลการปฏิเสธ</p>
                    <textarea
                      rows={3}
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="เช่น ยอดโอนไม่ตรง, สลิปไม่ชัดเจน..."
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {isWaiting && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
              {!showRejectForm ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5 rounded-xl transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> ปฏิเสธ
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading === "approve"}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white text-sm py-2.5 rounded-xl transition-colors"
                  >
                    {loading === "approve"
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><CheckCircle className="w-4 h-4" /> อนุมัติ</>
                    }
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowRejectForm(false); setRejectNote(""); }}
                    className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectNote.trim() || loading === "reject"}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm py-2.5 rounded-xl transition-colors"
                  >
                    {loading === "reject"
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : "ยืนยันปฏิเสธ"
                    }
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Zoom modal */}
      {zoomSlip && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomSlip(false)}
        >
          <img
            src={payment.slipUrl}
            alt="สลิปขนาดเต็ม"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}
    </>
  );
}
