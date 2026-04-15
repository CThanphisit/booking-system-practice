"use client";

import { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-sand-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <MapPin size={16} className="text-white" fill="white" />
          </div>
          <span className="font-display text-xl font-semibold text-gray-900 tracking-tight">
            StayBook
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          {["ห้องพัก", "โปรโมชั่น", "เกี่ยวกับเรา", "ติดต่อ"].map((item) => (
            <Link
              key={item}
              href="#"
              className="hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <button className="text-sm px-4 py-2 rounded-lg text-gray-600 hover:bg-sand-100 transition-colors duration-150">
              เข้าสู่ระบบ
            </button>
          </Link>
          {/* <button className="text-sm px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-150 font-medium">
            สมัครสมาชิก
          </button> */}
          <Link href="/register">
            <button className="border border-gray-200 text-sm px-4 py-2 rounded-lg text-gray-600 hover:bg-sand-100 transition-colors duration-150">
              สมัครสมาชิก
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-sand-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-sand-100 px-4 py-4 space-y-3">
          {["ห้องพัก", "โปรโมชั่น", "เกี่ยวกับเรา", "ติดต่อ"].map((item) => (
            <Link
              key={item}
              href="#"
              className="block text-sm text-gray-600 py-2 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-sand-100">
            <button className="w-full text-sm px-4 py-2.5 rounded-lg border border-sand-200 text-gray-700 hover:bg-sand-50">
              เข้าสู่ระบบ
            </button>
            <button className="w-full text-sm px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600">
              สมัครสมาชิก
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
