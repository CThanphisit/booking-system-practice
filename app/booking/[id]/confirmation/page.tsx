import Link from "next/link";
import { CheckCircle, Calendar, Moon, Users, Download, Home, BookOpen } from "lucide-react";

type Props = {
  params: { roomId: string };
  searchParams: {
    code?: string;
    checkIn?: string;
    checkOut?: string;
    nights?: string;
    guests?: string;
    total?: string;
    roomName?: string;
  };
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ConfirmationPage({ searchParams }: Props) {
  const {
    code     = "BK-XXXX",
    checkIn,
    checkOut,
    nights   = "1",
    guests   = "1",
    total    = "0",
    roomName = "ห้องพัก",
  } = searchParams;

  const details = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Check-in",
      value: formatDate(checkIn),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Check-out",
      value: formatDate(checkOut),
    },
    {
      icon: <Moon className="w-4 h-4" />,
      label: "จำนวนคืน",
      value: `${nights} คืน`,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "จำนวนผู้เข้าพัก",
      value: `${guests} คน`,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {/* Success icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-600 stroke-[1.5]" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">
              จองสำเร็จแล้ว!
            </h1>
            <p className="text-stone-500 text-sm text-center leading-relaxed">
              เราได้ส่งรายละเอียดการจองไปยังอีเมลของคุณแล้ว<br />
              กรุณาตรวจสอบที่ inbox ของท่าน
            </p>
          </div>

          {/* Booking card */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-6">

            {/* Code header */}
            <div className="bg-stone-900 px-6 py-5 text-center">
              <p className="text-stone-400 text-xs mb-1.5 tracking-wider uppercase">Booking Code</p>
              <p className="text-white text-3xl font-bold tracking-widest font-mono">{code}</p>
            </div>

            {/* Room name */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 mb-0.5">ห้องพัก</p>
                <p className="font-semibold text-stone-900">{roomName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500 mb-0.5">ยอดชำระ</p>
                <p className="font-bold text-stone-900 text-lg">
                  ฿{Number(total).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4">
              {details.map((d) => (
                <div key={d.label}>
                  <p className="text-xs text-stone-400 flex items-center gap-1.5 mb-1">
                    {d.icon} {d.label}
                  </p>
                  <p className="text-sm font-medium text-stone-800">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Status footer */}
            <div className="mx-6 mb-5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-emerald-700 font-medium">
                การจองได้รับการยืนยันแล้ว
              </p>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800 space-y-1">
            <p className="font-medium">ข้อควรระวัง</p>
            <ul className="text-amber-700 space-y-0.5 text-xs">
              <li>· กรุณานำ Booking Code มาแสดงที่เคาน์เตอร์</li>
              <li>· Check-in เวลา 14:00 น. เป็นต้นไป</li>
              <li>· หากต้องการยกเลิก กรุณาแจ้งล่วงหน้าอย่างน้อย 48 ชม.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="flex items-center justify-center gap-2 border border-stone-200 text-stone-700 text-sm font-medium py-3 rounded-xl hover:bg-stone-50 transition-colors">
              <Download className="w-4 h-4" />
              ดาวน์โหลด PDF
            </button>
            <Link
              href="/my-bookings"
              className="flex items-center justify-center gap-2 bg-stone-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-stone-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              ดูการจองของฉัน
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
        </div>
      </main>

      <footer className="bg-stone-950 text-stone-500 text-center text-sm py-6">
        <p>© 2026 Bookify · ระบบจองที่พักออนไลน์</p>
      </footer>
    </div>
  );
}
