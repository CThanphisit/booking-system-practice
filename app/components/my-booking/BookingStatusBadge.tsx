import { BookingStatus, PaymentStatus } from "@/types"; // ปรับ path ตามโปรเจกต์คุณ

interface BadgeProps {
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
}

const BOOKING_CONFIG: Record<
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

const PAYMENT_REJECTED_CONFIG = {
  label: "สลิปไม่ถูกต้อง",
  dot: "bg-red-500 animate-ping",
  bg: "bg-red-100",
  text: "text-red-700",
};

const NO_PAYMENT_CONFIG = {
  label: "รอการชำระ",
  dot: "bg-rose-400 animate-pulse",
  bg: "bg-rose-50",
  text: "text-rose-700",
};

export default function BookingStatusBadge({
  status,
  paymentStatus,
}: BadgeProps) {
  // 1. เช็คว่าไม่มีข้อมูลการชำระเงิน (null หรือ undefined) และสถานะการจองยังเป็น PENDING
  const isNoPayment = status === "PENDING" && !paymentStatus;

  // 2. เช็คว่าโดน Reject หรือไม่
  const isRejected = status === "PENDING" && paymentStatus === "REJECTED";

  // เลือก Config ตามเงื่อนไข
  let c = BOOKING_CONFIG[status];

  if (isNoPayment) {
    c = NO_PAYMENT_CONFIG;
  } else if (isRejected) {
    c = PAYMENT_REJECTED_CONFIG;
  }

  return (
    <div className="flex items-center gap-1">
      <span
        className={`inline-flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${c.bg} ${c.text} `}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>

      {isRejected && (
        <span className="text-[10px] text-red-500 font-medium ml-1">
          *กรุณาอัปโหลดสลิปใหม่
        </span>
      )}
    </div>
  );
}
