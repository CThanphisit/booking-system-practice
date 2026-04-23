"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Room } from "@/types";
import BookingSummaryCard from "./BookingSummaryCard";
import GuestForm from "./GuestForm";
import PaymentSection from "./PaymentSection";
import { useAuth } from "@/app/context/AuthContext";

// ─── Zod schema ────────────────────────────────────────────────────────────────
const bookingSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  note: z.string().optional(),
  paymentMethod: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "PROMPTPAY", "CASH"], {
    errorMap: () => ({ message: "กรุณาเลือกวิธีชำระเงิน" }),
  }),
  acceptPolicy: z.literal(true, {
    errorMap: () => ({ message: "กรุณายอมรับเงื่อนไข" }),
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

// สมมติว่า logged-in user มีข้อมูลนี้ — เปลี่ยนเป็น auth context จริง
const MOCK_USER = {
  firstName: "สมชาย",
  lastName: "ใจดี",
  email: "somchai@email.com",
  phone: "081-234-5678",
};

type Props = {
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
};

const STEPS = ["ข้อมูลผู้เข้าพัก", "ชำระเงิน", "ยืนยัน"];

export default function BookingFormClient({
  room,
  checkIn,
  checkOut,
  nights,
  guests,
}: Props) {
  console.log("room", room);
  console.log("checkIn", checkIn);
  console.log("checkOut", checkOut);
  const router = useRouter();

  const { user } = useAuth();
  console.log("user", user);

  const [step, setStep] = useState(0); // 0 = guest info, 1 = payment
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      email: user?.email,
      phone: user?.phoneNumber,
      paymentMethod: undefined,
      acceptPolicy: undefined,
    },
  });

  const totalAmount = room.pricePerNight * nights;

  // ── Step 0 → 1: validate guest fields ก่อน ──────────────────────────────
  const handleNextStep = async () => {
    const valid = await trigger(["firstName", "lastName", "email", "phone"]);
    if (valid) setStep(1);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: BookingFormValues) => {
    console.log("dataSubmit", data);
    setLoading(true);
    try {
      // เปลี่ยนเป็น API call จริง เช่น:
      // const res = await fetch("/api/bookings", {
      //   method: "POST",
      //   body: JSON.stringify({ roomId: room.id, checkIn, checkOut, nights, guests, ...data }),
      // });
      // const booking = await res.json();
      // Mock: simulate API delay แล้ว redirect ไปหน้า confirmation
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      // const mockBookingCode = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      // const params = new URLSearchParams({
      //   checkIn,
      //   checkOut,
      //   nights: String(nights),
      //   guests: String(guests),
      //   total: String(totalAmount),
      //   roomName: `ห้อง ${room.roomNumber}`,
      // });
      // router.push(`/booking/${room.id}/confirmation?${params.toString()}`);

      const payload = {
        userId: user?.id,
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: nights,
        guestCount: guests,
        status: "PENDING",
        note: data.note,
      };

      console.log("payload", payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("การจองไม่สําเร็จ");
      }

      console.log("resCreateBooking", res);

      // router.push(`/booking/${room.id}/confirmation?${params.toString()}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Progress bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                    i <= step
                      ? "bg-stone-900 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm hidden sm:block ${
                    i <= step ? "text-stone-900 font-medium" : "text-stone-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px w-10 mx-1 ${
                    i < step ? "bg-stone-900" : "bg-stone-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: Form ─────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 0 — Guest info */}
              {step === 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
                  <GuestForm register={register} errors={errors} />
                </div>
              )}

              {/* Step 1 — Payment */}
              {step === 1 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-8">
                  {/* Guest summary (read-only) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold text-stone-900">
                        ข้อมูลผู้เข้าพัก
                      </h2>
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2"
                      >
                        แก้ไข
                      </button>
                    </div>
                    <div className="bg-stone-50 rounded-xl px-4 py-3 text-sm text-stone-700 space-y-1">
                      <p className="font-medium">
                        {watch("firstName")} {watch("lastName")}
                      </p>
                      <p className="text-stone-500">
                        {watch("email")} · {watch("phone")}
                      </p>
                      {watch("note") && (
                        <p className="text-stone-400 text-xs mt-1">
                          หมายเหตุ: {watch("note")}
                        </p>
                      )}
                    </div>
                  </div>

                  <PaymentSection
                    register={register}
                    errors={errors}
                    watch={watch}
                  />

                  {/* Accept policy */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("acceptPolicy")}
                        className="mt-0.5 w-4 h-4 rounded accent-stone-900"
                      />
                      <span className="text-sm text-stone-600 leading-relaxed">
                        ฉันได้อ่านและยอมรับ{" "}
                        <a
                          href="#"
                          className="text-stone-900 underline underline-offset-2"
                        >
                          เงื่อนไขการใช้บริการ
                        </a>{" "}
                        และ{" "}
                        <a
                          href="#"
                          className="text-stone-900 underline underline-offset-2"
                        >
                          นโยบายความเป็นส่วนตัว
                        </a>
                      </span>
                    </label>
                    {errors.acceptPolicy && (
                      <p className="mt-1.5 text-xs text-red-500 ml-7">
                        {errors.acceptPolicy.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => (step === 0 ? router.back() : setStep(0))}
                  className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {step === 0 ? "กลับ" : "ย้อนกลับ"}
                </button>

                {step === 0 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    ถัดไป — เลือกชำระเงิน
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังดำเนินการ...
                      </>
                    ) : (
                      <>ยืนยันและชำระเงิน ฿{totalAmount.toLocaleString()}</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ── Right: Summary ──────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <BookingSummaryCard
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                guests={guests}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
