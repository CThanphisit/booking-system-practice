"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { BookingFormValues } from "./BookingFormClient";
import { CreditCard, Building2, Smartphone, Banknote, ShieldCheck } from "lucide-react";

type Props = {
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  watch: UseFormWatch<BookingFormValues>;
};

const PAYMENT_METHODS = [
  {
    value: "CREDIT_CARD",
    label: "บัตรเครดิต / เดบิต",
    icon: <CreditCard className="w-5 h-5" />,
    desc: "Visa, Mastercard, JCB",
  },
  {
    value: "BANK_TRANSFER",
    label: "โอนเงินธนาคาร",
    icon: <Building2 className="w-5 h-5" />,
    desc: "ทุกธนาคารในไทย",
  },
  {
    value: "PROMPTPAY",
    label: "พร้อมเพย์",
    icon: <Smartphone className="w-5 h-5" />,
    desc: "ชำระผ่าน QR Code",
  },
  {
    value: "CASH",
    label: "ชำระเงินสดที่เคาน์เตอร์",
    icon: <Banknote className="w-5 h-5" />,
    desc: "ชำระวันเช็คอิน",
  },
];

export default function PaymentSection({ register, errors, watch }: Props) {
  const selected = watch("paymentMethod");

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-900 mb-5">วิธีชำระเงิน</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selected === method.value;
          return (
            <label
              key={method.value}
              className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <input
                type="radio"
                value={method.value}
                {...register("paymentMethod")}
                className="mt-0.5 accent-stone-900"
              />
              <span className={`mt-0.5 ${isSelected ? "text-stone-900" : "text-stone-400"}`}>
                {method.icon}
              </span>
              <div>
                <p className={`text-sm font-medium ${isSelected ? "text-stone-900" : "text-stone-700"}`}>
                  {method.label}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{method.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {errors.paymentMethod && (
        <p className="text-xs text-red-500 mb-4">{errors.paymentMethod.message}</p>
      )}

      {/* Credit card detail fields */}
      {selected === "CREDIT_CARD" && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-stone-600 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ข้อมูลบัตรถูกเข้ารหัสด้วย SSL
          </p>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">หมายเลขบัตร</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">วันหมดอายุ</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">CVV</label>
              <input
                type="text"
                placeholder="123"
                maxLength={4}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">ชื่อบนบัตร</label>
            <input
              type="text"
              placeholder="SOMCHAI JAIDEE"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white uppercase"
            />
          </div>
        </div>
      )}

      {/* PromptPay QR placeholder */}
      {selected === "PROMPTPAY" && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 flex flex-col items-center gap-3">
          <div className="w-36 h-36 bg-white border border-stone-200 rounded-xl flex items-center justify-center">
            <span className="text-stone-300 text-xs text-center leading-relaxed">
              QR Code<br />จะแสดงหลัง<br />ยืนยัน
            </span>
          </div>
          <p className="text-xs text-stone-500 text-center">
            สแกน QR Code ผ่านแอปธนาคารหรือ mobile banking
          </p>
        </div>
      )}
    </section>
  );
}
