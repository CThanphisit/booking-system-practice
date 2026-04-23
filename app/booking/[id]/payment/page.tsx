import SlipUploadForm from "@/app/components/payment/SlipUploadForm";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import qrImage from "@/public/qrcode-demo.png";

type Props = {
  params: { id: string };
};

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  console.log("res", res);

  // handle error จาก backend
  if (res.status === 401) redirect("/login");
  if (res.status === 403 || res.status === 404) notFound();
  if (!res.ok) throw new Error("ดึงข้อมูลการจองไม่สำเร็จ");

  const booking = await res.json();

  // ถ้า booking ไม่ได้อยู่สถานะ PENDING → ไม่ต้องชำระแล้ว
  if (booking.status !== "PENDING") {
    redirect(`/my-bookings`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">ชำระเงิน</h1>
          <p className="text-gray-500 text-sm">
            กรุณาสแกน QR และอัปโหลดสลิปเพื่อยืนยันการชำระเงิน
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          {/* QR Section */}
          <div className="space-y-3 text-center">
            <h2 className="font-semibold text-lg">สแกนเพื่อชำระเงิน</h2>
            <div className="flex justify-center">
              <Image
                src={qrImage}
                alt="qr"
                className="w-full max-w-xs rounded-lg border"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Booking Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">รหัสการจอง</span>
              <span className="font-medium">{booking.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">จำนวนเงิน</span>
              <span className="font-semibold text-lg text-green-600">
                {Number(booking.totalAmount).toLocaleString()} บาท
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Upload Section */}
          <div>
            <h2 className="font-semibold mb-3">อัปโหลดสลิป</h2>
            <SlipUploadForm
              bookingId={id}
              totalAmount={Number(booking.totalAmount)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
