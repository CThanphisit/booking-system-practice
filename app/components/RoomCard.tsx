import Link from "next/link";
import {
  Users,
  BedDouble,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Bath,
  ChefHat,
} from "lucide-react";
import { RoomValues } from "@/types";
import Image from "next/image";

// Map amenity name → icon
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-3.5 h-3.5" />,
  TV: <Tv className="w-3.5 h-3.5" />,
  "Air Conditioning": <Wind className="w-3.5 h-3.5" />,
  "Mini Bar": <Coffee className="w-3.5 h-3.5" />,
  Bathtub: <Bath className="w-3.5 h-3.5" />,
  Kitchen: <ChefHat className="w-3.5 h-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  Standard: "bg-stone-100 text-stone-700",
  Deluxe: "bg-indigo-50 text-indigo-700",
  Suite: "bg-amber-50 text-amber-700",
  Family: "bg-rose-50 text-rose-700",
};

type Props = {
  room: RoomValues;
  nights?: number; // คำนวณราคารวมถ้ามีการเลือกวัน
};

export default function RoomCard({ room, nights }: Props) {
  const isAvailable = room.status === "AVAILABLE";
  const totalPrice = nights ? room.pricePerNight * nights : null;

  console.log("room", room);

  // Placeholder gradient ถ้าไม่มีรูปจริง
  const gradients: Record<string, string> = {
    Standard: "from-stone-200 to-stone-300",
    Deluxe: "from-indigo-100 to-indigo-200",
    Suite: "from-amber-100 to-amber-200",
    Family: "from-rose-100 to-rose-200",
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        {room.images[0] ? (
          <Image
            src={room.images[0]}
            alt={`ห้อง ${room.roomNumber}`}
            fill
            className="object-cover"
            // sizes="400px"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradients[room.type]} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
          >
            <BedDouble className="w-12 h-12 text-white/60" />
          </div>
        )}

        {/* Status overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
            <span className="bg-stone-900/80 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              ปิดปรับปรุง
            </span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[room.type]} bg-white/90`}
          >
            {room.type}
          </span>
        </div>

        {/* Available badge */}
        {isAvailable && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1.5 bg-white/90 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ว่าง
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <h3 className="font-semibold text-stone-900 text-base">
              ห้อง {room.roomNumber}
            </h3>
            <p className="text-stone-500 text-xs mt-0.5">
              ชั้น {room.floor} · รองรับ {room.maxOccupancy} คน
            </p>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-lg font-bold text-stone-900">
              ฿{room.pricePerNight.toLocaleString()}
            </p>
            <p className="text-stone-400 text-xs">/คืน</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-stone-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {room.description}
        </p>

        {/* Amenities */}
        {/* <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(AMENITY_ICONS).map(([name, icon]) =>
            room.amenities.includes(name) ? (
              <span
                key={name}
                className="flex items-center gap-1 text-xs text-stone-500 bg-stone-50 border border-stone-200 px-2 py-1 rounded-md"
              >
                {icon}
                <span>{name}</span>
              </span>
            ) : null
          )}
        </div> */}

        {/* Total price if dates selected */}
        {totalPrice && nights && isAvailable && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-4 flex justify-between items-center">
            <span className="text-sm text-amber-800">รวม {nights} คืน</span>
            <span className="font-bold text-amber-900">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* CTA */}
        {isAvailable ? (
          <Link
            href={`/rooms/${room.id}`}
            className="block w-full text-center bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            ดูรายละเอียด
          </Link>
        ) : (
          <button
            disabled
            className="block w-full text-center bg-stone-100 text-stone-400 text-sm font-medium py-2.5 rounded-xl cursor-not-allowed"
          >
            ไม่พร้อมให้บริการ
          </button>
        )}
      </div>
    </article>
  );
}
