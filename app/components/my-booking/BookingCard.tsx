import Link from "next/link";
import {
  Calendar,
  Moon,
  Users,
  BedDouble,
  ChevronRight,
  Copy,
  X,
  Star,
  Download,
} from "lucide-react";
import { MyBooking } from "@/types";
import BookingStatusBadge from "./BookingStatusBadge";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import Image from "next/image";

type Props = {
  booking: MyBooking;
  onCancel: (booking: MyBooking) => void;
  onCopyCode: (code: string) => void;
};

const TYPE_COLORS: Record<string, string> = {
  Standard: "from-stone-200 to-stone-300",
  Deluxe: "from-indigo-100 to-indigo-200",
  Suite: "from-amber-100 to-amber-200",
  Family: "from-rose-100 to-rose-200",
};

function formatDate(d: string) {
  return format(parseISO(d), "d MMM yyyy", { locale: th });
}

export default function BookingCard({ booking, onCancel, onCopyCode }: Props) {
  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";
  const canReview = booking.status === "COMPLETED";
  const isActive = booking.status === "CHECKED_IN";

  return (
    <article
      className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${
        isActive
          ? "border-indigo-200 ring-1 ring-indigo-100"
          : "border-stone-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Room image / color block */}
        <div
          className={`relative sm:w-44 h-32 sm:h-auto shrink-0 bg-gradient-to-br ${
            TYPE_COLORS[booking.room.type]
          } flex items-center justify-center`}
        >
          {/* Room image */}
          {booking.room.images[0] ? (
            <Image
              src={booking.room.images[0]}
              alt={`ห้อง ${booking.room.roomNumber}`}
              className="w-full h-full object-cover"
              width={200}
              height={200}
            />
          ) : (
            <div className="w-full h-full bg-stone-200 flex items-center justify-center">
              <BedDouble className="w-10 h-10 text-stone-400" />
            </div>
          )}

          {/* Active indicator */}
          {isActive && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              กำลังเข้าพัก
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            {/* Room info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-stone-900">
                  ห้อง {booking.room.roomNumber} · {booking.room.type}
                </h3>
                <BookingStatusBadge
                  status={booking.status}
                  paymentStatus={booking.payment?.status}
                />
              </div>
              {/* Booking code */}
              <button
                onClick={() => onCopyCode(booking.code)}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors group"
              >
                <span className="font-mono">{booking.code}</span>
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            {/* Price */}
            <p className="text-lg font-bold text-stone-900">
              ฿{booking.totalAmount.toLocaleString()}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {formatDate(booking.checkInDate)} →{" "}
              {formatDate(booking.checkOutDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-stone-400" />
              {booking.nights} คืน
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              {booking.guestCount} คน
            </span>
          </div>

          {/* Note */}
          {booking.note && (
            <p className="text-xs text-stone-400 bg-stone-50 rounded-lg px-3 py-2 mb-4 italic">
              &quot;{booking.note}&quot;
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/my-bookings/${booking.id}`}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 px-3.5 py-1.5 rounded-lg transition-colors"
            >
              ดูรายละเอียด
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* {canReview && (
              <Link
                href={`/my-bookings/${booking.id}/review`}
                className="flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-100 px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <Star className="w-3.5 h-3.5" />
                เขียนรีวิว
              </Link>
            )}

            <button className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 px-3.5 py-1.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors">
              <Download className="w-3.5 h-3.5" />
              ใบเสร็จ
            </button> */}

            {canCancel && (
              <button
                onClick={() => onCancel(booking)}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-colors ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
