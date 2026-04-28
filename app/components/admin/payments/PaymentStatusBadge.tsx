import { PaymentStatus } from "@/types";

const CONFIG: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
  WAITING_REVIEW: { label: "รอตรวจสลิป",  bg: "bg-amber-50",   text: "text-amber-700"  },
  APPROVED:       { label: "อนุมัติแล้ว",  bg: "bg-emerald-50", text: "text-emerald-700" },
  REJECTED:       { label: "ปฏิเสธแล้ว",  bg: "bg-red-50",     text: "text-red-600"    },
  REFUND_PENDING: { label: "รอคืนเงิน",   bg: "bg-indigo-50",  text: "text-indigo-700" },
  REFUNDED:       { label: "คืนเงินแล้ว", bg: "bg-stone-100",  text: "text-stone-600"  },
};

export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
