import { BedDouble, Users, Pencil, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Room } from "@/types";
import RoomStatusBadge from "./RoomStatusBadge";

type Props = {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
};

export default function RoomCard({ room, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={room.images[0] ?? "https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Image"}
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <RoomStatusBadge status={room.status} />
        </div>
        {/* 3-dot menu */}
        <div className="absolute top-2 right-2 relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white"
          >
            <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
              <button
                onClick={() => { onEdit(room); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="w-3.5 h-3.5" />
                แก้ไข
              </button>
              <button
                onClick={() => { onDelete(room.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                ลบ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-sm font-medium text-gray-900">
              ห้อง {room.roomNumber}
            </p>
            <p className="text-xs text-gray-500">{room.type} · ชั้น {room.floor}</p>
          </div>
          <p className="text-sm font-medium text-indigo-600">
            ฿{room.pricePerNight.toLocaleString()}
            <span className="text-xs text-gray-400 font-normal">/คืน</span>
          </p>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{room.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {room.maxOccupancy} คน
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="w-3 h-3" />
            {room.type}
          </span>
        </div>

        {/* Amenities pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {room.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
