"use client";

import { Booking, MyBooking } from "@/types";
import { PaymentStatusBadge } from "./BookingDetailStatus";
import {
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { booking: MyBooking };

function UploadSlipModal({
  bookingId,
  onClose,
  onSuccess,
}: {
  bookingId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (selected: File | null) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      return setError("รับเฉพาะไฟล์รูปภาพเท่านั้น");
    }
    if (selected.size > 5 * 1024 * 1024) {
      return setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
    }
    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0] ?? null);
  };

  const handleSubmit = async () => {
    if (!file) return setError("กรุณาเลือกรูปสลิป");
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("slip", file);
      formData.append("bookingId", bookingId);

      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}payment/upload-slip`,
      //   {
      //     method: "POST",
      //     credentials: "include",
      //     body: formData,
      //   },
      // );
      // const res = await fetch(`/api/proxy/payment/upload-slip`, {
      // const res = await fetch(`http://localhost:3001/payment/upload-slip`, {
      const res = await fetch(
        `https://backend-booking-system-practice.onrender.com/payment/upload-slip`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "เกิดข้อผิดพลาด");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-stone-900">Upload สลิปใหม่</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Dropzone / Preview */}
          {!preview ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-xl p-8 text-center cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 bg-stone-100 group-hover:bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                <Upload className="w-5 h-5 text-stone-500" />
              </div>
              <p className="text-sm font-medium text-stone-700">
                คลิกหรือลากรูปมาวาง
              </p>
              <p className="text-xs text-stone-400 mt-1">
                PNG, JPG · ไม่เกิน 5MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-56 object-contain rounded-xl border border-stone-200 bg-stone-50"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview("");
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full border border-stone-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-stone-500" />
              </button>
              <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                <ImageIcon className="w-3.5 h-3.5" />
                {file?.name}
                <span className="text-stone-400">
                  ({((file?.size ?? 0) / 1024).toFixed(0)} KB)
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="flex-1 py-2.5 text-sm bg-stone-900 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> กำลังส่ง...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> ส่งสลิป
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function BookingDetailPayment({ booking }: Props) {
  const { payment, status: bookingStatus, totalAmount, id } = booking;

  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadSuccess = () => {
    router.refresh();
  };

  // ยังไม่มี payment — รอ user upload
  if (!payment) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
            การชำระเงิน
          </p>
        </div>
        <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-stone-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-700">
              ยังไม่ได้ชำระเงิน
            </p>
            <p className="text-xs text-stone-400 mt-1">
              กรุณา scan QR และ upload สลิปเพื่อยืนยัน
            </p>
          </div>
          {bookingStatus === "PENDING" && (
            <Link
              href={`/booking/${id}/payment`}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              <Upload className="w-4 h-4" />
              ไปหน้าชำระเงิน
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
            การชำระเงิน
          </p>
          <PaymentStatusBadge status={payment.status} />
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* ยอดเงิน */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500">ยอดที่ชำระ</span>
            <span className="font-semibold text-stone-900">
              ฿{Number(payment.amount).toLocaleString()}
            </span>
          </div>

          {/* วันที่ upload */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500">Upload สลิปเมื่อ</span>
            <span className="text-stone-700">
              {format(parseISO(payment.updatedAt), "d MMM yyyy HH:mm", {
                locale: th,
              })}
            </span>
          </div>

          {/* รูปสลิป */}
          <div>
            <p className="text-xs text-stone-400 mb-2">สลิปการโอนเงิน</p>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}${payment.slipUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`${payment.slipUrl}`}
                alt="สลิปการโอนเงิน"
                className="w-full max-h-64 object-contain rounded-xl border border-stone-200 bg-stone-50 hover:opacity-90 transition-opacity cursor-zoom-in"
              />
            </a>
            <p className="text-xs text-stone-400 text-center mt-1">
              คลิกเพื่อดูรูปขนาดเต็ม
            </p>
          </div>

          {/* สถานะ WAITING_REVIEW */}
          {payment.status === "WAITING_REVIEW" && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  รอ Admin ตรวจสอบ
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  ปกติใช้เวลาไม่เกิน 24 ชั่วโมง
                </p>
              </div>
            </div>
          )}

          {/* สถานะ APPROVED */}
          {payment.status === "APPROVED" && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  ยืนยันการชำระเงินแล้ว
                </p>
                {payment.reviewedAt && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    อนุมัติเมื่อ{" "}
                    {format(parseISO(payment.reviewedAt), "d MMM yyyy HH:mm", {
                      locale: th,
                    })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* สถานะ REJECTED */}
          {payment.status === "REJECTED" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    สลิปถูกปฏิเสธ
                  </p>
                  {payment.note && (
                    <p className="text-xs text-red-500 mt-0.5">
                      เหตุผล: {payment.note}
                    </p>
                  )}
                </div>
              </div>

              {/* upload ใหม่ */}
              {bookingStatus === "PENDING" && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center justify-center gap-2 w-full border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload สลิปใหม่
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadSlipModal
          bookingId={booking.id}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
}
