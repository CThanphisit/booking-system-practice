import { DollarSign, Calendar, BedDouble, UserPlus } from "lucide-react";
import Header from "../../components/admin/Header";
import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import RoomTypeChart from "../../components/admin/RoomTypeChart";
import BookingTable from "../../components/admin/BookingTable";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        subtitle="ภาพรวมระบบประจำวันที่ 20 เม.ย. 2026"
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="รายได้เดือนนี้"
            value="฿428,500"
            change={{ value: "12.4% vs เดือนก่อน", type: "up" }}
            icon={DollarSign}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            label="การจองวันนี้"
            value="24"
            change={{ value: "8 จากเมื่อวาน", type: "up" }}
            icon={Calendar}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <StatCard
            label="Occupancy rate"
            value="78%"
            change={{ value: "3% vs สัปดาห์ก่อน", type: "down" }}
            icon={BedDouble}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            label="ลูกค้าใหม่"
            value="142"
            change={{ value: "18.6% เดือนนี้", type: "up" }}
            icon={UserPlus}
            iconBg="bg-pink-50"
            iconColor="text-pink-600"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <RoomTypeChart />
        </section>

        {/* Bookings Table */}
        <section>
          <BookingTable />
        </section>
      </main>
    </>
  );
}
