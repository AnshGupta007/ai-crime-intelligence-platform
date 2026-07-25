"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import {
  Shield, AlertTriangle, TrendingUp, FileText, Users,
  MapPin, Activity, Brain, Eye, Clock, ArrowUpRight, ArrowDownRight,
  Target, Siren,
} from "lucide-react";
import { cn, formatNumber, formatCurrency, getRiskColor, getRiskBg, getConfidenceColor } from "@/lib/utils";

interface DashboardData {
  overview: {
    totalCases: number;
    pendingCases: number;
    chargesheetedCases: number;
    highProfileCases: number;
    repeatOffenders: number;
    totalAccused: number;
    propertyStolen: number;
    propertyRecovered: number;
    recoveryRate: number;
    aiPredictions: number;
  };
  casesByStatus: { firStatus: string; count: number }[];
  casesByDistrict: { districtCode: number; districtName: string; count: number; latitude: string; longitude: string }[];
  casesByCrimeHead: { crimeHeadCode: number; crimeHeadDescription: string; count: number }[];
  monthlyTrend: {
    current: { month: string; count: number }[];
    previous: { month: string; count: number }[];
  };
  gravityDistribution: { gravity: string; count: number }[];
  hotspots: any[];
  districtRisks: { districtCode: number; districtName: string; riskScore: string; riskLevel: string }[];
}

const COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#06b6d4", "#22d3ee", "#10b981", "#34d399", "#f59e0b", "#fbbf24", "#ef4444", "#f87171", "#8b5cf6", "#a78bfa", "#ec4899", "#f43f5e"];
const STATUS_COLORS: Record<string, string> = {
  under_investigation: "#ef4444",
  chargesheeted: "#6366f1",
  final_report_false: "#94a3b8",
  closed: "#10b981",
  pending_trial: "#f59e0b",
  convicted: "#8b5cf6",
  acquitted: "#06b6d4",
  transferred: "#f97316",
};

