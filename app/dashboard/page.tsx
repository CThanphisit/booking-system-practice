"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    const getMe = async () => {
      const res = await fetch("http://localhost:3001/bookings/me", {
        method: "GET",
        credentials: "include",
      });

      console.log("resGetMe", res);
    };
    getMe();
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Welcome to your dashboard! Here you can manage your account and view
        your data.
      </p>
    </div>
  );
}
