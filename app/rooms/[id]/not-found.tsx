import Link from "next/link";
import { BedDouble } from "lucide-react";

export default function RoomNotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
        <BedDouble className="w-8 h-8 text-stone-400" />
      </div>
      <h1 className="text-2xl font-bold text-stone-900 mb-2">ไม่พบห้องพักนี้</h1>
      <p className="text-stone-500 text-sm mb-8">อาจถูกลบหรือ URL ไม่ถูกต้อง</p>
      <Link
        href="/"
        className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-stone-700 transition-colors"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
