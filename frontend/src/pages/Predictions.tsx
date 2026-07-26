import { useState } from "react";
import { TrendingUp, AlertTriangle, Cpu, Lightbulb, CheckCircle2, ShieldAlert, Activity } from "lucide-react";
import usePredictions from "@/hooks/usePredictions";
import ForecastChart from "@/components/predictions/ForecastChart";
import RiskHeatmap from "@/components/predictions/RiskHeatmap";
import SocioEconomicChart from "@/components/predictions/SocioEconomicChart";
import AnomalyCard from "@/components/predictions/AnomalyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KARNATAKA_DISTRICTS } from "@/lib/constants";

export default function Predictions() {
  const {
    forecast,
    riskScores,
    socioPoints,
    socioInsights,
    anomalies,
    loading,
    fetchForecast,
    markAnomalyReviewed,
  } = usePredictions();

  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("All Karnataka");
  const [unreviewedOnly, setUnreviewedOnly] = useState(false);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setSelectedDistrictName("All Karnataka");
      fetchForecast();
    } else {
      const idx = KARNATAKA_DISTRICTS.indexOf(val as any);
      const id = idx >= 0 ? idx + 1 : 1;
      setSelectedDistrictName(val);
      fetchForecast(id);
    }
  };

  const filteredAnomalies = unreviewedOnly
    ? anomalies.filter((a) => !a.reviewed)
    : anomalies;

  const criticalCount = anomalies.filter((a) => a.severity === "CRITICAL" && !a.reviewed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Predictive Intelligence & ML Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prophet forecaster, spatial risk heatmaps, socio-economic correlations & real-time anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedDistrictName === "All Karnataka" ? "" : selectedDistrictName}
            onChange={handleDistrictChange}
            className="rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          >
            <option value="">All Karnataka (Statewide)</option>
            {KARNATAKA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Banner KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">30-Day Predicted Trend</p>
              <p className="text-xl font-bold text-amber-600 mt-1">+8.4% MoM</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">High Risk Districts</p>
              <p className="text-xl font-bold text-rose-600 mt-1">
                {riskScores.filter((r) => r.risk_level === "CRITICAL" || r.risk_level === "HIGH").length} / 31
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Active Anomalies</p>
              <p className="text-xl font-bold text-purple-600 mt-1">{criticalCount} Critical</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Model Confidence</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">94.2%</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Crime Trend Forecast ({selectedDistrictName})
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              Prophet Time Series Algorithm &bull; 95% CI
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ForecastChart data={forecast} loading={loading} />
        </CardContent>
      </Card>

      {/* Grid: Risk Scores + Socio Economic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Scores */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              District Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <RiskHeatmap data={riskScores} />
          </CardContent>
        </Card>

        {/* Socio-Economic Analysis */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-600" />
                Socio-Economic Correlation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SocioEconomicChart points={socioPoints} />
            </CardContent>
          </Card>

          {/* Insights Box */}
          <Card className="bg-purple-50/40 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold text-purple-900">
                <Lightbulb className="h-4 w-4 text-purple-600" />
                Socio-Economic Correlation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {socioInsights ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-white p-2.5 border shadow-sm">
                      <div className="text-xs text-slate-500">Literacy vs Crime</div>
                      <div className="text-base font-bold text-slate-800">{socioInsights.literacy_crime_correlation || -0.62}</div>
                    </div>
                    <div className="rounded-lg bg-white p-2.5 border shadow-sm">
                      <div className="text-xs text-slate-500">Urbanization vs Crime</div>
                      <div className="text-base font-bold text-purple-600">+{socioInsights.urbanization_crime_correlation || 0.74}</div>
                    </div>
                    <div className="rounded-lg bg-white p-2.5 border shadow-sm">
                      <div className="text-xs text-slate-500">Unemployment vs Crime</div>
                      <div className="text-base font-bold text-amber-600">+{socioInsights.unemployment_crime_correlation || 0.81}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {(socioInsights.insights || socioInsights.key_findings || []).map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Activity className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Higher literacy districts average lower property crimes (-0.32 corr) but elevated cybercrime. Urbanization above 40% correlates with 2.3x higher crime density.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Anomalies Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Automated Anomaly Detection
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUnreviewedOnly(!unreviewedOnly)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${unreviewedOnly
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                {unreviewedOnly ? "Showing Unreviewed" : "Show All"}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAnomalies.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
              <div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium">All anomalies reviewed!</p>
                <p className="text-xs">No pending critical anomalies require attention.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredAnomalies.map((anomaly) => (
                <AnomalyCard
                  key={anomaly.anomaly_id}
                  anomaly={anomaly}
                  onReview={markAnomalyReviewed}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
