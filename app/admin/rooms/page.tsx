"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, LayoutGrid, Table2 } from "lucide-react";
import { Room, RoomStatus, RoomTypeName } from "@/types";
import { mockRooms } from "@/lib/mock-rooms";
import Header from "@/app/components/admin/Header";
import RoomCard from "@/app/components/admin/rooms/RoomCard";
import RoomStatusBadge from "@/app/components/admin/rooms/RoomStatusBadge";
import RoomFormModal from "@/app/components/admin/rooms/RoomFormModal";

const ROOM_TYPES: { label: string; value: RoomTypeName | "ALL" }[] = [
  { label: "ทุกประเภท", value: "ALL" },
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Family", value: "Family" },
];

const STATUS_FILTERS: { label: string; value: RoomStatus | "ALL" }[] = [
  { label: "ทุกสถานะ", value: "ALL" },
  { label: "ว่าง", value: "AVAILABLE" },
  { label: "ซ่อมบำรุง", value: "MAINTENANCE" },
  { label: "ปิดใช้งาน", value: "INACTIVE" },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<RoomTypeName | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "ALL">("ALL");
  const [view, setView] = useState<"grid" | "table">("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  console.log("editingRoom", editingRoom);

  useEffect(() => {
    const getRooms = async () => {
      const res = await fetch("http://localhost:3001/room");
      const data = await res.json();
      console.log("data", data);
      setRooms(data);
    };
    getRooms();
  }, []);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch =
        r.roomNumber.includes(search) ||
        r.type.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "ALL" || r.type === typeFilter;
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [rooms, search, typeFilter, statusFilter]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: rooms.length,
      available: rooms.filter((r) => r.status === "AVAILABLE").length,
      maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
      inactive: rooms.filter((r) => r.status === "INACTIVE").length,
    }),
    [rooms],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };
  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  interface RoomFormValues {
    roomNumber: string;
    floor: number;
    type: string;
    maxOccupancy: number;
    pricePerNight: number;
    status: string;
    description: string;
    images: [];
  }

  const handleSave = async (values: RoomFormValues) => {
    console.log("handleSaveData", values);
    // if (editingRoom) {
    //   setRooms((prev) =>
    //     prev.map((r) => (r.id === editingRoom.id ? { ...r, ...values } : r)),
    //   );
    // } else {
    //   const newRoom: Room = {
    //     ...values,
    //     id: String(Date.now()),
    //     images: [],
    //     createdAt: new Date().toISOString().slice(0, 10),
    //   };
    //   setRooms((prev) => [newRoom, ...prev]);
    // }

    if (editingRoom) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room/${editingRoom.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include", // ส่งคุกกี้ไปด้วย
        },
      );

      if (!res.ok) {
        throw new Error("แก้ไขห้องไม่สำเร็จ");
      }

      // revalidatePath("/admin/rooms");
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", // ส่งคุกกี้ไปด้วย
      });

      if (!res.ok) {
        throw new Error("สร้างห้องไม่สำเร็จ");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("ต้องการลบห้องนี้ใช่ไหม?")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("ลบห้องไม่สำเร็จ");
      }
    }
  };

  return (
    <>
      <Header
        title="Rooms"
        subtitle="จัดการห้องพักทั้งหมด"
        showFilters={false}
      />

      <main className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Summary cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "ห้องทั้งหมด",
              value: stats.total,
              color: "bg-indigo-50 text-indigo-700",
            },
            {
              label: "ว่าง",
              value: stats.available,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "ซ่อมบำรุง",
              value: stats.maintenance,
              color: "bg-amber-50 text-amber-700",
            },
            {
              label: "ปิดใช้งาน",
              value: stats.inactive,
              color: "bg-gray-100 text-gray-500",
            },
          ].map((s) => (
            <div key={s.label} className={`rounded-lg px-4 py-3 ${s.color}`}>
              <p className="text-xs opacity-80">{s.label}</p>
              <p className="text-2xl font-medium mt-0.5">{s.value}</p>
            </div>
          ))}
        </section>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาหมายเลขห้อง, ประเภท..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as RoomTypeName | "ALL")
            }
            className="text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ROOM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as RoomStatus | "ALL")
            }
            className="text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* View toggle */}
          {/* <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:bg-gray-50"}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2 ${view === "table" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:bg-gray-50"}`}
              title="Table view"
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div> */}

          {/* Add button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มห้อง
          </button>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500">พบ {filtered.length} ห้อง</p>

        {/* ── Table View ──────────────────────────────────────────────────────── */}
        {view === "table" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">ห้อง</th>
                    <th className="px-5 py-3 font-medium">ประเภท</th>
                    <th className="px-5 py-3 font-medium">ชั้น</th>
                    <th className="px-5 py-3 font-medium">จำนวนคน</th>
                    <th className="px-5 py-3 font-medium">ราคา/คืน</th>
                    <th className="px-5 py-3 font-medium">สถานะ</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        ห้อง {room.roomNumber}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{room.type}</td>
                      <td className="px-5 py-3 text-gray-600">{room.floor}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {room.maxOccupancy} คน
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        ฿{room.pricePerNight.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <RoomStatusBadge status={room.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(room)}
                            className="text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-gray-400 text-sm"
                      >
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Form Modal */}
      <RoomFormModal
        open={modalOpen}
        room={editingRoom}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
