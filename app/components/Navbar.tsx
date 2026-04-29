"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Calendar, User, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuth();

  // const [user, setUser] = useState<UserType | null>(null);

  // useEffect(() => {
  //   const getMe = async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     const data = await res.json();
  //     console.log("Me", data);

  //     setUser(data);
  //   };

  //   getMe();
  // }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="text-stone-950 font-bold text-sm">B</span>
            </div>
            <span className="text-white font-semibold tracking-wide text-lg">
              Bookify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {user?.first_name ? (
              <>
                <Link
                  href="/my-bookings"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    pathname === "/my-bookings"
                      ? "bg-stone-800 text-white"
                      : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  การจองของฉัน
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 ml-2 pl-4 border-l border-stone-700"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    {/* <span className="text-amber-400 text-xs font-medium">
                      {MOCK_USER.firstName.slice(0, 1)}
                    </span> */}
                  </div>
                  <span className="text-stone-300 text-sm">
                    {user?.first_name} {user?.last_name}
                  </span>
                </Link>
                <button
                  className="px-4 py-2 text-sm bg-amber-500 text-stone-950 rounded-lg font-medium hover:bg-amber-400 transition-colors cursor-pointer ml-2"
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-stone-400 hover:text-white transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm bg-amber-500 text-stone-950 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-stone-400 hover:text-white p-2"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-stone-900 border-t border-stone-800 px-4 py-4 space-y-2">
          {user?.first_name ? (
            <>
              <Link
                href="/my-bookings"
                className="flex items-center gap-2 py-2 text-stone-300 text-sm"
              >
                <Calendar className="w-4 h-4" /> การจองของฉัน
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 py-2 text-stone-300 text-sm"
              >
                <User className="w-4 h-4" /> โปรไฟล์
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-stone-300 text-sm">
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="block py-2 text-amber-400 text-sm font-medium"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
