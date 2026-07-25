"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Target, Gauge, AlertTriangle, MapPin, Brain, BarChart3, Clock,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
} from "recharts";
import { cn, getRiskColor, getRiskBg, getConfidenceColor } from "@/lib/utils";

interface AIData {
  predictions: any[];
  forecasts: any[];
  riskScores: any[];
}

const forecastData = [
  { week: "W1", predicted: 48, lower: 38, upper: 58, actual: 45 },
  { week: "W2", predicted: 52, lower: 42, upper: 62, actual: null },
  { week: "W3", predicted: 45, lower: 35, upper: 55, actual: null },
  { week: "W4", predicted: 38, lower: 28, upper: 48, actual: null },
  { week: "W5", predicted: 42, lower: 32, upper: 52, actual: null },
  { week: "W6", predicted: 55, lower: 45, upper: 65, actual: null },
  { week: "W7", predicted: 48, lower: 38, upper: 58, actual: null },
  { week: "W8", predicted: 35, lower: 25, upper: 45, actual: null },
];

const districtRiskData = [
  { district: "Bengaluru U", risk: 92, crime: 89, gang: 78, cyber: 95 },
  { district: "Kalaburagi", risk: 78, crime: 72, gang: 68, cyber: 45 },
  { district: "Ballari", risk: 74, crime: 70, gang: 82, cyber: 38 },
  { district: "Mysuru", risk: 65, crime: 58, gang: 35, cyber: 72 },
  { district: "Dharwad", risk: 62, crime: 55, gang: 45, cyber: 52 },
  { district: "Raichur", risk: 72, crime: 68, gang: 75, cyber: 28 },
];

export default function PredictionsPage() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/analytics")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-indigo-400" />
          Predictive Intelligence Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">Crime Forecasting &bull; District Risk Scores &bull; Station Risk &bull; Emerging Crime Detection</p>
      </motion.div>

      {/* Forecast Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Crime Forecast — Bengaluru Urban (Prophet Model)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="boundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #4f46e5", borderRadius: 8 }} />
            <Area type="monotone" dataKey="upper" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} fill="url(#boundGrad)" name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} fill="transparent" name="Lower Bound" />
            <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 4 }} name="Predicted" />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} name="Actual" connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-indigo-500 rounded" /> Predicted</div>
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-emerald-500 rounded" /> Actual</div>
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-slate-400 rounded opacity-50" /> Confidence Interval</div>
        </div>
      </motion.div>

      {/* District Risk Matrix */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          District Risk Score Matrix — Multi-dimensional AI Assessment
        </h3>
        <div className="space-y-3">
          {districtRiskData.map((d) => (
            <div key={d.district} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
              <div className="w-24">
                <span className="text-sm font-medium text-white">{d.district}</span>
              </div>
              {[
                { label: "Overall", value: d.risk, color: d.risk > 80 ? "#ef4444" : d.risk > 60 ? "#f59e0b" : "#10b981" },
                { label: "Crime Rate", value: d.crime, color: d.crime > 80 ? "#ef4444" : d.crime > 60 ? "#f59e0b" : "#10b981" },
                { label: "Gang Activity", value: d.gang, color: d.gang > 80 ? "#ef4444" : d.gang > 60 ? "#f59e0b" : "#10b981" },
                { label: "Cyber Risk", value: d.cyber, color: d.cyber > 80 ? "#ef4444" : d.cyber > 60 ? "#f59e0b" : "#10b981" },
              ].map((metric) => (
                <div key={metric.label} className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-slate-800/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: metric.color }}>{metric.value}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emerging Crime Detection */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Emerging Crime Detection — Anomaly Alerts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { type: "AI-powered Investment Fraud", districts: "4 districts", confidence: 75.6, trend: "+340%", severity: "high", explanation: "NLP analysis of 8 FIR briefs identifies consistent social media → WhatsApp → crypto fraud pattern" },
            { type: "Deepfake Extortion", districts: "2 districts", confidence: 68.4, trend: "+180%", severity: "emerging", explanation: "2 cases in Bengaluru using deepfake technology for blackmail — first of its kind in Karnataka" },
            { type: "Electric Vehicle Battery Theft", districts: "3 districts", confidence: 72.1, trend: "+250%", severity: "emerging", explanation: "New crime category emerging — theft of EV batteries from parked vehicles in tech corridors" },
            { type: "Chain Snatching Surge", districts: "Mysuru", confidence: 82.1, trend: "+340%", severity: "critical", explanation: "3σ deviation from baseline — correlation with recent release of known chain-snatchers" },
          ].map((alert) => (
            <div key={alert.type} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-red-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{alert.type}</span>
                <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase", alert.severity === "critical" ? "bg-red-500/20 text-red-400" : alert.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-amber-500/20 text-amber-400")}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs mb-2">
                <span className="text-slate-400">📍 {alert.districts}</span>
                <span className={cn("font-medium", getConfidenceColor(alert.confidence))}>{alert.confidence}% conf</span>
                <span className="text-red-400 font-bold">{alert.trend}</span>
              </div>
              <p className="text-xs text-slate-500">{alert.explanation}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resource Optimization */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" />
          AI Resource Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {[
            { station: "MG Road PS", current: "4 patrols/night", recommended: "6 patrols/night", reason: "Burglary cluster + vehicle theft hotspot overlap", savings: "₹2.4L/week in stolen property" },
            { station: "Koramangala PS", current: "2 night patrols", recommended: "4 night patrols + CCTV", reason: "Residential burglary density 3x above average", savings: "₹1.8L/week" },
            { station: "Hebbal PS", current: "3 patrols", recommended: "5 patrols + community policing", reason: "Emerging hotspot + rapid urbanization", savings: "₹1.2L/week" },
            { station: "Whitefield PS", current: "2 patrols", recommended: "3 cyber cell officers", reason: "Cybercrime concentration in tech corridor", savings: "₹3.5L/week in fraud prevention" },
          ].map((rec) => (
            <div key={rec.station} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{rec.station}</span>
                  <div className="text-xs text-slate-400">{rec.reason}</div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div><span className="text-slate-500">Current:</span> <span className="text-slate-300">{rec.current}</span></div>
                <div><span className="text-slate-500">Recommended:</span> <span className="text-emerald-400 font-medium">{rec.recommended}</span></div>
                <div><span className="text-slate-500">Est. Savings:</span> <span className="text-emerald-400 font-medium">{rec.savings}</span></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
