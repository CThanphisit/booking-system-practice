import Link from "next/link";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";
import type { Booking } from "@/types";
import BookingStatusBadge from "./bookings/BookingStatusBadge";

export default async function BookingTable() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let bookings: Booking[] = [];
  try {
    const res = await fetch(`${process.env.API_URL}booking?limit=5`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
    });
    if (res.ok) {
      bookings = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch bookings", error);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">การจองล่าสุด</h3>
        <Link
          href="/admin/bookings"
          className="text-xs text-indigo-600 hover:text-indigo-700"
        >
          ดูทั้งหมด →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">ลูกค้า</th>
              <th className="px-5 py-3 font-medium">ห้อง</th>
              <th className="px-5 py-3 font-medium">Check-in</th>
              <th className="px-5 py-3 font-medium">ราคา</th>
              <th className="px-5 py-3 font-medium">สถานะ</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-3 font-mono text-xs text-gray-700">
                  {booking.code}
                </td>
                <td className="px-5 py-3 text-gray-900">
                  {booking.user.first_name} {booking.user.last_name}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {booking.room.type} {booking.room.roomNumber}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {format(parseISO(booking.checkInDate), "dd/MM/yyyy")}
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">
                  ฿{Number(booking.totalAmount).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-5 py-3">
                  <Link
                    href="/admin/bookings"
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    ดู
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-400 text-sm"
                >
                  ไม่มีข้อมูลการจอง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
