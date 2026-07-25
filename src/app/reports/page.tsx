"use client";

import { motion } from "framer-motion";
import {
  BarChart3, FileText, Download, Calendar, Clock, Shield,
  Printer, Mail, RefreshCw, CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const REPORTS = [
  { id: 1, name: "Monthly Crime Statistics Report", type: "SCRB Monthly", format: "PDF", schedule: "Monthly", lastGenerated: "01 Dec 2025", status: "ready", size: "2.4 MB" },
  { id: 2, name: "District Crime Comparison Report", type: "District Analysis", format: "PDF", schedule: "Weekly", lastGenerated: "28 Nov 2025", status: "ready", size: "1.8 MB" },
  { id: 3, name: "Repeat Offender Intelligence Report", type: "AI Intelligence", format: "PDF", schedule: "Weekly", lastGenerated: "25 Nov 2025", status: "ready", size: "3.2 MB" },
  { id: 4, name: "Hotspot Prediction Report", type: "AI Predictive", format: "PDF", schedule: "Daily", lastGenerated: "Today", status: "ready", size: "1.1 MB" },
  { id: 5, name: "FIR Status Dashboard Report", type: "Operational", format: "Excel", schedule: "Daily", lastGenerated: "Today", status: "ready", size: "4.5 MB" },
  { id: 6, name: "Criminal Network Analysis Report", type: "Graph Intelligence", format: "PDF", schedule: "On Demand", lastGenerated: "20 Nov 2025", status: "ready", size: "5.8 MB" },
  { id: 7, name: "Court-Ready Investigation Summary", type: "Legal", format: "PDF", schedule: "On Demand", lastGenerated: "Pending", status: "pending", size: "—" },
  { id: 8, name: "Resource Optimization Report", type: "AI Predictive", format: "PowerPoint", schedule: "Weekly", lastGenerated: "22 Nov 2025", status: "ready", size: "8.2 MB" },
  { id: 9, name: "Anomaly Detection Alert Report", type: "AI Intelligence", format: "PDF", schedule: "Real-time", lastGenerated: "Today", status: "ready", size: "0.8 MB" },
  { id: 10, name: "Yearly Crime Trend Analysis", type: "SCRB Annual", format: "PDF", schedule: "Annual", lastGenerated: "Jan 2025", status: "ready", size: "12.4 MB" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "SCRB Monthly": { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  "SCRB Annual": { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  "District Analysis": { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  "AI Intelligence": { bg: "bg-violet-500/20", text: "text-violet-400" },
  "AI Predictive": { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  "Operational": { bg: "bg-amber-500/20", text: "text-amber-400" },
  "Graph Intelligence": { bg: "bg-pink-500/20", text: "text-pink-400" },
  "Legal": { bg: "bg-red-500/20", text: "text-red-400" },
};

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Report Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">Scheduled & On-Demand Reports &bull; PDF, Excel, CSV, PowerPoint &bull; SCRB Standards</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass-card px-4 py-2 flex items-center gap-2 text-xs text-indigo-300 hover:bg-indigo-600/20 transition-all">
            <RefreshCw className="w-4 h-4" /> Generate New Report
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-4 gap-3">
        {[
          { label: "Reports Available", value: "10", icon: FileText, color: "text-indigo-400" },
          { label: "Auto-Scheduled", value: "6", icon: Calendar, color: "text-emerald-400" },
          { label: "Generated Today", value: "3", icon: Clock, color: "text-amber-400" },
          { label: "Formats Supported", value: "4", icon: Download, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <s.icon className={cn("w-5 h-5", s.color)} />
            <div>
              <div className={cn("text-lg font-bold", s.color)}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Report List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
        {REPORTS.map((r, i) => {
          const typeStyle = TYPE_COLORS[r.type] || { bg: "bg-slate-500/20", text: "text-slate-400" };
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card glass-card-hover p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeStyle.bg)}>
                  <FileText className={cn("w-5 h-5", typeStyle.text)} />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{r.name}</span>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className={cn("px-2 py-0.5 rounded font-medium", typeStyle.bg, typeStyle.text)}>{r.type}</span>
                    <span>📅 {r.schedule}</span>
                    <span>📄 {r.format}</span>
                    <span>{r.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400">{r.lastGenerated}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {r.status === "ready" ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                    <span className={cn("text-xs font-medium", r.status === "ready" ? "text-emerald-400" : "text-amber-400")}>{r.status}</span>
                  </div>
                </div>
                {r.status === "ready" && (
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-xs text-indigo-300 hover:bg-indigo-600/30 transition-all flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-slate-400 hover:bg-slate-800/70 transition-all flex items-center gap-1">
                      <Printer className="w-3 h-3" /> Print
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-slate-400 hover:bg-slate-800/70 transition-all flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Export Formats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Supported Export Formats — SCRB Compliant
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { format: "PDF", desc: "Court-ready, SCRB format, watermarked", icon: "📄" },
            { format: "Excel", desc: "Data tables, pivot analysis, charts", icon: "📊" },
            { format: "CSV", desc: "Raw data export, API compatible", icon: "📋" },
            { format: "PowerPoint", desc: "Presentation-ready, DGP briefing", icon: "📊" },
          ].map((f) => (
            <div key={f.format} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/30 transition-all text-center">
              <span className="text-3xl mb-2">{f.icon}</span>
              <div className="text-sm font-medium text-white">{f.format}</div>
              <div className="text-xs text-slate-400 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
