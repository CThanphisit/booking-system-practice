type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

const statusStyles: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  CONFIRMED: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Confirmed" },
  CHECKED_IN: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Checked-in" },
  COMPLETED: { bg: "bg-gray-100", text: "text-gray-700", label: "Completed" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", label: "Cancelled" },
};

type StatusBadgeProps = {
  status: BookingStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
