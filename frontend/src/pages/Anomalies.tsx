import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import usePredictions from "@/hooks/usePredictions";
import AnomalyList from "@/components/predictions/AnomalyList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Anomalies() {
  const { anomalies, anomaliesLoading, reviewAnomaly, fetchAnomalies } = usePredictions();

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const criticalCount = anomalies.filter((a) => a.anomaly_score > 0.8 && !a.reviewed).length;
  const unreviewedCount = anomalies.filter((a) => !a.reviewed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Anomaly Detection</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-detected irregularities in crime patterns requiring investigation
          </p>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-1.5">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs font-semibold text-red-700">{criticalCount} critical</span>
            </div>
          )}
          {unreviewedCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5">
              <span className="text-xs font-semibold text-amber-700">{unreviewedCount} unreviewed</span>
            </div>
          )}
          <button
            onClick={() => fetchAnomalies()}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Anomaly List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Detected Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <AnomalyList data={anomalies} loading={anomaliesLoading} onReview={reviewAnomaly} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-4 text-white">
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-xs opacity-90">Critical Anomalies</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-4 text-white">
                <p className="text-2xl font-bold">{unreviewedCount}</p>
                <p className="text-xs opacity-90">Pending Review</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white">
                <p className="text-2xl font-bold">{anomalies.length}</p>
                <p className="text-xs opacity-90">Total Detected</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 text-white">
                <p className="text-2xl font-bold">{anomalies.filter((a) => a.reviewed).length}</p>
                <p className="text-xs opacity-90">Reviewed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Anomaly Types</CardTitle>
            </CardHeader>
            <CardContent>
              {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => {
                const count = anomalies.filter((a) => {
                  const score = a.anomaly_score;
                  if (level === "CRITICAL") return score > 0.8;
                  if (level === "HIGH") return score > 0.6 && score <= 0.8;
                  if (level === "MEDIUM") return score > 0.4 && score <= 0.6;
                  return score <= 0.4;
                }).length;
                const color = level === "CRITICAL" ? "bg-red-500" : level === "HIGH" ? "bg-orange-500" : level === "MEDIUM" ? "bg-amber-400" : "bg-blue-400";
                return (
                  <div key={level} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-xs">{level}</span>
                    </div>
                    <span className="text-xs font-semibold">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
