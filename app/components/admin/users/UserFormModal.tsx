"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────
const baseFields = {
  email:       z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  first_name:  z.string().min(1, "กรุณากรอกชื่อ"),
  last_name:   z.string().min(1, "กรุณากรอกนามสกุล"),
  phoneNumber: z.string().min(9, "เบอร์โทรไม่ถูกต้อง"),
  role:        z.enum(["USER", "ADMIN"]),
};

// สร้างใหม่ → password บังคับ
const createSchema = z.object({
  ...baseFields,
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

// แก้ไข → password ไม่บังคับ (ถ้าไม่กรอก = ไม่เปลี่ยน)
const editSchema = z.object({
  ...baseFields,
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร").or(z.literal("")),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues   = z.infer<typeof editSchema>;
type FormValues   = CreateValues | EditValues;

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserFormData = {
  email: string;
  first_name: string;
  last_name: string;
  phoneNumber: string;
  role: "USER" | "ADMIN";
  password?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phoneNumber: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type Props = {
  open: boolean;
  user?: AdminUser | null; // null = create mode
  onClose: () => void;
  onSave: (data: UserFormData) => Promise<void>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserFormModal({ open, user, onClose, onSave }: Props) {
  const isEdit  = !!user;
  const schema  = isEdit ? editSchema : createSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onChange",
  });

  // โหลดข้อมูลเดิมตอนเปิด modal
  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? { ...user, password: "" }
          : { email: "", first_name: "", last_name: "", phoneNumber: "", role: "USER", password: "" }
      );
    }
  }, [open, user, isEdit, reset]);

  if (!open) return null;

  const onSubmit = async (data: FormValues) => {
    const payload: UserFormData = {
      email:       data.email,
      first_name:  data.first_name,
      last_name:   data.last_name,
      phoneNumber: data.phoneNumber,
      role:        data.role,
    };
    // ส่ง password เฉพาะถ้ากรอกมา
    if (data.password) payload.password = data.password;

    await onSave(payload);
    onClose();
  };

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
      hasError ? "border-red-300 bg-red-50" : "border-gray-200"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            {isEdit ? `แก้ไข ${user.first_name} ${user.last_name}` : "เพิ่มผู้ใช้ใหม่"}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* ชื่อ + นามสกุล */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input {...register("first_name")} placeholder="ชื่อจริง" className={inputClass(!!errors.first_name)} />
              {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <input {...register("last_name")} placeholder="นามสกุล" className={inputClass(!!errors.last_name)} />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input type="email" {...register("email")} placeholder="example@email.com" className={inputClass(!!errors.email)} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input type="tel" {...register("phoneNumber")} placeholder="08x-xxx-xxxx" className={inputClass(!!errors.phoneNumber)} />
            {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select {...register("role")} className={inputClass(false)}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              รหัสผ่าน
              {!isEdit && <span className="text-red-500 ml-1">*</span>}
              {isEdit && <span className="text-gray-400 font-normal ml-1">(เว้นว่างถ้าไม่เปลี่ยน)</span>}
            </label>
            <input type="password" {...register("password")} placeholder={isEdit ? "เว้นว่างถ้าไม่เปลี่ยนรหัสผ่าน" : "อย่างน้อย 8 ตัวอักษร"} className={inputClass(!!errors.password)} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600">
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "บันทึก" : "เพิ่มผู้ใช้"}
          </button>
        </div>
      </form>
    </div>
  );
}
