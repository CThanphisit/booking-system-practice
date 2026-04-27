import {
  BedDouble,
  Calendar,
  Users,
  Moon,
  Building2,
  Hash,
} from "lucide-react";
import { Booking, MyBooking } from "@/types";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

type Props = { booking: MyBooking };

const formatDate = (d: string) =>
  format(parseISO(d), "EEEE d MMMM yyyy", { locale: th });

const TYPE_COLORS: Record<string, string> = {
  Standard: "bg-stone-100 text-stone-700",
  Deluxe: "bg-indigo-50 text-indigo-700",
  Suite: "bg-amber-50 text-amber-800",
  Family: "bg-rose-50 text-rose-700",
};

export default function BookingDetailInfo({ booking }: Props) {
  console.log("bookingDetail", booking);
  const pricePerNight = Number(booking.totalAmount) / booking.nights;

  return (
    <div className="space-y-6">
      {/* Room info */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
            ห้องพัก
          </p>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-stone-500" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">
                  ห้อง {booking.room?.roomNumber}
                </p>
                <p className="text-sm text-stone-500">
                  ชั้น {booking.room?.floor}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[booking.room?.type ?? "Standard"]}`}
            >
              {booking.room?.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              {
                icon: <Users className="w-4 h-4" />,
                label: "ผู้เข้าพัก",
                value: `${booking.guestCount} คน`,
              },
              {
                icon: <Building2 className="w-4 h-4" />,
                label: "ชั้น",
                value: `ชั้น ${booking.room?.floor}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-stone-50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                  {item.icon} {item.label}
                </div>
                <p className="text-sm font-medium text-stone-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date info */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
            วันที่เข้าพัก
          </p>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Calendar className="w-4 h-4" /> Check-in
              </div>
              <p className="text-sm font-medium text-stone-800">
                {formatDate(booking.checkInDate)}
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Calendar className="w-4 h-4" /> Check-out
              </div>
              <p className="text-sm font-medium text-stone-800">
                {formatDate(booking.checkOutDate)}
              </p>
            </div>
          </div>
          <div className="bg-stone-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-400 text-sm">
              <Moon className="w-4 h-4" /> จำนวนคืน
            </div>
            <p className="text-sm font-semibold text-stone-800">
              {booking.nights} คืน
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      {booking.note && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
          <p className="text-xs font-medium text-amber-700 mb-1">หมายเหตุ</p>
          <p className="text-sm text-amber-800">{booking.note}</p>
        </div>
      )}
    </div>
  );
}
