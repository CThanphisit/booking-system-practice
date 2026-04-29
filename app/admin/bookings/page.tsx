"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Download, Eye } from "lucide-react";
import { mockBookings } from "@/lib/mock-bookings";
import { Booking, BookingStatus } from "@/types";
import Header from "@/app/components/admin/Header";
import PaymentBadge from "@/app/components/admin/bookings/PaymentBadge";
import BookingStatusBadge from "@/app/components/admin/bookings/BookingStatusBadge";
import BookingDetailModal from "@/app/components/admin/bookings/BookingDetailModal";
import { format, parseISO } from "date-fns";

type Tab = "ALL" | BookingStatus;

const TABS: { label: string; value: Tab }[] = [
  { label: "ทั้งหมด", value: "ALL" },
  { label: "รอยืนยัน", value: "PENDING" },
  { label: "ยืนยันแล้ว", value: "CONFIRMED" },
  { label: "เช็คอิน", value: "CHECKED_IN" },
  { label: "เสร็จสิ้น", value: "COMPLETED" },
  { label: "ยกเลิก", value: "CANCELLED" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<Tab>("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "checkInDate" | "totalAmount"
  >("createdAt");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const getListBookings = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    }
  };

  useEffect(() => {
    const load = async () => {
      await getListBookings();
    };

    load();
  }, []);

  // ── Filter + Sort ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const list = bookings?.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        b.code.toLowerCase().includes(q) ||
        b.user.first_name.toLowerCase().includes(q) ||
        b.user.email.toLowerCase().includes(q) ||
        b.room.roomNumber.includes(q);
      const matchTab = tab === "ALL" || b.status === tab;
      const matchFrom = !dateFrom || b.checkInDate >= dateFrom;
      const matchTo = !dateTo || b.checkInDate <= dateTo;
      return matchSearch && matchTab && matchFrom && matchTo;
    });

    list.sort((a, b) => {
      if (sortBy === "totalAmount") return +b.totalAmount - +a.totalAmount;
      return b[sortBy] > a[sortBy] ? 1 : -1;
    });

    return list;
  }, [bookings, search, tab, dateFrom, dateTo, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Stats per tab ────────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => {
    const counts: Record<Tab, number> = {
      ALL: bookings.length,
      PENDING: 0,
      CONFIRMED: 0,
      CHECKED_IN: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    bookings.forEach((b) => {
      counts[b.status]++;
    });
    return counts;
  }, [bookings]);

  const totalRevenue = useMemo(
    () =>
      bookings
        .filter((b) => b.payment?.status === "APPROVED")
        .reduce((s, b) => s + +b.totalAmount, 0),
    [bookings],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    // setBookings((prev) =>
    //   prev.map((b) => (b.id === id ? { ...b, status } : b)),
    // );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        credentials: "include",
      },
    );

    if (res.ok) {
      await getListBookings();
    } else {
      console.log("errUpdate", res);
    }
  };

  const handleTabChange = (value: Tab) => {
    setTab(value);
    setPage(1);
  };

  const handleApprovePayment = async (id: string, adminId: string) => {
    try {
      const res = await fetch(
        `
      ${process.env.NEXT_PUBLIC_API_URL}/payment/admin/${id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "APPROVE", adminId: adminId }),
          credentials: "include",
        },
      );

      if (res.ok) {
        await getListBookings();
      } else {
        console.log("ApproveError", res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectPayment = async (
    id: string,
    adminId: string,
    note: string,
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/admin/${id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "REJECT",
            adminId: adminId,
            note: note,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        await getListBookings();
      } else {
        console.log("RejectError", res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header
        title="Bookings"
        subtitle="จัดการการจองทั้งหมด"
        showFilters={false}
      />

      <main className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Summary cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">การจองทั้งหมด</p>
            <p className="text-2xl font-medium text-gray-900">
              {bookings.length}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <p className="text-xs text-amber-700 mb-1">รอยืนยัน</p>
            <p className="text-2xl font-medium text-amber-700">
              {tabCounts.PENDING}
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <p className="text-xs text-indigo-700 mb-1">กำลังเข้าพัก</p>
            <p className="text-2xl font-medium text-indigo-700">
              {tabCounts.CHECKED_IN}
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
            <p className="text-xs text-emerald-700 mb-1">
              รายได้รวม (ชำระแล้ว)
            </p>
            <p className="text-xl font-medium text-emerald-700">
              ฿{totalRevenue.toLocaleString()}
            </p>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === t.value
                  ? "border-indigo-600 text-indigo-600 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === t.value
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tabCounts[t.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา booking code, ชื่อลูกค้า, ห้อง..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date from */}
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-500 text-xs whitespace-nowrap">
              Check-in ตั้งแต่
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-500 text-xs whitespace-nowrap">
              ถึง
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt">เรียงตามวันที่จอง</option>
            <option value="checkIn">เรียงตาม Check-in</option>
            <option value="totalAmount">เรียงตามราคา</option>
          </select>

          {/* Export */}
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">ลูกค้า</th>
                  <th className="px-5 py-3 font-medium">ห้อง</th>
                  <th className="px-5 py-3 font-medium">Check-in</th>
                  <th className="px-5 py-3 font-medium">Check-out</th>
                  <th className="px-5 py-3 font-medium">คืน</th>
                  <th className="px-5 py-3 font-medium">ราคารวม</th>
                  <th className="px-5 py-3 font-medium">ชำระเงิน</th>
                  <th className="px-5 py-3 font-medium">สถานะ</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((booking) => {
                  const checkInParse = parseISO(booking.checkInDate);
                  const checkOutParse = parseISO(booking.checkOutDate);

                  const checkInDate = format(checkInParse, "dd/MM/yyyy");
                  const checkOutDate = format(checkOutParse, "dd/MM/yyyy");
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-gray-700">
                        {booking.code}
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-gray-900 font-medium">
                            {booking.user.first_name} {booking.user.last_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {booking.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-gray-700">
                            ห้อง {booking.room.roomNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            {booking.room.type}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-xs">
                        {checkInDate}
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-xs">
                        {checkOutDate}
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-center">
                        {booking.nights}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        ฿{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <PaymentBadge status={booking.payment?.status} />
                      </td>
                      <td className="px-5 py-3">
                        <BookingStatusBadge status={booking.status} />
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-12 text-gray-400 text-sm"
                    >
                      ไม่พบการจองที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                แสดง {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} จาก{" "}
                {filtered.length} รายการ
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-100"
                >
                  ก่อนหน้า
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 text-xs border rounded-md ${
                        p === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-100"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdateStatus={handleUpdateStatus}
        onApprovePayment={handleApprovePayment}
        onRejectPayment={handleRejectPayment}
      />
    </>
  );
}
