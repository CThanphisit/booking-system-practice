import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  change?: {
    value: string;
    type: "up" | "down";
  };
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
};

export default function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconBg = "bg-indigo-50",
  iconColor = "text-indigo-600",
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-md ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
      </div>

      <p className="text-2xl font-medium text-gray-900 mb-2">{value}</p>

      {change && (
        <div className="flex items-center gap-1 text-xs">
          {change.type === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
          )}
          <span
            className={
              change.type === "up" ? "text-emerald-600" : "text-red-600"
            }
          >
            {change.value}
          </span>
        </div>
      )}
    </div>
  );
}
