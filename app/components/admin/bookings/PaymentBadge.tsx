import { PaymentStatus } from "@/types";

const config: Record<PaymentStatus, { label: string; className: string }> = {
  PENDING:  { label: "รอชำระ",   className: "bg-amber-50 text-amber-700" },
  PAID:     { label: "ชำระแล้ว", className: "bg-emerald-50 text-emerald-700" },
  REFUNDED: { label: "คืนเงินแล้ว", className: "bg-blue-50 text-blue-700" },
  FAILED:   { label: "ชำระไม่สำเร็จ", className: "bg-red-50 text-red-600" },
};

export default function PaymentBadge({ status }: { status: PaymentStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
