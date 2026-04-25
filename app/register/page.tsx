"use client";

import Image from "next/image";
import Link from "next/link";
import { registerUser } from "../actions";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  first_name: z.string().min(1, "กรุณากรอกชื่อ"),
  last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
  phoneNumber: z.string().min(10, "กรุณากรอกเบอร์โทรศัพท์"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

type RegisterFormValue = z.infer<typeof registerSchema>;

type FieldConfig = {
  name: keyof RegisterFormValue;
  label: string;
  placeholder: string;
  type?: string;
  half?: boolean;
};

const FIELDS: FieldConfig[] = [
  { name: "first_name", label: "ชื่อ", placeholder: "ชื่อจริง", half: true },
  { name: "last_name", label: "นามสกุล", placeholder: "นามสกุล", half: true },
  { name: "phoneNumber", label: "เบอร์โทรศัพท์", placeholder: "08x-xxx-xxxx" },
  {
    name: "email",
    label: "อีเมล",
    placeholder: "example@email.com",
    type: "email",
  },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValue>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValue) => {
    setServerError("");
    const result = await registerUser(data);
    if (result?.message) {
      setServerError(result.message);
    } else {
      setSuccess(true);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-stone-900 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-500/50 focus:ring-red-500/30"
        : "border-stone-800 focus:ring-amber-500/30 focus:border-amber-500/50"
    }`;

  return (
    <div className="min-h-screen flex bg-stone-950">
      {/* ── Left: รูปภาพ ─────────────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://cdn.pixabay.com/photo/2025/07/16/21/22/la-mure-village-9718387_1280.jpg"
          alt="ที่พักสวยงาม"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-amber-400" />
            <span className="text-amber-400 text-xs tracking-widest uppercase">
              เริ่มต้นการเดินทาง
            </span>
          </div>
          <p className="text-white text-2xl font-semibold leading-snug">
            &quot;สมัครวันนี้
            <br />
            จองง่าย ไปได้ทุกที่&quot;
          </p>
        </div>
      </div>

      {/* ── Right: Form ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 overflow-y-auto">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="text-stone-950 font-bold text-sm">B</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              Bookify
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">สร้างบัญชีใหม่</h1>
          <p className="text-stone-400 text-sm">
            กรอกข้อมูลด้านล่างเพื่อเริ่มใช้งาน Bookify
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                สมัครสมาชิกสำเร็จ!
              </p>
              <p className="text-stone-400 text-sm mt-1">
                เข้าสู่ระบบเพื่อเริ่มจองห้องพักได้เลย
              </p>
            </div>
            <Link
              href="/login"
              className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-sm transition-colors"
            >
              ไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        ) : (
          <>
            {/* Server Error */}
            {serverError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* ชื่อ + นามสกุล (2 column) */}
              <div className="grid grid-cols-2 gap-4">
                {FIELDS.filter((f) => f.half).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-stone-400 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      {...register(field.name)}
                      className={inputClass(!!errors[field.name])}
                    />
                    {errors[field.name] && (
                      <p className="text-red-400 text-xs mt-1.5">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* เบอร์โทร + อีเมล */}
              {FIELDS.filter((f) => !f.half).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-stone-400 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className={inputClass(!!errors[field.name])}
                  />
                  {errors[field.name] && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1.5">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    {...register("password")}
                    className={inputClass(!!errors.password) + " pr-11"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังสมัครสมาชิก...
                  </>
                ) : (
                  "สมัครสมาชิก"
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center mt-6 text-sm text-stone-500">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                href="/login"
                className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-stone-700 mt-10">
          © 2026 Bookify · ระบบจองที่พักออนไลน์
        </p>
      </div>
    </div>
  );
}
