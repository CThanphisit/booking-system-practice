import { Clock, CheckCircle2, XCircle, Info } from "lucide-react";

const policies = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "เวลา Check-in / Check-out",
    items: ["Check-in: 14:00 – 22:00 น.", "Check-out: ก่อน 12:00 น."],
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "อนุญาต",
    items: ["สัตว์เลี้ยงขนาดเล็ก (แจ้งล่วงหน้า)", "ผู้เข้าพักชาวต่างชาติ"],
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: <XCircle className="w-5 h-5" />,
    title: "ไม่อนุญาต",
    items: ["สูบบุหรี่ในห้องพัก", "จัดงานปาร์ตี้"],
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: <Info className="w-5 h-5" />,
    title: "นโยบายยกเลิก",
    items: [
      "ยกเลิกก่อน 48 ชม. — คืนเงิน 100%",
      "ยกเลิกน้อยกว่า 48 ชม. — คืนเงิน 50%",
      "No-show — ไม่คืนเงิน",
    ],
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function RoomPolicy() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 mb-4">นโยบายห้องพัก</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {policies.map((p) => (
          <div
            key={p.title}
            className="border border-stone-100 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`${p.color} ${p.bg} p-1.5 rounded-lg`}>{p.icon}</span>
              <h3 className="font-medium text-stone-800 text-sm">{p.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {p.items.map((item) => (
                <li key={item} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-stone-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
