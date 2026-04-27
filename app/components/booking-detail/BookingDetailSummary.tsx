import { Copy, Download } from "lucide-react";
import { Booking, MyBooking } from "@/types";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

type Props = {
  booking: MyBooking;
  onCopy: () => void;
};

export default function BookingDetailSummary({ booking, onCopy }: Props) {
  const pricePerNight = Number(booking.totalAmount) / booking.nights;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      {/* Booking code header */}
      <div className="bg-stone-900 px-6 py-5 text-center">
        <p className="text-stone-400 text-xs mb-1.5 tracking-wider uppercase">
          Booking Code
        </p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-white text-2xl font-bold tracking-widest font-mono">
            {booking.code}
          </p>
          <button
            onClick={onCopy}
            className="text-stone-500 hover:text-white transition-colors p-1"
            title="คัดลอก booking code"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="px-6 py-5 space-y-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">
          สรุปราคา
        </p>

        <div className="flex justify-between text-sm text-stone-600">
          <span>
            ฿
            {pricePerNight.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            × {booking.nights} คืน
          </span>
          <span>฿{Number(booking.totalAmount).toLocaleString()}</span>
        </div>

        <div className="border-t border-stone-100 pt-3 flex justify-between font-semibold text-stone-900">
          <span>รวมทั้งหมด</span>
          <span className="text-lg">
            ฿{Number(booking.totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="border-t border-stone-100 px-6 py-4 space-y-2">
        <div className="flex justify-between text-xs text-stone-400">
          <span>วันที่จอง</span>
          <span>
            {format(parseISO(booking.createdAt), "d MMM yyyy", { locale: th })}
          </span>
        </div>
        <div className="flex justify-between text-xs text-stone-400">
          <span>รหัสการจอง</span>
          <span className="font-mono">{booking.id.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Download button */}
      <div className="px-6 pb-5">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-stone-700 border border-stone-200 hover:border-stone-300 py-2.5 rounded-xl transition-colors">
          <Download className="w-4 h-4" />
          ดาวน์โหลดใบเสร็จ
        </button>
      </div>
    </div>
  );
}
