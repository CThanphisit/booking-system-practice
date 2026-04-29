"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

type LoginFormValue = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValue) => {
    setServerError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

      await checkAuth();

      const getMe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
        credentials: "include",
      });
      const user = await getMe.json();

      if (user.role === "ADMIN") {
        router.push("/admin/dashboard_admin");
      } else {
        const destination = callbackUrl || "/";
        router.push(destination);
        router.refresh();
      }
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-950">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://cdn.pixabay.com/photo/2025/07/16/21/22/la-mure-village-9718387_1280.jpg"
          alt="ที่พักสวยงาม"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20">
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="text-stone-950 font-bold text-sm">B</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              Bookify
            </span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ยินดีต้อนรับกลับ
          </h1>
          <p className="text-stone-400 text-sm">
            เข้าสู่ระบบเพื่อดูและจัดการการจองของคุณ
          </p>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-400 mb-1.5">
              อีเมล
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              {...register("email")}
              className={`w-full bg-stone-900 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500/50 focus:ring-red-500/30"
                  : "border-stone-800 focus:ring-amber-500/30 focus:border-amber-500/50"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-stone-400">
                รหัสผ่าน
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                {...register("password")}
                className={`w-full bg-stone-900 border rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-stone-800 focus:ring-amber-500/30 focus:border-amber-500/50"
                }`}
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-4 h-4 border border-stone-700 rounded bg-stone-900 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all" />
              </div>
              <span className="text-sm text-stone-400 group-hover:text-stone-300 transition-colors">
                จดจำฉันไว้
              </span>
            </label>

            <a
              href="#"
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-stone-500">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            สมัครสมาชิกเลย
          </Link>
        </p>

        <p className="text-center text-xs text-stone-700 mt-12">
          © 2026 Bookify · ระบบจองที่พักออนไลน์
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
