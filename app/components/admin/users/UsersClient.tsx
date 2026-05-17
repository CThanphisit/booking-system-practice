"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import UserFormModal, { AdminUser, UserFormData } from "./UserFormModal";
import DeleteUserModal from "./DeleteUserModal";

const API = process.env.NEXT_PUBLIC_API_URL;

type Props = { users: AdminUser[] };

export default function UsersClient({ users }: Props) {
  const router = useRouter();
  const [formTarget, setFormTarget] = useState<AdminUser | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (data: UserFormData) => {
    // await fetch(`${API}/users`, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    const res = await fetch(`/api/proxy/users`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert("เกิดข้อผิดพลาดในการสร้างผู้ใช้");
    } else {
      setFormTarget(null);
      router.refresh();
    }
  };

  // ── Update ──────────────────────────────────────────────────────────────────
  const handleUpdate = async (data: UserFormData) => {
    if (!formTarget || formTarget === "new") return;
    // await fetch(`${API}/users/${formTarget.id}`, {
    //   method: "PATCH",
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    await fetch(`/api/proxy/users/${formTarget.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    // await fetch(`${API}/users/${id}`, {
    //   method: "DELETE",
    //   credentials: "include",
    // });
    await fetch(`/api/proxy/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    router.refresh();
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{users.length} ผู้ใช้ทั้งหมด</p>
        <button
          onClick={() => setFormTarget("new")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มผู้ใช้
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">ผู้ใช้</th>
                <th className="px-5 py-3 font-medium">เบอร์โทร</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">สร้างเมื่อ</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold shrink-0">
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {user.phoneNumber}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-indigo-50 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {format(parseISO(user.createdAt), "d MMM yyyy", {
                      locale: th,
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setFormTarget(user)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    ยังไม่มีผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <UserFormModal
        open={formTarget !== null}
        user={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
        onSave={formTarget === "new" ? handleCreate : handleUpdate}
      />

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
