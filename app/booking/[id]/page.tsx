import { notFound, redirect } from "next/navigation";
import { differenceInCalendarDays, parseISO } from "date-fns";
import Navbar from "../../components/Navbar";
import BookingFormClient from "../../components/booking/BookingFormClient";

type Props = {
  params: { id: string };
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
};

export default async function BookingFormPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;

  const fetchData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}room/${id}`);

  const data = await fetchData.json();
  if (!data) notFound();

  // ถ้าห้องไม่ว่าง → redirect กลับ
  if (data.status !== "AVAILABLE") {
    redirect(`/rooms/${data.id}`);
  }

  const checkIn = sParams.checkIn ?? "";
  const checkOut = sParams.checkOut ?? "";
  const guests = Number(sParams.guests ?? 1);

  // validate วันที่ที่ได้รับ
  const isValidDates =
    checkIn &&
    checkOut &&
    checkIn < checkOut &&
    differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)) > 0;

  if (!isValidDates) {
    redirect(`/rooms/${data.id}`);
  }

  const nights = differenceInCalendarDays(
    parseISO(checkOut),
    parseISO(checkIn),
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <h1 className="text-xl font-bold text-stone-900">ยืนยันการจอง</h1>
            <p className="text-stone-500 text-sm mt-1">
              ห้อง {data.roomNumber} · {data.type}
            </p>
          </div>
        </div>

        <BookingFormClient
          room={data}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          guests={guests}
        />
      </div>
    </div>
  );
}
