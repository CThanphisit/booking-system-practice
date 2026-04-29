"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, BanknoteIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import PaymentStatusBadge from "./PaymentStatusBadge";
import SlipReviewModal, { PaymentDetail } from "./SlipReviewModal";
import RefundConfirmModal from "./RefundConfirmModal";

type Tab =
  | "WAITING_REVIEW"
  | "REFUND_PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REFUNDED";

const TABS: { value: Tab; label: string }[] = [
  { value: "WAITING_REVIEW", label: "รอตรวจสลิป" },
  { value: "REFUND_PENDING", label: "รอคืนเงิน" },
  { value: "APPROVED", label: "อนุมัติแล้ว" },
  { value: "REJECTED", label: "ปฏิเสธแล้ว" },
  { value: "REFUNDED", label: "คืนเงินแล้ว" },
];

type FullPayment = PaymentDetail & {
  status: Tab;
  refundAmount: string | null;
  refundBankName: string | null;
  refundBankAccount: string | null;
  refundBankAccountName: string | null;
  refundNote: string | null;
  reviewedAt: string | null;
  refundedAt: string | null;
};

type Props = { initialPayments: FullPayment[] };

export default function PaymentsClient({ initialPayments }: Props) {
  const router = useRouter();
  const [payments, setPayments] = useState<FullPayment[]>(initialPayments);
  const [tab, setTab] = useState<Tab>("WAITING_REVIEW");
  const [search, setSearch] = useState("");
  const [reviewTarget, setReviewTarget] = useState<FullPayment | null>(null);
  const [refundTarget, setRefundTarget] = useState<FullPayment | null>(null);

  const tabCount = (t: Tab) => payments.filter((p) => p.status === t).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return payments
      .filter((p) => p.status === tab)
      .filter(
        (p) =>
          !q ||
          p.booking.code.toLowerCase().includes(q) ||
          p.booking.user.first_name.toLowerCase().includes(q) ||
          p.booking.user.last_name.toLowerCase().includes(q) ||
          p.booking.user.email.toLowerCase().includes(q),
      );
  }, [payments, tab, search]);

  const handleApprove = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}payment/admin/${id}/review`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      },
    );

    if (res.ok) {
      router.refresh();
    }
  };

  const handleReject = async (id: string, note: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}payment/admin/${id}/review`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", note }),
      },
    );
    if (res.ok) {
      router.refresh();
    }
  };

  const handleConfirmRefund = async (id: string, note: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}payment/admin/${id}/refund`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note }),
      },
    );
    router.refresh();
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {TABS.map((t) => {
          const count = tabCount(t.value);
          const isActive = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-xl px-4 py-3 text-left transition-all ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <p
                className={`text-2xl font-bold ${isActive ? "text-white" : "text-gray-900"}`}
              >
                {count}
              </p>
              <p
                className={`text-xs mt-0.5 ${isActive ? "text-gray-300" : "text-gray-500"}`}
              >
                {t.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหา booking code, ชื่อลูกค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">ลูกค้า</th>
                <th className="px-5 py-3 font-medium">ห้อง</th>
                <th className="px-5 py-3 font-medium">วันที่</th>
                <th className="px-5 py-3 font-medium">ยอด</th>
                <th className="px-5 py-3 font-medium">สถานะ</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    {p.booking.code}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-gray-900 font-medium">
                      {p.booking.user.first_name} {p.booking.user.last_name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {p.booking.user.email}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    ห้อง {p.booking.room.roomNumber} · {p.booking.room.type}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {format(parseISO(p.createdAt), "d MMM yyyy HH:mm", {
                      locale: th,
                    })}
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    ฿{Number(p.amount).toLocaleString()}
                    {p.refundAmount && p.status === "REFUND_PENDING" && (
                      <p className="text-xs text-indigo-600 font-normal">
                        คืน ฿{Number(p.refundAmount).toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <PaymentStatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3">
                    {p.status === "WAITING_REVIEW" && (
                      <button
                        onClick={() => setReviewTarget(p)}
                        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" /> ตรวจสลิป
                      </button>
                    )}
                    {p.status === "REFUND_PENDING" && (
                      <button
                        onClick={() => setRefundTarget(p)}
                        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <BanknoteIcon className="w-3.5 h-3.5" /> ยืนยันคืนเงิน
                      </button>
                    )}
                    {["APPROVED", "REJECTED", "REFUNDED"].includes(
                      p.status,
                    ) && (
                      <button
                        onClick={() => setReviewTarget(p)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-3.5 h-3.5" /> ดูรายละเอียด
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    ไม่มีรายการ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {reviewTarget && (
        <SlipReviewModal
          payment={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {refundTarget && (
        <RefundConfirmModal
          payment={refundTarget}
          onClose={() => setRefundTarget(null)}
          onConfirm={handleConfirmRefund}
        />
      )}
    </>
  );
}
