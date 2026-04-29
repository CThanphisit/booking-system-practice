import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Booking, MyBooking } from "@/types";
import Navbar from "@/app/components/Navbar";
import BookingDetailInfo from "@/app/components/booking-detail/BookingDetailInfo";
import BookingDetailPayment from "@/app/components/booking-detail/BookingDetailPayment";
import BookingDetailActions from "@/app/components/booking-detail/BookingDetailActions";
import BookingDetailSummaryClient from "@/app/components/booking-detail/BookingDetailSummaryClient";
import BookingStatusBadge from "@/app/components/my-booking/BookingStatusBadge";

type Props = {
  params: { id: string };
};

async function getBooking(id: string): Promise<MyBooking> {
  const cookieStore = await cookies();
  const cookieHeader = await cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}booking/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (res.status === 403 || res.status === 404) notFound();
  if (!res.ok) throw new Error("ดึงข้อมูลการจองไม่สำเร็จ");

  return res.json();
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBooking(id);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Back */}
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          การจองของฉัน
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-stone-900">
                รายละเอียดการจอง
              </h1>
              {/* <BookingStatusBadge status={booking.status} /> */}
              <BookingStatusBadge
                status={booking.status}
                paymentStatus={booking.payment?.status}
              />
            </div>
            <p className="text-stone-400 text-sm font-mono">{booking.code}</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: ข้อมูลการจอง + payment ── */}
          <div className="lg:col-span-2 space-y-6">
            <BookingDetailInfo booking={booking} />
            <BookingDetailPayment booking={booking} />
            <BookingDetailActions booking={booking} />
          </div>

          {/* ── Right: สรุปราคา + booking code ── */}
          <div className="lg:col-span-1">
            {/* ใช้ Client Component เพราะต้องการ copy to clipboard */}
            <BookingDetailSummaryWrapper booking={booking} />
          </div>
        </div>
      </main>

      <footer className="bg-stone-950 text-stone-500 text-center text-sm py-8">
        <p>© 2026 Bookify · ระบบจองที่พักออนไลน์</p>
      </footer>
    </div>
  );
}

// Wrapper เพราะ BookingDetailSummary ใช้ client interaction (copy)
function BookingDetailSummaryWrapper({ booking }: { booking: MyBooking }) {
  return <BookingDetailSummaryClient booking={booking} />;
}

// inline client component สำหรับ copy action
