import { MyBooking, BookingStatus } from "@/types";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

type Props = { bookings: MyBooking[] };

export default function BookingStats({ bookings }: Props) {
  const count = (s: BookingStatus) => bookings.filter((b) => b.status === s).length;
  const upcoming = bookings.filter(
    (b) =>
      (b.status === "CONFIRMED" || b.status === "PENDING") &&
      new Date(b.checkInDate) >= new Date()
  ).length;

  const stats = [
    {
      label: "การจองทั้งหมด",
      value: bookings.length,
      icon: <Calendar className="w-4 h-4" />,
      bg: "bg-stone-100",
      text: "text-stone-700",
      iconBg: "bg-stone-200",
    },
    {
      label: "กำลังจะมาถึง",
      value: upcoming,
      icon: <Clock className="w-4 h-4" />,
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      iconBg: "bg-indigo-100",
    },
    {
      label: "เสร็จสิ้นแล้ว",
      value: count("COMPLETED"),
      icon: <CheckCircle className="w-4 h-4" />,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      label: "ยกเลิกแล้ว",
      value: count("CANCELLED"),
      icon: <XCircle className="w-4 h-4" />,
      bg: "bg-red-50",
      text: "text-red-600",
      iconBg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3`}
        >
          <div className={`${s.iconBg} ${s.text} p-2 rounded-lg shrink-0`}>
            {s.icon}
          </div>
          <div>
            <p className={`text-xl font-bold ${s.text}`}>{s.value}</p>
            <p className={`text-xs ${s.text} opacity-70 mt-0.5`}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
