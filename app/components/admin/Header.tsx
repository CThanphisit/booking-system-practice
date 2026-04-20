"use client";

import { Bell, Search, Download } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
};

export default function Header({ title, subtitle, showFilters = true }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title */}
        <div>
          <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter dropdown */}
          {showFilters && (
            <select className="text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>30 วันล่าสุด</option>
              <option>7 วันล่าสุด</option>
              <option>เดือนนี้</option>
              <option>ปีนี้</option>
            </select>
          )}

          {/* Export */}
          {showFilters && (
            <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          )}

          {/* Notifications */}
          <button
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
