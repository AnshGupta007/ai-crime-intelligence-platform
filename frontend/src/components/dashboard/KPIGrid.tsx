import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, FileText, MapPin, AlertTriangle, CalendarClock } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { KpiSummary } from "@/types";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{formatNumber(display)}{suffix}</>;
}

const cards = [
  {
    key: "total_firs" as const,
    label: "Total FIRs",
    icon: FileText,
    gradient: "from-blue-600 to-blue-400",
    trendKey: "mom_change" as const,
  },
  {
    key: "today_firs" as const,
    label: "Today's FIRs",
    icon: CalendarClock,
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    key: "active_hotspots" as const,
    label: "Active Hotspots",
    icon: MapPin,
    gradient: "from-amber-600 to-amber-400",
  },
  {
    key: "critical_alerts" as const,
    label: "Critical Alerts",
    icon: AlertTriangle,
    gradient: "from-red-600 to-red-400",
  },
];

export default function KPIGrid({ data }: { data: KpiSummary }) {
  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = data[card.key];
        const trend = card.trendKey ? data[card.trendKey] : null;

        return (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg transition-transform hover:scale-[1.02]`}
          >
            <div className="absolute right-3 top-3 opacity-20">
              <Icon className="h-12 w-12" />
            </div>
            <p className="text-sm font-medium text-white/80">{card.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              <AnimatedCounter value={value} />
            </p>
            {trend !== null && (
              <div className="mt-2 flex items-center gap-1 text-sm text-white/80">
                {trend >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>
                  {trend > 0 ? "+" : ""}{trend}% MoM
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
