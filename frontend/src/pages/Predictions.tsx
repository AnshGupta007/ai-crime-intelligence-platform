import { useEffect, useState, useCallback } from "react";
import { Download, TrendingUp, Map, BarChart3 } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import usePredictions from "@/hooks/usePredictions";
import ForecastChart from "@/components/predictions/ForecastChart";
import RiskHeatmap from "@/components/predictions/RiskHeatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KARNATAKA_DISTRICTS, CRIME_TYPES } from "@/lib/constants";
import type { RiskScore } from "@/types";

export default function Predictions() {
  const {
    forecast, forecastLoading, riskScores, riskLoading,
    socioEconomic, socioLoading, fetchForecast, refresh,
  } = usePredictions();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCrimeType, setSelectedCrimeType] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    const districtId = KARNATAKA_DISTRICTS.indexOf(district as typeof KARNATAKA_DISTRICTS[number]) + 1;
    fetchForecast(districtId || undefined, selectedCrimeType ? CRIME_TYPES.indexOf(selectedCrimeType as typeof CRIME_TYPES[number]) + 1 : undefined);
  }, [selectedCrimeType, fetchForecast]);

  const handleCrimeTypeChange = useCallback((crimeType: string) => {
    setSelectedCrimeType(crimeType);
    const categoryId = crimeType ? CRIME_TYPES.indexOf(crimeType as typeof CRIME_TYPES[number]) + 1 : undefined;
    fetchForecast(selectedDistrict ? KARNATAKA_DISTRICTS.indexOf(selectedDistrict as typeof KARNATAKA_DISTRICTS[number]) + 1 : undefined, categoryId);
  }, [selectedDistrict, fetchForecast]);

  const handleDistrictClick = useCallback((district: RiskScore) => {
    setSelectedDistrict(district.district_name);
    fetchForecast(district.district_id);
  }, [fetchForecast]);

  const handleExport = useCallback(() => {
    const csvHeader = "Date,Predicted,Lower Bound,Upper Bound\n";
    const csvRows = forecast.map((p) => `${p.date},${p.predicted},${p.lower_bound ?? ""},${p.upper_bound ?? ""}`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crime-forecast-${selectedDistrict || "all"}-${selectedCrimeType || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [forecast, selectedDistrict, selectedCrimeType]);

  const socioChartData = socioEconomic.map((s) => ({
    x: s.risk_score,
    y: s.crime_count,
    name: s.district_name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Predictions & Risk Analysis</h1>
        {forecast.length > 0 && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Crime Forecast
              </CardTitle>
              <div className="flex gap-2">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="rounded-lg border bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Districts</option>
                  {KARNATAKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={selectedCrimeType}
                  onChange={(e) => handleCrimeTypeChange(e.target.value)}
                  className="rounded-lg border bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Crimes</option>
                  {CRIME_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <ForecastChart data={forecast} loading={forecastLoading} />
            </CardContent>
          </Card>

          {/* Socio-Economic Correlation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                Socio-Economic Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {socioLoading ? (
                <div className="flex h-[250px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                </div>
              ) : socioChartData.length === 0 ? (
                <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                  No socio-economic data available
                </div>
              ) : (
                <div className="rounded-xl border bg-white p-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="x"
                        name="Risk Score"
                        tick={{ fontSize: 11 }}
                        label={{ value: "Risk Score", position: "bottom", fontSize: 11, offset: -4 }}
                      />
                      <YAxis
                        dataKey="y"
                        name="Crime Count"
                        tick={{ fontSize: 11 }}
                        label={{ value: "Crime Count", angle: -90, position: "insideLeft", fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                        formatter={(value: number, name: string) => [value, name === "x" ? "Risk Score" : "Crime Count"]}
                        labelFormatter={(label) => `District: ${label}`}
                      />
                      <Scatter
                        data={socioChartData}
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                        shape="circle"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Risk Heatmap */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Map className="h-4 w-4 text-red-500" />
                District Risk Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskHeatmap
                data={riskScores}
                loading={riskLoading}
                onDistrictClick={handleDistrictClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
