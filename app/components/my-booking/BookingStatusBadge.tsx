import { BookingStatus } from "@/types";

const CONFIG: Record<
  BookingStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  PENDING: {
    label: "รอยืนยัน",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  CONFIRMED: {
    label: "ยืนยันแล้ว",
    dot: "bg-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  CHECKED_IN: {
    label: "เช็คอินแล้ว",
    dot: "bg-indigo-400 animate-pulse",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  COMPLETED: {
    label: "เสร็จสิ้น",
    dot: "bg-stone-400",
    bg: "bg-stone-100",
    text: "text-stone-600",
  },
  CANCELLED: {
    label: "ยกเลิกแล้ว",
    dot: "bg-red-400",
    bg: "bg-red-50",
    text: "text-red-600",
  },
};

export default function BookingStatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
