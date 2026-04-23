"use client";

import { useState, useMemo, useEffect } from "react";
import { mockRooms } from "@/lib/mock-rooms";
import { RoomTypeName, RoomValues, SearchParams } from "@/types";
import { differenceInCalendarDays, parseISO } from "date-fns";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import RoomFilters from "../components/RoomFilters";
import RoomCard from "../components/RoomCard";

type RoomStatus = "AVAILABLE" | "MAINTENANCE" | "INACTIVE";

export default function HomePage() {
  const [searchParams, setSearchParams] = useState<Partial<SearchParams>>({});
  const [selectedType, setSelectedType] = useState<RoomTypeName | "ALL">("ALL");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(99999);
  const [roomsData, setRoomsData] = useState<RoomValues[]>([]);
  console.log("roomsData", roomsData);

  const getListRooms = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room`, {
      method: "GET",
      // credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setRoomsData(data);
    }
  };

  useEffect(() => {
    const load = async () => {
      await getListRooms();
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
    // scroll ลงไปที่รายการห้อง
    document
      .getElementById("rooms-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter ห้องพัก
  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
      const matchType = selectedType === "ALL" || room.type === selectedType;
      const matchPrice = room.pricePerNight <= selectedMaxPrice;
      const matchGuests =
        !searchParams.guests || room.maxOccupancy >= searchParams.guests;
      return matchType && matchPrice && matchGuests;
    });
  }, [selectedType, selectedMaxPrice, searchParams.guests, roomsData]);

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
            totalCount={roomsData.length}
            filteredCount={filteredRooms.length}
            onTypeChange={setSelectedType}
            onPriceChange={setSelectedMaxPrice}
          />
        </div>

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
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
