import { BookingStatus } from "@/types";

const config: Record<BookingStatus, { label: string; className: string; dot: string }> = {
  PENDING:    { label: "รอยืนยัน",    className: "bg-amber-50 text-amber-700",  dot: "bg-amber-400" },
  CONFIRMED:  { label: "ยืนยันแล้ว",  className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-400" },
  CHECKED_IN: { label: "เช็คอินแล้ว", className: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-400" },
  COMPLETED:  { label: "เสร็จสิ้น",   className: "bg-gray-100 text-gray-600",  dot: "bg-gray-400" },
  CANCELLED:  { label: "ยกเลิก",      className: "bg-red-50 text-red-600",     dot: "bg-red-400" },
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, className, dot } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