const GRAVITY_COLORS: Record<string, string> = { heinous: "#ef4444", serious: "#f59e0b", normal: "#6366f1" };
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading Crime Intelligence Platform...</span>
        </div>
      </div>
    );
  }

  const ov = data.overview;
  const topDistricts = data.casesByDistrict.sort((a, b) => b.count - a.count).slice(0, 10);
  const topCrimes = data.casesByCrimeHead.sort((a, b) => b.count - a.count).slice(0, 8);
  const trendData = data.monthlyTrend.current.map((c, i) => ({
    month: MONTH_NAMES[Number(c.month) - 1],
    current: c.count,
    previous: data.monthlyTrend.previous.find(p => p.month === c.month)?.count ?? 0,
  }));
  const gravityData = data.gravityDistribution;
  const statusData = data.casesByStatus;

  const radarData = topDistricts.slice(0, 6).map(d => ({
    district: d.districtName.split(" ")[0],
    cases: d.count,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-indigo-400" />
            SCRB Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Karnataka State Crime Records Bureau • Real-time Analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">LIVE</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium">{ov.aiPredictions} AI Predictions</span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Total FIRs", value: ov.totalCases, icon: FileText, color: "indigo", gradient: "stat-gradient-blue", change: "+8.2%", up: true },
          { label: "Pending Cases", value: ov.pendingCases, icon: Clock, color: "amber", gradient: "stat-gradient-amber", change: "-3.1%", up: false },
          { label: "Chargesheeted", value: ov.chargesheetedCases, icon: Target, color: "emerald", gradient: "stat-gradient-green", change: "+12.4%", up: true },
          { label: "Repeat Offenders", value: ov.repeatOffenders, icon: Users, color: "red", gradient: "stat-gradient-red", change: "+5.7%", up: true },
          { label: "High Profile", value: ov.highProfileCases, icon: AlertTriangle, color: "violet", gradient: "stat-gradient-purple", change: "+2.3%", up: true },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item} className={cn("glass-card glass-card-hover p-5", stat.gradient)}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("w-5 h-5", `text-${stat.color}-400`)} />
              <span className={cn("text-xs font-medium flex items-center gap-1", stat.up ? "text-emerald-400" : "text-amber-400")}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(stat.value)}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Property Stats Row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 stat-gradient-cyan">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Property Stolen</span>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(ov.propertyStolen)}</div>
        </div>
        <div className="glass-card p-5 stat-gradient-green">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Property Recovered</span>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(ov.propertyRecovered)}</div>
        </div>
        <div className="glass-card p-5 stat-gradient-blue">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400">Recovery Rate</span>
          </div>
          <div className="text-xl font-bold text-white">{ov.recoveryRate}%</div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Monthly Crime Trend — YoY Comparison
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #4f46e5", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={2} fill="url(#gradCurrent)" name="2025" />
              <Area type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={2} fill="url(#gradPrevious)" name="2024" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crime Type Distribution */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <Siren className="w-4 h-4" />
            Crime Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={topCrimes} dataKey="count" nameKey="crimeHeadDescription" cx="50%" cy="50%" outerRadius={100} innerRadius={40} stroke="#0a0f1e" strokeWidth={2} label={({ name, percent }) => `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={{ stroke: "#94a3b8" }}>
                {topCrimes.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #4f46e5", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* District Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Top Districts — Case Volume
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topDistricts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis type="category" dataKey="districtName" tick={{ fill: "#94a3b8", fontSize: 11 }} width={110} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #4f46e5", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gravity Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Gravity of Offence
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={gravityData} dataKey="count" nameKey="gravity" cx="50%" cy="50%" outerRadius={80} innerRadius={30} stroke="#0a0f1e" strokeWidth={2}>
                {gravityData.map((d) => <Cell key={d.gravity} fill={GRAVITY_COLORS[d.gravity] || "#64748b"} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #4f46e5", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {gravityData.map((d) => (
              <div key={d.gravity} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full")} style={{ backgroundColor: GRAVITY_COLORS[d.gravity] }} />
                <span className="text-xs text-slate-400">{d.gravity}: {d.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Third Row: Case Status + District Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Case Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            FIR Status Breakdown
          </h3>
          <div className="space-y-3">
            {statusData.map((s) => {
              const pct = ((s.count / ov.totalCases) * 100).toFixed(1);
              return (
                <div key={s.firStatus} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.firStatus] }} />
                  <span className="text-sm text-slate-300 w-40 capitalize">{s.firStatus.replace("_", " ")}</span>
                  <div className="flex-1 h-6 bg-slate-800/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[s.firStatus] }} />
                  </div>
                  <span className="text-sm font-medium text-slate-200 w-8 text-right">{formatNumber(s.count)}</span>
                  <span className="text-xs text-slate-500">{pct}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* District Risk Scores */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI District Risk Assessment
          </h3>
          <div className="space-y-3">
            {data.districtRisks.map((d) => (
              <div key={d.districtCode} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-200">{d.districtName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-sm font-bold", getRiskColor(d.riskLevel))}>{Number(d.riskScore).toFixed(1)}</span>
                  <div className={cn("px-2 py-1 rounded text-xs font-medium uppercase", getRiskBg(d.riskLevel), getRiskColor(d.riskLevel))}>
                    {d.riskLevel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Hotspots Row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Predicted Crime Hotspots — Next 7-14 Days
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.hotspots.map((h: any) => (
            <div key={h.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-300">{h.crimeType}</span>
                <div className={cn("px-2 py-1 rounded text-xs font-bold", Number(h.intensityScore) > 80 ? "bg-red-500/20 text-red-400" : Number(h.intensityScore) > 60 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400")}>
                  Intensity: {h.intensityScore}
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-2">{h.explanation}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 rounded bg-slate-700/50">{h.method}</span>
                <span className="px-2 py-1 rounded bg-slate-700/50">r={h.radiusKm}km</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
