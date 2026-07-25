import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Clock, CheckCircle2, XCircle } from "lucide-react";
import ReportBuilder from "@/components/reports/ReportBuilder";
import api, { BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToastStore } from "@/store/toast";

interface GeneratedReport {
  id: string;
  type: string;
  label: string;
  format: string;
  timestamp: number;
}

export default function Reports() {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const saved = localStorage.getItem("generated-reports");
    if (saved) setReports(JSON.parse(saved));
  }, []);

  const saveReports = useCallback((updated: GeneratedReport[]) => {
    setReports(updated);
    localStorage.setItem("generated-reports", JSON.stringify(updated));
  }, []);

  const handleGenerated = useCallback((report: { id: string; type: string; label: string; format: string }) => {
    const entry: GeneratedReport = { ...report, timestamp: Date.now() };
    saveReports([entry, ...reports]);
  }, [reports, saveReports]);

  const handleDownload = useCallback(async (report: GeneratedReport) => {
    setDownloading(report.id);
    try {
      const res = await fetch(`${BASE_URL}/reports/${report.id}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.label.replace(/\s+/g, "-").toLowerCase()}-${report.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ type: "success", title: "Download started", message: report.label });
    } catch {
      addToast({ type: "error", title: "Download failed", message: "Could not download report." });
    }
    setDownloading(null);
  }, [addToast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and download intelligence reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Builder */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportBuilder onGenerated={handleGenerated} />
            </CardContent>
          </Card>
        </div>

        {/* Report List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pre-built reports */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pre-built Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Monthly Crime Statistics", desc: "SCRB-format monthly crime summary with trends", format: "PDF" },
                { label: "District Crime Comparison", desc: "Comparative analysis across all 31 districts", format: "PDF" },
                { label: "Repeat Offender Intelligence", desc: "Network analysis of repeat offenders & gangs", format: "PDF" },
                { label: "Hotspot Prediction Report", desc: "Predicted crime hotspot zones for next 30 days", format: "PDF" },
                { label: "FIR Status Dashboard", desc: "Case status breakdown by station and district", format: "Excel" },
              ].map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-xl border bg-white p-3.5 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.label}</p>
                      <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{r.format}</Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Generated reports history */}
          {reports.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Recent Generations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reports.slice(0, 10).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl border bg-white p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(r.timestamp).toLocaleString("en-IN")} &middot; {r.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(r)}
                      disabled={downloading === r.id}
                      className="shrink-0 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      {downloading === r.id ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
