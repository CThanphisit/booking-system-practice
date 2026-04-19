"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    const getMe = async () => {
      const res = await fetch("http://localhost:3001/auth/me", {
        method: "GET",
        credentials: "include",
      });

      console.log("resGetMe", res);
      console.log("status:", res.status);

      const data = await res.json();
      console.log("data:", data);
    };

    getMe();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Welcome to your dashboard! Here you can manage your account and view
        your data.
      </p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
