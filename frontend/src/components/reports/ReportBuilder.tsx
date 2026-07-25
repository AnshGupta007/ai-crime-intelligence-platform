import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, MapPin, Download, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { KARNATAKA_DISTRICTS } from "@/lib/constants";
import { useToastStore } from "@/store/toast";

const REPORT_TYPES = [
  { id: "monthly_crime_statistics", label: "Monthly Crime Statistics", desc: "SCRB format, PDF", format: "pdf" },
  { id: "district_crime_comparison", label: "District Crime Comparison", desc: "Cross-district analysis, PDF", format: "pdf" },
  { id: "repeat_offender_intelligence", label: "Repeat Offender Intelligence", desc: "Repeat offender analysis, PDF", format: "pdf" },
  { id: "hotspot_prediction_report", label: "Hotspot Prediction Report", desc: "Predicted hotspot zones, PDF", format: "pdf" },
  { id: "fir_status_dashboard", label: "FIR Status Dashboard", desc: "Case status summary, Excel", format: "excel" },
];

interface ReportBuilderProps {
  onGenerated: (report: { id: string; type: string; label: string; format: string }) => void;
}

export default function ReportBuilder({ onGenerated }: ReportBuilderProps) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0].id);
  const [district, setDistrict] = useState("");
  const [generating, setGenerating] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const selectedReport = REPORT_TYPES.find((r) => r.id === reportType)!;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post<{ report_id: string; status: string; data: unknown[] }>("/reports/generate", {
        type: reportType,
        district_id: district ? KARNATAKA_DISTRICTS.indexOf(district as typeof KARNATAKA_DISTRICTS[number]) + 1 : null,
        format: selectedReport.format,
      });
      addToast({ type: "success", title: "Report generated", message: `${selectedReport.label} is ready for download.` });
      onGenerated({ id: res.report_id, type: reportType, label: selectedReport.label, format: selectedReport.format });
    } catch {
      addToast({ type: "error", title: "Generation failed", message: "Could not generate report. Please try again." });
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Report Type</p>
        <div className="space-y-1.5">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt.id}
              onClick={() => setReportType(rt.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                reportType === rt.id
                  ? "border-blue-200 bg-blue-50 shadow-sm"
                  : "border-transparent bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className={`rounded-lg p-1.5 ${reportType === rt.id ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{rt.label}</p>
                <p className="text-[10px] text-muted-foreground">{rt.desc}</p>
              </div>
              {reportType === rt.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="flex-1 rounded-lg border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Districts</option>
            {KARNATAKA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="month"
            defaultValue={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`}
            className="flex-1 rounded-lg border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {generating ? "Generating..." : `Generate ${selectedReport.format.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}
