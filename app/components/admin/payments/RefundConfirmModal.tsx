"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  Building2,
  CreditCard,
  User,
  BanknoteIcon,
} from "lucide-react";
import { PaymentDetail } from "./SlipReviewModal";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

type Props = {
  payment: PaymentDetail & {
    refundAmount: string | null;
    refundBankName: string | null;
    refundBankAccount: string | null;
    refundBankAccountName: string | null;
    refundNote: string | null;
  };
  onClose: () => void;
  onConfirm: (id: string, note: string) => Promise<void>;
};

export default function RefundConfirmModal({
  payment,
  onClose,
  onConfirm,
}: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const { booking } = payment;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(payment.id, note);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">ยืนยันการคืนเงิน</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {booking.code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* ยอดคืนเงิน */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-700">
              <BanknoteIcon className="w-4 h-4" />
              <span className="text-sm font-medium">ยอดที่ต้องคืน</span>
            </div>
            <span className="text-lg font-bold text-indigo-800">
              ฿
              {payment.refundAmount
                ? Number(payment.refundAmount).toLocaleString()
                : Number(payment.amount).toLocaleString()}
            </span>
          </div>

          {/* ข้อมูลบัญชีรับเงินคืน */}
          <div className="bg-gray-50 rounded-xl px-4 py-4 space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              บัญชีรับเงินคืน
            </p>
            {payment.refundBankName ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {payment.refundBankName}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  {payment.refundBankAccount}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  {payment.refundBankAccountName}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                ผู้ใช้ไม่ได้ระบุข้อมูลบัญชี
              </p>
            )}
          </div>

          {/* ข้อมูลการจอง */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              ห้อง {booking.room.roomNumber} · {booking.room.type}
            </p>
            <p className="text-gray-400">
              {format(parseISO(booking.checkInDate), "d MMM yyyy", {
                locale: th,
              })}{" "}
              →{" "}
              {format(parseISO(booking.checkOutDate), "d MMM yyyy", {
                locale: th,
              })}
            </p>
            {payment.refundNote && (
              <p className="text-gray-400 text-xs mt-1">
                เหตุผล: {payment.refundNote}
              </p>
            )}
          </div>

          {/* หมายเหตุ admin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              หมายเหตุ (ไม่บังคับ)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น โอนคืนเรียบร้อย ref: XXXXXXXX"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white text-sm py-2.5 rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "ยืนยันคืนเงิน"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
