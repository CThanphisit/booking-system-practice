"use client";

import Image from "next/image";
import Link from "next/link";
// import { loginUser } from "../actions";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import z, { email } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

type LoginFromValue = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  // const [errors, setErrors] = useState<{
  //   email?: string[];
  //   password?: string[];
  // }>({});
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFromValue>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setErrors({});
  //   setGeneralError("");

  //   const formData = new FormData(e.currentTarget);
  //   const data = Object.fromEntries(formData.entries());

  //   const validation = loginSchema.safeParse(data);

  //   if (!validation.success) {
  //     const fieldErrors = validation.error.flatten().fieldErrors;
  //     setErrors(fieldErrors);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const res = await fetch("http://localhost:3001/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(validation.data),
  //       credentials: "include", // ส่งคุกกี้ไปด้วย
  //     });

  //     console.log("res", res);

  //     if (!res.ok) {
  //       throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  //     }
  //     router.push("/dashboard");
  //   } catch (err: any) {
  //     setGeneralError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (data: LoginFromValue) => {
    setServerError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // ส่งคุกกี้ไปด้วย
      });

      if (!res.ok) {
        throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      const getMe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });

      const user = await getMe.json();

      if (user.role === "ADMIN") {
        router.push("/admin/dashboard_admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-3/5 relative">
        <Image
          src="https://cdn.pixabay.com/photo/2025/07/16/21/22/la-mure-village-9718387_1280.jpg"
          alt="Lighthouse"
          width={1280}
          height={720}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="w-full lg:w-2/5 flex flex-col justify-between p-8 md:p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-400 to-yellow-400 rounded-full"></div>
          <span className="font-bold text-gray-800">UI Unicorn</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome Back
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="text"
                {...register("email")}
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* <button
              type="button"
              className="w-full py-3 bg-gray-800 text-white flex item-center justify-center gap-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Or sign in with Google
            </button> */}
          </form>

          <p className="text-center mt-8 text-sm text-gray-600">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span>travel</span>
          </div>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
}
