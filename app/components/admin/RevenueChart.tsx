"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// mock data — เปลี่ยนเป็นข้อมูลจริงจาก API ภายหลัง
const data = [
  { date: "1", revenue: 8500 },
  { date: "3", revenue: 11000 },
  { date: "5", revenue: 12800 },
  { date: "7", revenue: 13500 },
  { date: "9", revenue: 16200 },
  { date: "11", revenue: 17500 },
  { date: "13", revenue: 16500 },
  { date: "15", revenue: 20100 },
  { date: "17", revenue: 17500 },
  { date: "19", revenue: 21200 },
  { date: "21", revenue: 22500 },
  { date: "23", revenue: 19500 },
  { date: "25", revenue: 23800 },
  { date: "27", revenue: 20800 },
  { date: "30", revenue: 22800 },
];

const formatCurrency = (value: number) => `฿${(value / 1000).toFixed(0)}k`;

export default function RevenueChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">รายได้ 30 วันล่าสุด</h3>
          <p className="text-xs text-gray-500 mt-0.5">รายได้รวม ฿428,500</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-gray-600">Revenue</span>
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
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
              formatter={(value: number) => [`฿${value.toLocaleString()}`, "Revenue"]}
              labelFormatter={(label) => `วันที่ ${label}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
