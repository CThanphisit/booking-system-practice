"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Room, RoomTypeName, RoomStatus } from "@/types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// --- Validation Schema ---
const roomSchema = z.object({
  roomNumber: z.string().min(1, "กรุณาระบุหมายเลขห้อง"),
  type: z.string(),
  floor: z.coerce.number().min(1, "ชั้นต้องมากกว่า 0"),
  maxOccupancy: z.coerce.number().min(1, "จำนวนคนต้องอย่างน้อย 1"),
  pricePerNight: z.coerce.number().min(1, "ราคาต้องมากกว่า 0"),
  status: z.string(),
  // amenities: z.array(z.string()),
  description: z.string().min(1, "กรุณาระบุคำอธิบาย"),
  images: z.array(z.string()),
});

// ดึง Type ออกมาจาก Schema เพื่อใช้ใน Form
type RoomFormValues = z.infer<typeof roomSchema>;

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

export default function RoomFormModal({ open, room, onClose, onSave }: Props) {
  // const [form, setForm] = useState<RoomFormValues>(emptyForm);
  // const [errors, setErrors] = useState<Partial<Record<keyof RoomFormValues, string>>>({});

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
      roomNumber: "",
      floor: 1,
      type: "Standard",
      maxOccupancy: 2,
      pricePerNight: 1200,
      status: "AVAILABLE",
      // amenities: ["Wi-Fi", "Air Conditioning"],
      description: "",
      images: [],
    },
  });

  // const selectedAmenities = watch("amenities");

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
          images: [],
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

  const onSubmit = (data: RoomFormValues) => {
    console.log("dataModal", data);
    onSave(data);
    onClose();
  };

  // const toggleAmenity = (item: string) => {
  //   const current = selectedAmenities || [];
  //   const next = current.includes(item)
  //     ? current.filter((a) => a !== item)
  //     : [...current, item];
  //   setValue("amenities", next);
  // };

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
                {...register("floor")}
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
                {...register("pricePerNight")}
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
                {...register("maxOccupancy")}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Amenities */}
          {/* <div>
            <label className="block text-sm text-gray-700 mb-2">
              สิ่งอำนวยความสะดวก
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultAmenities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    selectedAmenities?.includes(item)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div> */}

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
