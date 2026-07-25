import { useState, useCallback } from "react";
import api from "@/lib/api";
import type { ForecastPoint, ForecastResponse, RiskScore, SocioEconomicPoint, SocioEconomicResponse, Anomaly } from "@/types";

export function usePredictions() {
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [riskLoading, setRiskLoading] = useState(false);
  const [socioEconomic, setSocioEconomic] = useState<SocioEconomicPoint[]>([]);
  const [socioLoading, setSocioLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [anomaliesLoading, setAnomaliesLoading] = useState(false);

  const fetchForecast = useCallback(async (districtId?: number, categoryId?: number, days = 30) => {
    setForecastLoading(true);
    try {
      const params: Record<string, unknown> = { days };
      if (districtId) params.district_id = districtId;
      if (categoryId) params.category_id = categoryId;
      const data = await api.get<ForecastResponse>("/predictions/forecast", params);
      setForecast(data.points);
    } catch { /* ignore */ }
    setForecastLoading(false);
  }, []);

  const fetchRiskScores = useCallback(async () => {
    setRiskLoading(true);
    try {
      const data = await api.get<RiskScore[]>("/predictions/risk-scores");
      setRiskScores(data);
    } catch { /* ignore */ }
    setRiskLoading(false);
  }, []);

  const fetchSocioEconomic = useCallback(async (districtId?: number) => {
    setSocioLoading(true);
    try {
      const params = districtId ? { district_id: districtId } : undefined;
      const data = await api.get<SocioEconomicResponse>("/predictions/socio-economic", params);
      setSocioEconomic(data.data);
    } catch { /* ignore */ }
    setSocioLoading(false);
  }, []);

  const fetchAnomalies = useCallback(async (limit = 20) => {
    setAnomaliesLoading(true);
    try {
      const data = await api.get<Anomaly[]>("/anomalies", { limit });
      setAnomalies(data);
    } catch { /* ignore */ }
    setAnomaliesLoading(false);
  }, []);

  const reviewAnomaly = useCallback(async (anomalyId: number) => {
    try {
      await api.post(`/anomalies/${anomalyId}/review`);
      setAnomalies((prev) =>
        prev.map((a) => (a.anomaly_id === anomalyId ? { ...a, reviewed: true } : a))
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchForecast(),
      fetchRiskScores(),
      fetchSocioEconomic(),
      fetchAnomalies(),
    ]);
  }, [fetchForecast, fetchRiskScores, fetchSocioEconomic, fetchAnomalies]);

  return {
    forecast, forecastLoading,
    riskScores, riskLoading,
    socioEconomic, socioLoading,
    anomalies, anomaliesLoading,
    fetchForecast, fetchRiskScores,
    fetchSocioEconomic, fetchAnomalies,
    reviewAnomaly, refresh,
  };
}

export default usePredictions;
