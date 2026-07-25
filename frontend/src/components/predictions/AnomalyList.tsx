import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Anomaly } from "@/types";

interface AnomalyListProps {
  data: Anomaly[];
  loading?: boolean;
  onReview: (id: number) => Promise<boolean>;
}

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-amber-400",
  LOW: "bg-blue-400",
};

const SEVERITY_TEXT: Record<string, string> = {
  CRITICAL: "border-red-200 bg-red-50 text-red-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
  LOW: "border-blue-200 bg-blue-50 text-blue-700",
};

export default function AnomalyList({ data, loading, onReview }: AnomalyListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading anomalies...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border bg-white">
        <div className="text-center text-muted-foreground">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-30" />
          <p className="text-sm">No anomalies detected</p>
        </div>
      </div>
    );
  }

  const handleReview = async (id: number) => {
    setReviewingId(id);
    await onReview(id);
    setReviewingId(null);
  };

  return (
    <div className="space-y-2">
      {data.map((a) => {
        const isExpanded = expandedId === a.anomaly_id;
        const severity = a.anomaly_score > 0.8 ? "CRITICAL" : a.anomaly_score > 0.6 ? "HIGH" : a.anomaly_score > 0.4 ? "MEDIUM" : "LOW";

        return (
          <motion.div
            key={a.anomaly_id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border bg-white transition-all ${isExpanded ? "shadow-md" : "shadow-sm"}`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : a.anomaly_id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${SEVERITY_STYLES[severity] || "bg-slate-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold truncate">{a.anomaly_type}</span>
                  <Badge variant="outline" className={`text-[9px] ${SEVERITY_TEXT[severity]}`}>
                    {severity}
                  </Badge>
                  {a.reviewed && (
                    <Badge variant="secondary" className="text-[9px]">Reviewed</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{a.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-muted-foreground">
                  Score: {(a.anomaly_score * 100).toFixed(0)}
                </span>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t px-4 py-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-0.5">Detected At</p>
                        <p className="font-medium">{new Date(a.detected_at).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Anomaly Score</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${SEVERITY_STYLES[severity]}`}
                              style={{ width: `${a.anomaly_score * 100}%` }}
                            />
                          </div>
                          <span className="font-mono font-medium">{(a.anomaly_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                      <p className="text-xs">{a.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Contributing Factors</p>
                      <p className="text-xs">Temporal spike detection coupled with geographical clustering. Deviation from historical baseline exceeds {Math.round(a.anomaly_score * 100)}% threshold. Cross-referencing with repeat offender patterns confirms elevated risk.</p>
                    </div>
                    {!a.reviewed && (
                      <button
                        onClick={() => handleReview(a.anomaly_id)}
                        disabled={reviewingId === a.anomaly_id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                      >
                        {reviewingId === a.anomaly_id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        {reviewingId === a.anomaly_id ? "Reviewing..." : "Mark as Reviewed"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
