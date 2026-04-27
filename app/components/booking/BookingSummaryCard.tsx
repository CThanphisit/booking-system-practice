import Image from "next/image";
import { Calendar, Users, Moon, BedDouble } from "lucide-react";
import { Room } from "@/types";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

type Props = {
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
};

const GRADIENTS: Record<string, string> = {
  Standard: "from-stone-200 to-stone-300",
  Deluxe: "from-indigo-100 to-indigo-200",
  Suite: "from-amber-100 to-amber-200",
  Family: "from-rose-100 to-rose-200",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(parseISO(dateStr), "d MMM yyyy", { locale: th });
}

export default function BookingSummaryCard({
  room,
  checkIn,
  checkOut,
  nights,
  guests,
}: Props) {
  const totalAmount = room.pricePerNight * nights;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      {/* Room image */}
      <div className="relative h-44">
        {room.images[0] ? (
          <Image
            src={room.images[0]}
            alt={`ห้อง ${room.roomNumber}`}
            fill
            className="object-cover"
            sizes="400px"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${GRADIENTS[room.type]} flex items-center justify-center`}
          >
            <BedDouble className="w-10 h-10 text-white/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <p className="font-semibold text-base">ห้อง {room.roomNumber}</p>
          <p className="text-white/80 text-sm">
            {room.type} · ชั้น {room.floor}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" /> Check-in
            </div>
            <p className="text-sm font-medium text-stone-900">
              {formatDate(checkIn)}
            </p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" /> Check-out
            </div>
            <p className="text-sm font-medium text-stone-900">
              {formatDate(checkOut)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-stone-600 bg-stone-50 rounded-xl px-4 py-3">
          <span className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5" /> {nights} คืน
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> {guests} คน
          </span>
        </div>

        {/* Price breakdown */}
        <div className="border-t border-stone-100 pt-3 space-y-2">
          <div className="flex justify-between text-sm text-stone-600">
            <span>
              ฿{room.pricePerNight.toLocaleString()} × {nights} คืน
            </span>
            <span>฿{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-stone-900 text-base pt-2 border-t border-stone-100">
            <span>รวมทั้งหมด</span>
            <span className="text-amber-700">
              ฿{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
