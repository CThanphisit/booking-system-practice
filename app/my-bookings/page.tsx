import Link from "next/link";
import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import MyBookingsClient from "../components/my-booking/MyBookingsClient";
import { cookies } from "next/headers";

export default async function MyBookingsPage() {
  const cookieStore = await cookies();

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}booking`, {
  //   headers: {
  //     cookie: cookieStore.toString(),
  //   },
  // });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/proxy/booking`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  console.log("resGetMyBooking", res);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">การจองของฉัน</h1>
            <p className="text-stone-500 text-sm mt-1">
              ประวัติและการจองที่กำลังจะมาถึงทั้งหมด
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            จองเพิ่ม
          </Link>
        </div>

        {/* Client Component รับข้อมูลมาจาก Server */}
        <MyBookingsClient initialBookings={res.ok ? data : []} />
      </main>

      <footer className="bg-stone-950 text-stone-500 text-center text-sm py-8">
        <p>© 2026 Bookify · ระบบจองที่พักออนไลน์</p>
      </footer>
    </div>
  );
}
