"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { X, Loader2, CheckCircle } from "lucide-react";
import { User } from "@/types";

const schema = z.object({
  first_name: z.string().min(1, "กรุณากรอกชื่อ"),
  last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  phoneNumber: z.string().min(9, "เบอร์โทรไม่ถูกต้อง"),
  password: z
    .string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
    .regex(/[a-z]/, "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
    .regex(/[^a-zA-Z0-9]/, "ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว เช่น !@#$%")
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  user: User;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

// Outer shell — unmounts the form when closed so state resets naturally
export default function EditProfileModal(props: Props) {
  if (!props.open) return null;
  return <EditProfileForm {...props} />;
}

function EditProfileForm({ user, onClose, onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    const payload: Partial<FormValues> = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };
    if (data.password) payload.password = data.password;

    const res = await fetch("/api/proxy/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setServerError(err?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setSuccess(true);
    toast.success("บันทึกข้อมูลโปรไฟล์แล้ว");
    await onSuccess();
    setTimeout(onClose, 800);
  };

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
      hasError
        ? "border-red-300 bg-red-50"
        : "border-stone-200 bg-white focus:border-amber-400"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-stone-900">แก้ไขข้อมูลส่วนตัว</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* ชื่อ + นามสกุล */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("first_name")}
                placeholder="ชื่อจริง"
                className={inputClass(!!errors.first_name)}
              />
              {errors.first_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                {...register("last_name")}
                placeholder="นามสกุล"
                className={inputClass(!!errors.last_name)}
              />
              {errors.last_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@email.com"
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phoneNumber")}
              placeholder="08x-xxx-xxxx"
              className={inputClass(!!errors.phoneNumber)}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              รหัสผ่านใหม่{" "}
              <span className="text-stone-400 font-normal">
                (เว้นว่างถ้าไม่เปลี่ยน)
              </span>
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="อย่างน้อย 8 ตัว, A-Z, a-z, อักขระพิเศษ"
              className={inputClass(!!errors.password)}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {serverError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="flex-1 py-2.5 text-sm bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {success ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                บันทึกแล้ว
              </>
            ) : isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "บันทึก"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
