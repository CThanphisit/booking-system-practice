"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

type Props = { deadline: string }; // ISO string จาก API

export default function PaymentCountdown({ deadline }: Props) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft === 0) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        หมดเวลาชำระเงินแล้ว
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isUrgent = timeLeft < 60 * 60 * 1000; // น้อยกว่า 1 ชม.

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
        isUrgent
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-amber-50 border-amber-200 text-amber-800"
      }`}
    >
      <Clock className="w-4 h-4 shrink-0" />
      <span>กรุณาชำระภายใน</span>
      <span className="font-mono font-bold">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
