import { PaymentStatus } from "@/types";

const config: Record<PaymentStatus, { label: string; className: string }> = {
  WAITING_REVIEW: {
    label: "รอแอดมินตรวจสอบ",
    className: "bg-amber-50 text-amber-700",
  },
  APPROVED: { label: "ชำระแล้ว", className: "bg-emerald-50 text-emerald-700" },
  REJECTED: { label: "ชำระไม่สำเร็จ", className: "bg-red-50 text-red-600" },
  // REFUNDED: { label: "คืนเงินแล้ว", className: "bg-blue-50 text-blue-700" },
};

export default function PaymentBadge({ status }: { status: PaymentStatus }) {
  if (!status || !config[status]) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
        ไม่ทราบสถานะ
      </span>
    );
  }

  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {label ? label : ""}
    </span>
  );
}
