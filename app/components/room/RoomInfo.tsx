import { RoomValues } from "@/types";
import { BedDouble, Users, Building2, CheckCircle } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  Standard: "Standard",
  Deluxe: "Deluxe",
  Suite: "Suite",
  Family: "Family",
};

const TYPE_COLORS: Record<string, string> = {
  Standard: "bg-stone-100 text-stone-700",
  Deluxe: "bg-indigo-50 text-indigo-700",
  Suite: "bg-amber-50 text-amber-800",
  Family: "bg-rose-50 text-rose-700",
};

type Props = {
  room: RoomValues;
};

export default function RoomInfo({ room }: Props) {
  const isAvailable = room.status === "AVAILABLE";

  return (
    <div className="border-b border-stone-100">
      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[room.type]}`}
        >
          {TYPE_LABELS[room.type]}
        </span>
        <span
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-amber-400"}`}
          />
          {isAvailable ? "พร้อมให้บริการ" : "ปิดปรับปรุง"}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-stone-900 mb-2">
        ห้อง {room.roomNumber}
      </h1>
      <p className="text-stone-500 text-base leading-relaxed mb-5">
        {room.description}
      </p>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: <BedDouble className="w-4 h-4" />, label: room.type },
          {
            icon: <Building2 className="w-4 h-4" />,
            label: `ชั้น ${room.floor}`,
          },
          {
            icon: <Users className="w-4 h-4" />,
            label: `รองรับ ${room.maxOccupancy} คน`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-full"
          >
            <span className="text-stone-400">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
