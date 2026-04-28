"use client";

import { useState } from "react";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { AdminUser } from "./UserFormModal";

type Props = {
  user: AdminUser;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
};

export default function DeleteUserModal({ user, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm(user.id);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900">ลบผู้ใช้</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-3">
            ต้องการลบผู้ใช้นี้ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm space-y-1">
            <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
            <p className="text-gray-500">{user.email}</p>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
              user.role === "ADMIN" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600"
            }`}>{user.role}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600">
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-200 text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> ลบ</>}
          </button>
        </div>
      </div>
    </div>
  );
}
