"use client";

import Image from "next/image";
import Link from "next/link";
import { registerUser } from "../actions";
import { useActionState } from "react";
import z, { string } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  phoneNumber: z.string().min(10, "กรุณากรอกเบอร์โทรศัพท์"),
  email: z.email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

type RegisterFormValue = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  // const [state, formAction] = useActionState(registerUser, { message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValue>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValue) => {
    console.log("data", data);
    const result = await registerUser(data);

    console.log("result", result);
    if (result?.error) {
      alert(result.error);
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
        {/* <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-400 to-yellow-400 rounded-full"></div>
          <span className="font-bold text-gray-800">UI Unicorn</span>
        </div> */}

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Create Account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                {...register("phoneNumber")}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="name@email.com"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div> */}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mt-2"
            >
              Register
            </button>
          </form>

          <Link href="/login">
            <p className="text-blue-600 font-semibold hover:underline mt-3 text-center cursor-pointer">
              Login
            </p>
          </Link>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span className="bg-blue-500 p-1 rounded-full text-white">f</span>
            <span>@uiunicorn</span>
          </div>
          <span>© Perfect Login 2021</span>
        </div>
      </div>
    </div>
  );
}
