"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BookingFormValues } from "./BookingFormClient";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

type Props = {
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

type FieldConfig = {
  name: keyof BookingFormValues;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  required?: boolean;
};

const fields: FieldConfig[] = [
  {
    name: "firstName",
    label: "ชื่อ",
    placeholder: "ชื่อจริง",
    icon: <User className="w-4 h-4" />,
    required: true,
  },
  {
    name: "lastName",
    label: "นามสกุล",
    placeholder: "นามสกุล",
    icon: <User className="w-4 h-4" />,
    required: true,
  },
  {
    name: "email",
    label: "อีเมล",
    placeholder: "example@email.com",
    type: "email",
    icon: <Mail className="w-4 h-4" />,
    required: true,
  },
  {
    name: "phone",
    label: "เบอร์โทรศัพท์",
    placeholder: "08x-xxx-xxxx",
    type: "tel",
    icon: <Phone className="w-4 h-4" />,
    required: true,
  },
];

export default function GuestForm({ register, errors, defaultFirstName, defaultLastName, defaultEmail, defaultPhone }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-900 mb-5">ข้อมูลผู้เข้าพัก</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                {field.icon}
              </span>
              <input
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                {...register(field.name)}
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors[field.name]
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-stone-200 focus:ring-stone-200 bg-white"
                }`}
              />
            </div>
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-500">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-stone-400" />
          หมายเหตุพิเศษ
          <span className="text-stone-400 font-normal">(ถ้ามี)</span>
        </label>
        <textarea
          rows={3}
          placeholder="เช่น ต้องการห้องชั้นสูง, ขอเพิ่มเตียง, แพ้อาหาร..."
          {...register("note")}
          className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none bg-white"
        />
      </div>
    </section>
  );
}
