"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value: number) => `฿${(value / 1000).toFixed(0)}k`;

const THAI_MONTHS: Record<string, string> = {
  Jan: "ม.ค.",
  Feb: "ก.พ.",
  Mar: "มี.ค.",
  Apr: "เม.ย.",
  May: "พ.ค.",
  Jun: "มิ.ย.",
  Jul: "ก.ค.",
  Aug: "ส.ค.",
  Sep: "ก.ย.",
  Oct: "ต.ค.",
  Nov: "พ.ย.",
  Dec: "ธ.ค.",
};

const formatThaiDate = (value: string) => {
  const [day, month] = value.split(" ");
  return `${day} ${THAI_MONTHS[month] ?? month}`;
};

export default function RevenueChart() {
  const [values, setValues] = useState<{ date: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/proxy/dashboard/revenue-chart?months=12`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const { data: revenueData, labels } = await res.json();
      const formattedData = labels.map((label: string, i: number) => ({
        date: label,
        revenue: revenueData[i],
      }));
      setValues(formattedData);
    } else {
      console.error("Failed to fetch revenue data");
    }
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await getData();
    };
    load();
  }, []);

  return (
    <>
      {loading ? (
        <Skeleton className="w-full h-92 rounded-lg" />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                รายได้ 30 วันล่าสุด
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                รายได้รวม ฿
                {values
                  .reduce((sum, item) => sum + item.revenue, 0)
                  .toLocaleString("th-TH")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-gray-600">รายได้</span>
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={values.length ? values : []}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatThaiDate}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickFormatter={formatCurrency}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelFormatter={(label) => formatThaiDate(String(label))}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="รายได้"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
