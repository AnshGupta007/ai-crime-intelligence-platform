import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import type { Anomaly } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AnomalyCardProps {
    anomaly: Anomaly;
    onReview: (id: number) => void;
}

export default function AnomalyCard({ anomaly, onReview }: AnomalyCardProps) {
    const isCritical = anomaly.severity === "CRITICAL" || anomaly.anomaly_score > 0.8;

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 transition-all shadow-sm ${anomaly.reviewed
                    ? "bg-slate-50 border-slate-200"
                    : isCritical
                        ? "bg-rose-50/50 border-rose-200"
                        : "bg-amber-50/50 border-amber-200"
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {isCritical ? (
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                        {anomaly.station_name || anomaly.district_name || "Karnataka District"}
                    </span>
                </div>
                <Badge variant={isCritical ? "destructive" : "secondary"}>
                    {anomaly.anomaly_type || anomaly.category_name || "SPIKE"}
                </Badge>
            </div>

            <p className="text-xs text-slate-600 mb-3">{anomaly.description}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2.5 mt-2">
                <span>Actual: <strong>{anomaly.actual_count || 48}</strong> (Exp: {anomaly.expected_count || 12})</span>
                <span>Score: <strong>{(anomaly.anomaly_score * 100).toFixed(0)}%</strong></span>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                    {new Date(anomaly.detected_at).toLocaleString("en-IN")}
                </span>
                {!anomaly.reviewed ? (
                    <Button
                        size="sm"
                        onClick={() => onReview(anomaly.anomaly_id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 px-2.5"
                    >
                        Mark Reviewed
                    </Button>
                ) : (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                    </span>
                )}
            </div>
        </motion.div>
    );
}
