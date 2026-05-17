"use client";

import { useState } from "react";
import { Mail, Phone, Shield, Pencil } from "lucide-react";
import Navbar from "../components/Navbar";
import EditProfileModal from "../components/profile/EditProfileModal";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, isLoading, checkAuth } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-stone-200 rounded-xl" />
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-stone-200" />
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-stone-200 rounded" />
                  <div className="h-4 w-24 bg-stone-200 rounded" />
                </div>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-full bg-stone-100 rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">โปรไฟล์</h1>
            <p className="text-stone-500 text-sm mt-1">ข้อมูลบัญชีของคุณ</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Pencil className="w-4 h-4" />
            แก้ไขข้อมูล
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          {/* Avatar section */}
          <div className="px-6 py-6 flex items-center gap-5 border-b border-stone-100">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 text-xl font-bold">{initials}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                {user.first_name} {user.last_name}
              </h2>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                <Shield className="w-3 h-3" />
                {user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "สมาชิก"}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="divide-y divide-stone-100">
            <InfoRow
              icon={<Mail className="w-4 h-4 text-stone-400" />}
              label="อีเมล"
              value={user.email}
            />
            <InfoRow
              icon={<Phone className="w-4 h-4 text-stone-400" />}
              label="เบอร์โทรศัพท์"
              value={user.phoneNumber || "—"}
            />
          </div>
        </div>
      </main>

      <footer className="bg-stone-950 text-stone-500 text-center text-sm py-8">
        <p>© 2026 StayEase · ระบบจองที่พักออนไลน์</p>
      </footer>

      <EditProfileModal
        open={modalOpen}
        user={user}
        onClose={() => setModalOpen(false)}
        onSuccess={checkAuth}
      />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-400 mb-0.5">{label}</p>
        <p className="text-sm text-stone-800 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
