"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Calendar,
  Users,
  CreditCard,
  Star,
  BarChart3,
  Tag,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

const mainMenu: MenuItem[] = [
  { label: "Dashboard", href: "/admin/dashboard_admin", icon: LayoutDashboard },
  { label: "Rooms", href: "/admin/rooms", icon: Home },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar, badge: 8 },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

const insightsMenu: MenuItem[] = [
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  console.log("user", user);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  useEffect(() => {
    const getMe = async () => {
      const res = await fetch("http://localhost:3001/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      setUser(data);
    };

    getMe();
  }, []);

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = pathname.startsWith(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            isActive
              ? "bg-gray-100 text-gray-900 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      );
    });

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
        <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
          B
        </div>
        <span className="font-medium text-gray-900">Bookify Admin</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-xs text-gray-400 px-3 mb-2 uppercase tracking-wider">
          Main
        </p>
        <div className="space-y-1 mb-6">{renderMenu(mainMenu)}</div>

        <p className="text-xs text-gray-400 px-3 mb-2 uppercase tracking-wider">
          Insights
        </p>
        <div className="space-y-1">{renderMenu(insightsMenu)}</div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
