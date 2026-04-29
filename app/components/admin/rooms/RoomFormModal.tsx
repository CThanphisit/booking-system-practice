"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, Upload, Star, Loader2 } from "lucide-react";
import { Room, RoomTypeName, RoomStatus } from "@/types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const roomSchema = z.object({
  roomNumber: z.string().min(1, "กรุณาระบุหมายเลขห้อง"),
  type: z.string(),
  floor: z.number().min(1, "ชั้นต้องมากกว่า 0"),
  maxOccupancy: z.number().min(1, "จำนวนคนต้องอย่างน้อย 1"),
  pricePerNight: z.number().min(1, "ราคาต้องมากกว่า 0"),
  status: z.string(),
  // amenities: z.array(z.string()),
  description: z.string(),
  images: z.array(z.string()),
});

// ดึง Type ออกมาจาก Schema เพื่อใช้ใน Form
export type RoomFormValues = z.infer<typeof roomSchema>;

type Props = {
  open: boolean;
  room?: Room | null;
  onClose: () => void;
  onSave: (values: RoomFormValues) => void;
};

const roomTypes: RoomTypeName[] = ["Standard", "Deluxe", "Suite", "Family"];
const roomStatuses: { value: RoomStatus; label: string }[] = [
  { value: "AVAILABLE", label: "ว่าง" },
  { value: "MAINTENANCE", label: "ซ่อมบำรุง" },
  { value: "INACTIVE", label: "ปิดใช้งาน" },
];
const defaultAmenities = [
  "Wi-Fi",
  "TV",
  "Air Conditioning",
  "Hot Water",
  "Mini Bar",
  "Bathtub",
  "Living Room",
  "Kitchen",
  "Bunk Bed",
];

// ─── Image Manager ────────────────────────────────────────────────────────────
function ImageManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // ตรวจว่า URL เป็น path local หรือ external
  const resolveUrl = (url: string) => url;

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError("");

    const validFiles = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) {
        setUploadError("รับเฉพาะไฟล์รูปภาพ");
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        setUploadError("ขนาดไฟล์เกิน 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    setUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/room/upload-image`,
          { method: "POST", credentials: "include", body: formData },
        );
        if (!res.ok) throw new Error("Upload ไม่สำเร็จ");
        const data = await res.json();
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // ย้ายรูปที่ index ขึ้นไปเป็นรูปแรก (รูปหลัก)
  const handleSetMain = (index: number) => {
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm text-gray-700">
          รูปภาพห้อง
          <span className="text-gray-400 font-normal ml-1">
            ({images.length} รูป)
          </span>
        </label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "กำลัง upload..." : "อัพโหลดรูป"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* รูปภาพที่มีอยู่ */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative group aspect-video rounded-lg overflow-hidden border bg-gray-50"
            >
              <img
                src={resolveUrl(url)}
                alt={`รูป ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/200x120/f3f4f6/9ca3af?text=Error";
                }}
              />

              {/* badge รูปหลัก */}
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  หลัก
                </span>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* ตั้งเป็นรูปหลัก */}
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(i)}
                    title="ตั้งเป็นรูปหลัก"
                    className="w-7 h-7 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-white" />
                  </button>
                )}

                {/* ลบ */}
                <button
                  type="button"
                  onClick={() => handleDelete(i)}
                  title="ลบรูป"
                  className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}

          {/* ช่องเพิ่มรูปใน grid */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span className="text-xs">เพิ่มรูป</span>
          </button>
        </div>
      ) : (
        /* Dropzone เมื่อยังไม่มีรูป */
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors group"
        >
          <Upload className="w-8 h-8 text-gray-300 group-hover:text-indigo-400 transition-colors" />
          <p className="text-sm text-gray-500">คลิกเพื่ออัพโหลดรูปภาพ</p>
          <p className="text-xs text-gray-400">
            PNG, JPG · ไม่เกิน 5MB ต่อไฟล์
          </p>
        </div>
      )}

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

      {images.length > 0 && (
        <p className="text-xs text-gray-400">
          hover ที่รูปเพื่อลบ · กด ★ เพื่อตั้งเป็นรูปหลัก
        </p>
      )}
    </div>
  );
}

// Main Component --------------------------------------------------------------
export default function RoomFormModal({ open, room, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: room?.roomNumber || "",
      floor: room?.floor || 1,
      type: room?.type || "Standard",
      maxOccupancy: room?.maxOccupancy || 2,
      pricePerNight: room?.pricePerNight || 1200,
      status: room?.status || "AVAILABLE",
      description: room?.description || "",
      images: room?.images || [],
    },
  });

  const images = watch("images");

  // Reset form เมื่อ room หรือสถานะ open เปลี่ยนแปลง
  useEffect(() => {
    if (open) {
      if (room) {
        reset({
          roomNumber: room.roomNumber,
          floor: room.floor,
          type: room.type,
          maxOccupancy: room.maxOccupancy,
          pricePerNight: room.pricePerNight,
          status: room.status,
          // amenities: room.amenities,
          description: room.description,
          images: room.images ?? [],
        });
      } else {
        reset({
          roomNumber: "",
          floor: 1,
          type: "Standard",
          maxOccupancy: 2,
          pricePerNight: 1200,
          status: "AVAILABLE",
          // amenities: ["Wi-Fi", "Air Conditioning"],
          description: "",
          images: [],
        });
      }
    }
  }, [room, open, reset]);

  if (!open) return null;

  const onSubmit = async (data: RoomFormValues) => {
    await onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-900">
            {room ? "แก้ไขข้อมูลห้อง" : "เพิ่มห้องใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 rounded-md p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Row 1: roomNumber + floor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                หมายเลขห้อง <span className="text-red-500">*</span>
              </label>
              <input
                {...register("roomNumber")}
                className={`w-full border rounded-md px-3 py-2 text-sm ${errors.roomNumber ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.roomNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.roomNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">ชั้น</label>
              <input
                type="number"
                {...register("floor", { valueAsNumber: true })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: type + status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                ประเภทห้อง
              </label>
              <select
                {...register("type")}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {roomTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                สถานะ
              </label>
              <select
                {...register("status")}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {roomStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: price + maxOccupancy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                ราคา/คืน (฿) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("pricePerNight", { valueAsNumber: true })}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.pricePerNight ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.pricePerNight && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pricePerNight.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                จำนวนผู้เข้าพักสูงสุด
              </label>
              <input
                type="number"
                {...register("maxOccupancy", { valueAsNumber: true })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              คำอธิบาย <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="อธิบายห้องพัก..."
              {...register("description")}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.description ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Manager */}
          <ImageManager
            images={images}
            onChange={(imgs) => setValue("images", imgs, { shouldDirty: true })}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-100 text-gray-600"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {room ? "บันทึกการแก้ไข" : "เพิ่มห้อง"}
          </button>
        </div>
      </form>
    </div>
  );
}
