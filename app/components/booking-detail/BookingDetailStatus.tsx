import { BookingStatus, PaymentStatus } from "@/types";

const BOOKING_CONFIG: Record<
  BookingStatus,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  PENDING:    { label: "รอยืนยัน",    dot: "bg-amber-400",  bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200" },
  CONFIRMED:  { label: "ยืนยันแล้ว",  dot: "bg-emerald-400",bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200" },
  CHECKED_IN: { label: "เช็คอินแล้ว", dot: "bg-indigo-400 animate-pulse", bg: "bg-indigo-50",  text: "text-indigo-700", border: "border-indigo-200" },
  COMPLETED:  { label: "เสร็จสิ้น",   dot: "bg-stone-400",  bg: "bg-stone-100",  text: "text-stone-600",  border: "border-stone-200" },
  CANCELLED:  { label: "ยกเลิกแล้ว",  dot: "bg-red-400",    bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200" },
};

const PAYMENT_CONFIG: Record<
  PaymentStatus,
  { label: string; bg: string; text: string }
> = {
  WAITING_REVIEW: { label: "รอตรวจสอบ", bg: "bg-amber-50",   text: "text-amber-700" },
  APPROVED:       { label: "ชำระแล้ว",  bg: "bg-emerald-50", text: "text-emerald-700" },
  REJECTED:       { label: "ถูกปฏิเสธ", bg: "bg-red-50",     text: "text-red-600" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const c = BOOKING_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const c = PAYMENT_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
