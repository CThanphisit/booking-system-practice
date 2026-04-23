import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { mockRooms } from "@/lib/mock-rooms";
import Navbar from "@/app/components/Navbar";
import RoomImageGallery from "@/app/components/room/RoomImageGallery";
import RoomInfo from "@/app/components/room/RoomInfo";
import RoomAmenities from "@/app/components/room/RoomAmenities";
import RoomPolicy from "@/app/components/room/RoomPolicy";
import BookingPanel from "@/app/components/room/BookingPanel";

type Props = {
  params: { id: string };
};

// ── Server Component — ดึงข้อมูลห้อง ────────────────────────────────────────
export default async function RoomDetailPage({ params }: Props) {
  const { id } = await params;

  const fetchData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/room/${id}`,
  );
  console.log("fetchData", fetchData);

  const data = await fetchData.json();
  console.log("data", data);

  // if (!room) notFound();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          กลับหน้าหลัก
        </Link>

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <RoomImageGallery
            images={data.images}
            roomName={`ห้อง ${data.roomNumber}`}
          />
        </div>

        {/* ── Content + Sidebar ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Room content (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            <RoomInfo room={data} />
            {/* <RoomAmenities amenities={room.amenities} /> */}
            <RoomPolicy />
          </div>

          {/* Right: Booking panel (1/3) */}
          <div className="lg:col-span-1">
            <BookingPanel room={data} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 text-center text-sm py-8">
        <p>© 2026 Bookify · ระบบจองที่พักออนไลน์</p>
      </footer>
    </div>
  );
}

// ── Static Params (ถ้าใช้ static export) ─────────────────────────────────────
export function generateStaticParams() {
  return mockRooms.map((r) => ({ id: r.id }));
}
