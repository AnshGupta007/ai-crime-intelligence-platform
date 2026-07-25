"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Search, Filter, ChevronLeft, ChevronRight,
  Eye, Clock, Target, AlertTriangle, MapPin, Users, BadgeCheck,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface CaseData {
  cases: {
    id: string;
    firNumber: string;
    caseNumber: string;
    year: number;
    dateOfReport: string;
    dateOfOccurrence: string;
    firStatus: string;
    briefFacts: string;
    placeOfOccurrence: string;
    numberOfVictims: number;
    numberOfAccused: number;
    propertyStolenValue: number;
    isHighProfile: boolean;
    crimeHeadDescription: string;
    districtName: string;
  }[];
  total: number;
  page: number;
  limit: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  under_investigation: { bg: "bg-amber-500/20", text: "text-amber-400" },
  chargesheeted: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  final_report_false: { bg: "bg-slate-500/20", text: "text-slate-400" },
  closed: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  pending_trial: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  convicted: { bg: "bg-violet-500/20", text: "text-violet-400" },
  acquitted: { bg: "bg-blue-500/20", text: "text-blue-400" },
  transferred: { bg: "bg-orange-500/20", text: "text-orange-400" },
};

export default function CasesPage() {
  const [data, setData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch(`/api/cases?${params}`)
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-400" />
            Case Management — FIR Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">{data.total} total FIRs &bull; Page {page} of {totalPages}</p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 flex-wrap">
        <div className="glass-card px-4 py-2 flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by FIR number..."
            className="bg-transparent text-sm text-slate-200 outline-none w-full placeholder:text-slate-500"
          />
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-slate-200 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="chargesheeted">Chargesheeted</option>
            <option value="closed">Closed</option>
            <option value="pending_trial">Pending Trial</option>
            <option value="final_report_false">FR False</option>
          </select>
        </div>
      </motion.div>

      {/* Case Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
        {data.cases.map((c, i) => {
          const statusStyle = STATUS_COLORS[c.firStatus] || { bg: "bg-slate-500/20", text: "text-slate-400" };
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "glass-card p-5 hover:border-indigo-500/30 transition-all",
                c.isHighProfile && "border-red-500/30"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.isHighProfile ? "bg-red-500/20" : "bg-indigo-500/20")}>
                    {c.isHighProfile ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <FileText className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">{c.firNumber}</span>
                    {c.caseNumber && <span className="text-xs text-slate-500 ml-2">{c.caseNumber}</span>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", statusStyle.bg, statusStyle.text)}>
                        {c.firStatus.replace(/_/g, " ")}
                      </span>
                      {c.isHighProfile && <span className="px-2 py-0.5 rounded bg-red-500/20 text-xs font-bold text-red-400">HIGH PROFILE</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>{formatDate(c.dateOfReport)}</div>
                  <div>{c.year}</div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-slate-300 leading-relaxed">{c.briefFacts}</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span className="text-slate-400">{c.districtName}</span>
                  {c.placeOfOccurrence && <span className="text-slate-500">— {c.placeOfOccurrence}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-violet-400" />
                  <span className="text-slate-400">{c.crimeHeadDescription}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-400">{c.numberOfAccused} accused, {c.numberOfVictims} victims</span>
                </div>
                {c.propertyStolenValue > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-amber-400" />
                    <span className="text-slate-400">₹{c.propertyStolenValue.toLocaleString("en-IN")} stolen</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, data.total)} of {data.total}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="glass-card px-3 py-2 text-sm text-slate-400 hover:text-indigo-300 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-indigo-300 font-medium">{page}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="glass-card px-3 py-2 text-sm text-slate-400 hover:text-indigo-300 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
