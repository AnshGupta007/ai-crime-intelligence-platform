import { motion } from "framer-motion";
import type { RiskScore } from "@/types";

interface RiskHeatmapProps {
  data: RiskScore[];
  loading?: boolean;
  onDistrictClick?: (district: RiskScore) => void;
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white border-red-600",
  HIGH: "bg-orange-500 text-white border-orange-600",
  MEDIUM: "bg-amber-400 text-white border-amber-500",
  LOW: "bg-green-500 text-white border-green-600",
};

const RISK_BG_LIGHT: Record<string, string> = {
  CRITICAL: "bg-red-50 border-red-200",
  HIGH: "bg-orange-50 border-orange-200",
  MEDIUM: "bg-amber-50 border-amber-200",
  LOW: "bg-green-50 border-green-200",
};

export default function RiskHeatmap({ data, loading, onDistrictClick }: RiskHeatmapProps) {
  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Calculating risk scores...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border bg-white">
        <p className="text-sm text-muted-foreground">No risk data available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {data.map((d, i) => (
        <motion.button
          key={d.district_id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.02 }}
          onClick={() => onDistrictClick?.(d)}
          className={`rounded-xl border p-3 text-left transition-all hover:shadow-md ${RISK_BG_LIGHT[d.risk_level] || "bg-slate-50 border-slate-200"}`}
        >
          <p className="text-[10px] font-medium text-muted-foreground truncate">{d.district_name}</p>
          <p className="text-lg font-bold mt-0.5">{d.risk_score.toFixed(1)}</p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold mt-1 ${
              RISK_COLORS[d.risk_level] || "bg-slate-200 text-slate-700"
            }`}
          >
            {d.risk_level}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
