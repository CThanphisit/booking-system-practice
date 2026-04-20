import Link from "next/link";
import StatusBadge from "./StatusBadge";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

type Booking = {
  id: string;
  code: string;
  customer: string;
  room: string;
  checkIn: string;
  amount: number;
  status: BookingStatus;
};

// mock data — เปลี่ยนเป็นข้อมูลจริงจาก API ภายหลัง
const bookings: Booking[] = [
  {
    id: "1",
    code: "BK-1042",
    customer: "สมชาย ใจดี",
    room: "Deluxe 302",
    checkIn: "22 เม.ย. 2026",
    amount: 4500,
    status: "CONFIRMED",
  },
  {
    id: "2",
    code: "BK-1041",
    customer: "Anna Wilson",
    room: "Suite 501",
    checkIn: "21 เม.ย. 2026",
    amount: 8200,
    status: "PENDING",
  },
  {
    id: "3",
    code: "BK-1040",
    customer: "มานี รักดี",
    room: "Standard 105",
    checkIn: "20 เม.ย. 2026",
    amount: 2100,
    status: "CHECKED_IN",
  },
  {
    id: "4",
    code: "BK-1039",
    customer: "John Smith",
    room: "Deluxe 308",
    checkIn: "19 เม.ย. 2026",
    amount: 4500,
    status: "CANCELLED",
  },
  {
    id: "5",
    code: "BK-1038",
    customer: "นภา สวยงาม",
    room: "Family 201",
    checkIn: "18 เม.ย. 2026",
    amount: 6800,
    status: "COMPLETED",
  },
];

export default function BookingTable() {
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
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-700">
                  {booking.code}
                </td>
                <td className="px-5 py-3 text-gray-900">{booking.customer}</td>
                <td className="px-5 py-3 text-gray-600">{booking.room}</td>
                <td className="px-5 py-3 text-gray-600">{booking.checkIn}</td>
                <td className="px-5 py-3 font-medium text-gray-900">
                  ฿{booking.amount.toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    ดู
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
