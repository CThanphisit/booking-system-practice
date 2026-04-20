"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Standard", value: 45, color: "#6366f1" },
  { name: "Deluxe", value: 30, color: "#10b981" },
  { name: "Suite", value: 15, color: "#f59e0b" },
  { name: "Family", value: 10, color: "#94a3b8" },
];

export default function RoomTypeChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        การจองตามประเภทห้อง
      </h3>

      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-medium text-gray-900">{total}%</p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="text-gray-500 font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
