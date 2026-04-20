import { RoomStatus } from "@/types";

const config: Record<RoomStatus, { label: string; className: string }> = {
  AVAILABLE:   { label: "ว่าง",        className: "bg-emerald-50 text-emerald-700" },
  MAINTENANCE: { label: "ซ่อมบำรุง",   className: "bg-amber-50 text-amber-700" },
  INACTIVE:    { label: "ปิดใช้งาน",   className: "bg-gray-100 text-gray-500" },
};

export default function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
