"use client";

import { useState, useMemo, useEffect } from "react";
import { Room, RoomTypeName, RoomValues, SearchParams } from "@/types";
import { differenceInCalendarDays, parseISO } from "date-fns";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import RoomFilters from "../components/RoomFilters";
import RoomCard from "../components/RoomCard";

type RoomStatus = "AVAILABLE" | "MAINTENANCE" | "INACTIVE";

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<Partial<SearchParams>>({});
  const [selectedType, setSelectedType] = useState<RoomTypeName | "ALL">("ALL");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(99999);

  const fetchRooms = async (params: Partial<SearchParams>) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.checkIn) query.set("checkIn", params.checkIn);
      if (params.checkOut) query.set("checkOut", params.checkOut);
      if (params.guests) query.set("guests", String(params.guests));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room?${query.toString()}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      await fetchRooms({});
    };
    load();
  }, []);

  // คำนวณจำนวนคืนถ้าเลือกวันแล้ว
  const nights = useMemo(() => {
    if (searchParams.checkIn && searchParams.checkOut) {
      const diff = differenceInCalendarDays(
        parseISO(searchParams.checkOut),
        parseISO(searchParams.checkIn),
      );
      return diff > 0 ? diff : null;
    }
    return null;
  }, [searchParams.checkIn, searchParams.checkOut]);

  const handleSearch = (params: Partial<SearchParams>) => {
    setSearchParams(params);
    fetchRooms(params);
    document
      .getElementById("rooms-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter ห้องพัก
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchType = selectedType === "ALL" || room.type === selectedType;
      const matchPrice = Number(room.pricePerNight) <= selectedMaxPrice;
      return matchType && matchPrice;
    });
  }, [rooms, selectedType, selectedMaxPrice]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* <Navbar /> */}

      {/* Hero */}
      <HeroSection onSearch={handleSearch} />

      {/* Rooms Section */}
      <section
        id="rooms-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-px bg-amber-500" />
            <span className="text-amber-600 text-sm tracking-wider uppercase font-medium">
              ห้องพักของเรา
            </span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-2">
            เลือกห้องที่ใช่สำหรับคุณ
          </h2>
          {searchParams.checkIn && searchParams.checkOut && nights && (
            <p className="text-stone-500 text-sm">
              {searchParams.checkIn} → {searchParams.checkOut} · {nights} คืน
              {searchParams.guests && ` · ${searchParams.guests} คน`}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <RoomFilters
            selectedType={selectedType}
            selectedMaxPrice={selectedMaxPrice}
            totalCount={rooms.length}
            filteredCount={filteredRooms.length}
            onTypeChange={setSelectedType}
            onPriceChange={setSelectedMaxPrice}
          />
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-stone-500 text-sm">กำลังค้นหาห้องว่าง...</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                nights={nights ?? undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-stone-500 text-base font-medium">
              ไม่พบห้องที่ตรงกับเงื่อนไข
            </p>
            <p className="text-stone-400 text-sm mt-1">
              ลองปรับ filter หรือเปลี่ยนวันที่ดูครับ
            </p>
            <button
              onClick={() => {
                setSelectedType("ALL");
                setSelectedMaxPrice(99999);
              }}
              className="mt-4 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              ล้าง filter ทั้งหมด
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
