import { useEffect } from "react";
import { motion } from "framer-motion";
import useDashboard from "@/hooks/useDashboard";
import KPIGrid from "@/components/dashboard/KPIGrid";
import TrendChart from "@/components/dashboard/TrendChart";
import CrimeCategoryChart from "@/components/dashboard/CrimeCategoryChart";
import AlertFeed from "@/components/dashboard/AlertFeed";
import RecentCasesTable from "@/components/dashboard/RecentCasesTable";
import { useToastStore } from "@/store/toast";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { kpis, trends, categories, recentAlerts, recentCases, loading } = useDashboard();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (!loading && kpis) {
      if (kpis.critical_alerts > 0) {
        addToast({ type: "warning", title: `${kpis.critical_alerts} critical alerts`, message: "Review anomaly detection page for details." });
      }
    }
  }, [loading, kpis]);

  if (loading && !kpis) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[372px] animate-pulse rounded-xl bg-slate-200" />
          <div className="h-[372px] animate-pulse rounded-xl bg-slate-200" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[372px] animate-pulse rounded-xl bg-slate-200" />
          <div className="h-[372px] animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <span className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString("en-IN")}
        </span>
      </motion.div>

      {kpis && (
        <motion.div variants={item}>
          <KPIGrid data={kpis} />
        </motion.div>
      )}

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={trends} />
        <CrimeCategoryChart data={categories} />
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <AlertFeed data={recentAlerts} />
        <RecentCasesTable data={recentCases} />
      </motion.div>
    </motion.div>
  );
}
