"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  Loader2,
  Building2,
  CreditCard,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MyBooking, PaymentStatus } from "@/types";
import { format, parseISO } from "date-fns";

const REASONS = [
  "เปลี่ยนแผนการเดินทาง",
  "เหตุฉุกเฉิน",
  "จองผิดวันที่",
  "หาที่พักอื่นได้",
  "อื่นๆ",
] as const;

const THAI_BANKS = [
  "กสิกรไทย",
  "กรุงไทย",
  "กรุงเทพ",
  "กรุงศรีอยุธยา",
  "ไทยพาณิชย์",
  "ทหารไทยธนชาต",
  "ออมสิน",
  "เพื่อการเกษตรและสหกรณ์การเกษตร",
] as const;

const NEEDS_BANK_INFO: PaymentStatus[] = ["WAITING_REVIEW", "APPROVED"];

// ─── Schema — field ทุกตัวเป็น optional ไว้ก่อน ─────────────────────────────
// แล้วค่อย validate ใน superRefine ตาม needsBankInfo
const schema = z.object({
  reason: z.enum(REASONS, { error: "กรุณาเลือกเหตุผล" }),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAccountName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export type CancelPayload = z.infer<typeof schema>;

type Props = {
  booking: MyBooking;
  onClose: () => void;
  onConfirm: (id: string, payload: CancelPayload) => Promise<void>;
};

function getRefundPolicy(checkInDate: string) {
  const hoursLeft = (new Date(checkInDate).getTime() - Date.now()) / 3600000;
  if (hoursLeft >= 48) return { percent: 100, label: "คืนเงิน 100%" };
  if (hoursLeft >= 0) return { percent: 50, label: "คืนเงิน 50%" };
  return { percent: 0, label: "ไม่คืนเงิน" };
}

export default function CancelModal({ booking, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const refund = getRefundPolicy(booking.checkInDate);
  const totalAmount = Number(booking.totalAmount);
  const refundAmount = Math.floor((totalAmount * refund.percent) / 100);

  // ต้องกรอกบัญชีเมื่อ: มี payment + สถานะต้องคืนเงิน + ยังได้รับเงินคืน
  const needsBankInfo =
    !!booking.payment &&
    NEEDS_BANK_INFO.includes(booking.payment.status) &&
    refund.percent > 0;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const selectedReason = watch("reason");

  const bankName = watch("bankName");
  const bankAccount = watch("bankAccount");
  const bankAccountName = watch("bankAccountName");

  const isBankValid =
    !needsBankInfo || (bankName && bankAccount && bankAccountName);

  // validate บัญชีธนาคารก่อน submit ถ้า needsBankInfo
  const onSubmit = async (data: FormValues) => {
    if (needsBankInfo) {
      let hasError = false;
      if (!data.bankName) {
        setError("bankName", { message: "กรุณาเลือกธนาคาร" });
        hasError = true;
      }
      if (!data.bankAccount) {
        setError("bankAccount", { message: "กรุณากรอกเลขบัญชี" });
        hasError = true;
      }
      if (!data.bankAccountName) {
        setError("bankAccountName", { message: "กรุณากรอกชื่อบัญชี" });
        hasError = true;
      }
      if (hasError) return;
    }

    setLoading(true);
    await onConfirm(booking.id, data);
    setLoading(false);
    onClose();
  };

  const checkInDate = format(parseISO(booking.checkInDate), "dd/MM/yyyy");
  const checkOutDate = format(parseISO(booking.checkOutDate), "dd/MM/yyyy");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-semibold text-stone-900">ยืนยันการยกเลิก</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 flex-1">
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

          {/* Refund policy */}
          {booking.payment && (
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
                  ? `คืน ฿${refundAmount.toLocaleString()} จาก ฿${totalAmount.toLocaleString()}`
                  : "เกินระยะเวลาคืนเงินแล้ว"}
              </p>
            </div>
          )}

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
                    selectedReason === r
                      ? "border-stone-900 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={r}
                    {...register("reason")}
                    className="accent-stone-900"
                  />
                  {r}
                </label>
              ))}
            </div>
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Bank info */}
          {needsBankInfo && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-stone-200" />
                <p className="text-xs font-medium text-stone-500 shrink-0">
                  ข้อมูลบัญชีสำหรับรับเงินคืน
                </p>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <p className="text-xs text-stone-400 -mt-2">
                ระบุบัญชีที่ต้องการรับเงินคืน ฿{refundAmount.toLocaleString()}
              </p>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> ธนาคาร{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("bankName")}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 ${errors.bankName ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                >
                  <option value="">เลือกธนาคาร</option>
                  {THAI_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.bankName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> เลขบัญชี{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="000-0-00000-0"
                  {...register("bankAccount")}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 ${errors.bankAccount ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                />
                {errors.bankAccount && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bankAccount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> ชื่อบัญชี{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล ตามหน้าบัญชี"
                  {...register("bankAccountName")}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 ${errors.bankAccountName ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                />
                {errors.bankAccountName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bankAccountName.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50 rounded-b-2xl sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
          >
            ไม่ยกเลิก
          </button>
          <button
            type="submit"
            disabled={!isValid || !isBankValid || loading}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "ยืนยันยกเลิก"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
