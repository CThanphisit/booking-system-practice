"use client";

import {
  X,
  User,
  BedDouble,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Booking, BookingStatus } from "@/types";
import BookingStatusBadge from "./BookingStatusBadge";
import PaymentBadge from "./PaymentBadge";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

type Props = {
  booking: Booking | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onApprovePayment: (paymentId: string, adminId: string) => void;
  onRejectPayment: (paymentId: string, adminId: string, note: string) => void;
};

const ACTION_BUTTONS: {
  label: string;
  toStatus: BookingStatus;
  forStatuses: BookingStatus[];
  className: string;
}[] = [
  {
    label: "ยืนยันการจอง",
    toStatus: "CONFIRMED",
    forStatuses: ["PENDING"],
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    label: "เช็คอิน",
    toStatus: "CHECKED_IN",
    forStatuses: ["CONFIRMED"],
    className: "bg-indigo-600 text-white hover:bg-indigo-700",
  },
  {
    label: "เช็คเอาท์",
    toStatus: "COMPLETED",
    forStatuses: ["CHECKED_IN"],
    className: "bg-gray-700 text-white hover:bg-gray-800",
  },
  {
    label: "ยกเลิกการจอง",
    toStatus: "CANCELLED",
    forStatuses: ["PENDING", "CONFIRMED"],
    className: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  },
];

export default function BookingDetailModal({
  booking,
  onClose,
  onUpdateStatus,
  onApprovePayment,
  onRejectPayment,
}: Props) {
  const { user } = useAuth();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  if (!booking) return null;

  const nights = booking.nights;
  const pricePerNight = Math.round(+booking.totalAmount / nights);

  const handleReject = () => {
    if (!rejectNote.trim() || !booking.payment) return;
    onRejectPayment(booking.payment.id, user!.id, rejectNote);
    setShowRejectForm(false);
    setRejectNote("");
    onClose();
  };

  const formatDate = (date: string) => {
    const parseDate = parseISO(date);
    return format(parseDate, "dd/MM/yyyy");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-medium text-gray-900">
              รายละเอียดการจอง
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {booking.code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 rounded-md p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Status row */}
          <div className="flex items-center gap-3 flex-wrap">
            <BookingStatusBadge status={booking.status} />
            {/* <PaymentBadge status={booking.paymentStatus} /> */}
            <span className="text-xs text-gray-400 ml-auto">
              จองเมื่อ {formatDate(booking.createdAt)}
            </span>
          </div>

          {/* Customer info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              ข้อมูลผู้จอง
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              {booking.user.first_name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              {booking.user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              {booking.user.phoneNumber}
            </div>
          </div>

          {/* Room & dates */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              ข้อมูลการเข้าพัก
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <BedDouble className="w-4 h-4 text-gray-400 shrink-0" />
              ห้อง {booking.room.roomNumber} ({booking.room.type})
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              {formatDate(booking.checkInDate)} →{" "}
              {formatDate(booking.checkOutDate)}
              <span className="text-gray-400">({nights} คืน)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              {booking.guestCount} ท่าน
            </div>
          </div>

          {/* Price breakdown */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex justify-between px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
              <span>
                ฿{pricePerNight.toLocaleString()} × {nights} คืน
              </span>
              <span>฿{booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between px-4 py-3 font-medium text-gray-900 bg-gray-50">
              <span>ราคารวม</span>
              <span className="text-indigo-600">
                ฿{booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Note */}
          {booking.note && (
            <div className="flex gap-2 text-sm text-gray-600 bg-amber-50 rounded-lg p-4">
              <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>{booking.note}</p>
            </div>
          )}
        </div>

        {/* Payment */}
        {booking.payment && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium mb-3">หลักฐานการชำระเงิน</p>

            {/* รูปสลิป */}
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${booking.payment.slipUrl}`}
              alt="slip"
              className="w-full max-h-64 object-contain rounded border mb-3"
            />

            <p className="text-xs text-gray-500 mb-3">
              ยอด ฿{booking.payment.amount.toLocaleString()} · upload เมื่อ{" "}
              {formatDate(booking.payment.createdAt)}
            </p>

            {/* ✅ ปุ่ม Approve/Reject — เปิดแล้ว */}
            {booking.payment.status === "WAITING_REVIEW" && (
              <div className="space-y-2">
                {!showRejectForm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onApprovePayment(booking.payment!.id, user!.id);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      อนุมัติ
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 text-sm py-2 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      ปฏิเสธ
                    </button>
                  </div>
                ) : (
                  // Reject form
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      placeholder="ระบุเหตุผลการปฏิเสธ เช่น ยอดโอนไม่ตรง..."
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 text-sm border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={!rejectNote.trim()}
                        className="flex-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-lg py-1.5 transition-colors"
                      >
                        ยืนยันปฏิเสธ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* แสดงสถานะถ้าตรวจแล้ว */}
            {booking.payment.status === "APPROVED" && (
              <p className="text-sm text-emerald-600 font-medium">
                ✓ อนุมัติแล้ว
              </p>
            )}
            {booking.payment.status === "REJECTED" && (
              <div>
                <p className="text-sm text-red-600 font-medium">✗ ปฏิเสธแล้ว</p>
                <p className="text-xs text-gray-500">
                  เหตุผล: {booking.payment.note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        {/* <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-100 text-gray-600"
            >
              ปิด
            </button>
            {ACTION_BUTTONS.filter((a) =>
              a.forStatuses.includes(booking.status),
            ).map((action) => (
              <button
                key={action.toStatus}
                onClick={() => {
                  onUpdateStatus(booking.id, action.toStatus);
                  onClose();
                }}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${action.className}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div> */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-100 text-gray-600"
            >
              ปิด
            </button>
            {/* ✅ เพิ่มเงื่อนไขเช็ค payment ก่อน Confirm */}
            {ACTION_BUTTONS.filter((a) => {
              if (!a.forStatuses.includes(booking.status)) return false;
              if (a.toStatus === "CONFIRMED") {
                return booking.payment?.status === "APPROVED";
              }
              return true;
            }).map((action) => (
              <button
                key={action.toStatus}
                onClick={() => {
                  onUpdateStatus(booking.id, action.toStatus);
                  onClose();
                }}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${action.className}`}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* แจ้งเตือนถ้า PENDING แต่ยังไม่มี payment */}
          {booking.status === "PENDING" &&
            booking.payment?.status !== "APPROVED" && (
              <p className="text-xs text-amber-600 mt-2 text-right">
                {!booking.payment
                  ? "รอ user upload สลิปก่อนยืนยัน"
                  : booking.payment.status === "WAITING_REVIEW"
                    ? "กรุณาตรวจสลิปก่อนกดยืนยัน"
                    : "สลิปถูกปฏิเสธ รอ user upload ใหม่"}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
