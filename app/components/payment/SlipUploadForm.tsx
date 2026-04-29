"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, CheckCircle, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  bookingId: string;
  totalAmount: number;
};

export default function SlipUploadForm({ bookingId, totalAmount }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (selected: File | null) => {
    if (!selected) return;

    // validate
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

  // drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0] ?? null);
  };

  const handleSubmit = async () => {
    if (!file) return setError("กรุณาเลือกรูปสลิป");

    setLoading(true);
    setError("");

    try {
      // ใช้ FormData ส่งไป Backend
      const formData = new FormData();
      formData.append("slip", file); // ชื่อ field ต้องตรงกับ Backend
      formData.append("bookingId", bookingId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/upload-slip`,
        {
          method: "POST",
          credentials: "include", // ส่ง cookie ไปด้วย
          body: formData,
          // ❌ อย่าใส่ Content-Type เอง
          // fetch จะ set boundary ให้อัตโนมัติ
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "เกิดข้อผิดพลาด");
      }

      router.push(`/booking/${bookingId}/confirmation`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-stone-900 mb-1">แนบสลิปการโอนเงิน</h3>
        <p className="text-sm text-stone-500">
          ยอดที่ต้องโอน{" "}
          <span className="font-bold text-stone-900">
            ฿{totalAmount.toLocaleString()}
          </span>
        </p>
      </div>

      {/* Dropzone */}
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
            คลิกเพื่อเลือกรูป หรือลากมาวางตรงนี้
          </p>
          <p className="text-xs text-stone-400 mt-1">
            PNG, JPG, JPEG · ไม่เกิน 5MB
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
        /* Preview */
        <div className="relative">
          <img
            src={preview}
            alt="slip preview"
            className="w-full max-h-72 object-contain rounded-xl border border-stone-200 bg-stone-50"
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
          <div className="flex items-center gap-2 mt-2 text-sm text-stone-600">
            <ImageIcon className="w-4 h-4" />
            {file?.name}
            <span className="text-stone-400 text-xs">
              ({(file!.size / 1024).toFixed(0)} KB)
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full py-3 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            กำลังส่ง...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            ส่งหลักฐานการโอน
          </>
        )}
      </button>
    </div>
  );
}
