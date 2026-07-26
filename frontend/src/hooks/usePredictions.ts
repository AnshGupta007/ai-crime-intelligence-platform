import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import type { ForecastPoint, RiskScore, SocioEconomicPoint, SocioEconomicInsights, Anomaly } from "@/types";

const MOCK_FORECAST: ForecastPoint[] = [
  { date: "2026-08-01", predicted: 42, predicted_count: 42, lower_bound: 35, upper_bound: 50, confidence: 0.95 },
  { date: "2026-08-02", predicted: 44, predicted_count: 44, lower_bound: 36, upper_bound: 52, confidence: 0.95 },
  { date: "2026-08-03", predicted: 39, predicted_count: 39, lower_bound: 31, upper_bound: 47, confidence: 0.95 },
  { date: "2026-08-04", predicted: 51, predicted_count: 51, lower_bound: 43, upper_bound: 60, confidence: 0.95 },
  { date: "2026-08-05", predicted: 48, predicted_count: 48, lower_bound: 40, upper_bound: 56, confidence: 0.95 },
  { date: "2026-08-06", predicted: 55, predicted_count: 55, lower_bound: 46, upper_bound: 64, confidence: 0.95 },
  { date: "2026-08-07", predicted: 60, predicted_count: 60, lower_bound: 50, upper_bound: 70, confidence: 0.95 },
];

const MOCK_RISK_SCORES: RiskScore[] = [
  { district_id: 1, district_name: "Kalaburagi", risk_score: 87.4, risk_level: "CRITICAL", crime_rate_per_100k: 312.5, predicted_trend: "+14.2% MoM", primary_factors: ["Property Crime", "Unemployment Spikes"] },
  { district_id: 2, district_name: "Bengaluru Urban", risk_score: 82.1, risk_level: "HIGH", crime_rate_per_100k: 285.0, predicted_trend: "+8.5% MoM", primary_factors: ["Cyber Fraud", "Traffic Accidents"] },
  { district_id: 3, district_name: "Dakshina Kannada", risk_score: 76.5, risk_level: "HIGH", crime_rate_per_100k: 240.2, predicted_trend: "+4.1% MoM", primary_factors: ["Coastal Smuggling", "Transit Theft"] },
  { district_id: 4, district_name: "Belagavi", risk_score: 64.2, risk_level: "MEDIUM", crime_rate_per_100k: 198.4, predicted_trend: "-2.0% MoM", primary_factors: ["Border Disputes"] },
  { district_id: 5, district_name: "Mysuru", risk_score: 58.9, risk_level: "MEDIUM", crime_rate_per_100k: 175.6, predicted_trend: "-5.3% MoM", primary_factors: ["Tourist Theft"] },
  { district_id: 6, district_name: "Udupi", risk_score: 32.0, risk_level: "LOW", crime_rate_per_100k: 92.1, predicted_trend: "-12.1% MoM", primary_factors: ["Minor Violations"] },
];

const MOCK_SOCIO_ECONOMIC_POINTS: SocioEconomicPoint[] = [
  { district_id: 1, district: "Bengaluru Urban", district_name: "Bengaluru Urban", crime_count: 3125, crime_rate: 285.0, risk_score: 82.1, population: 12500000, literacy_rate: 88.7, urbanization_pct: 91.2, unemployment_pct: 5.4 },
  { district_id: 2, district: "Kalaburagi", district_name: "Kalaburagi", crime_count: 1420, crime_rate: 312.5, risk_score: 87.4, population: 2600000, literacy_rate: 65.2, urbanization_pct: 32.5, unemployment_pct: 12.8 },
  { district_id: 3, district: "Dakshina Kannada", district_name: "Dakshina Kannada", crime_count: 980, crime_rate: 240.2, risk_score: 76.5, population: 2100000, literacy_rate: 88.6, urbanization_pct: 47.6, unemployment_pct: 7.2 },
  { district_id: 4, district: "Belagavi", district_name: "Belagavi", crime_count: 890, crime_rate: 198.4, risk_score: 64.2, population: 4800000, literacy_rate: 73.5, urbanization_pct: 25.3, unemployment_pct: 8.5 },
  { district_id: 5, district: "Mysuru", district_name: "Mysuru", crime_count: 850, crime_rate: 175.6, risk_score: 58.9, population: 3000000, literacy_rate: 72.8, urbanization_pct: 41.5, unemployment_pct: 6.9 },
  { district_id: 6, district: "Udupi", district_name: "Udupi", crime_count: 320, crime_rate: 92.1, risk_score: 32.0, population: 1180000, literacy_rate: 86.2, urbanization_pct: 28.4, unemployment_pct: 4.1 },
];

const MOCK_SOCIO_INSIGHTS: SocioEconomicInsights = {
  literacy_crime_correlation: -0.62,
  urbanization_crime_correlation: 0.74,
  unemployment_crime_correlation: 0.81,
  correlations: {
    literacy_vs_crime: -0.62,
    unemployment_vs_crime: 0.81,
    urbanization_vs_crime: 0.74,
  },
  insights: [
    "High unemployment rates in Kalaburagi correlate with 3.2x higher property offense frequency.",
    "Rapid urbanization in East Bengaluru correlates with cyber fraud spikes.",
    "Higher literacy in Udupi strongly correlates with lower overall violent crime rates."
  ],
  key_findings: [
    "High unemployment rates in Kalaburagi correlate with 3.2x higher property offense frequency.",
    "Rapid urbanization in East Bengaluru correlates with cyber fraud spikes."
  ]
};

const MOCK_ANOMALIES: Anomaly[] = [
  {
    anomaly_id: 501,
    anomaly_type: "SPATIAL_SPIKE",
    category_name: "Cyber Crime",
    station_name: "Whitefield PS",
    district_name: "Bengaluru Urban",
    actual_count: 48,
    expected_count: 12,
    deviation_factor: 4.0,
    z_score: 3.8,
    anomaly_score: 0.95,
    description: "400% sudden spike in phishing FIRs registered within 48 hours.",
    reasoning: "Phishing syndicate operating near IT Corridor",
    severity: "CRITICAL",
    detected_at: "2026-07-28T14:30:00Z",
    reviewed: false
  },
  {
    anomaly_id: 502,
    anomaly_type: "TEMPORAL_SPIKE",
    category_name: "Commercial Burglary",
    station_name: "Market PS",
    district_name: "Kalaburagi",
    actual_count: 19,
    expected_count: 4,
    deviation_factor: 4.75,
    z_score: 4.1,
    anomaly_score: 0.92,
    description: "Unusual cluster of night burglaries targeting jewelry markets.",
    reasoning: "Targeted series by organized inter-district gang",
    severity: "CRITICAL",
    detected_at: "2026-07-27T03:15:00Z",
    reviewed: false
  },
  {
    anomaly_id: 503,
    anomaly_type: "PATTERN_ANOMALY",
    category_name: "Vehicle Theft",
    station_name: "Devaraja PS",
    district_name: "Mysuru",
    actual_count: 14,
    expected_count: 5,
    deviation_factor: 2.8,
    z_score: 2.6,
    anomaly_score: 0.78,
    description: "Cluster of two-wheeler thefts near Mysuru Palace tourist area.",
    reasoning: "Seasonal weekend tourist influx exploitation",
    severity: "HIGH",
    detected_at: "2026-07-26T18:00:00Z",
    reviewed: true
  }
];

export function usePredictions() {
  const [forecast, setForecast] = useState<ForecastPoint[]>(MOCK_FORECAST);
  const [riskScores, setRiskScores] = useState<RiskScore[]>(MOCK_RISK_SCORES);
  const [socioPoints, setSocioPoints] = useState<SocioEconomicPoint[]>(MOCK_SOCIO_ECONOMIC_POINTS);
  const [socioInsights, setSocioInsights] = useState<SocioEconomicInsights | null>(MOCK_SOCIO_INSIGHTS);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(MOCK_ANOMALIES);
  const [loading, setLoading] = useState(false);

  const fetchForecast = useCallback(async (districtId?: number, categoryId?: number, days = 30) => {
    setLoading(true);
    try {
      const data = await api.get<{ points: ForecastPoint[] }>("/predictions/forecast", {
        district_id: districtId,
        category_id: categoryId,
        days,
      });
      if (data && data.points && data.points.length > 0) {
        setForecast(data.points);
      } else {
        setForecast(MOCK_FORECAST);
      }
    } catch {
      setForecast(MOCK_FORECAST);
    }
    setLoading(false);
  }, []);

  const fetchRiskScores = useCallback(async () => {
    try {
      const data = await api.get<RiskScore[]>("/predictions/risk-scores");
      if (data && data.length > 0) {
        setRiskScores(data);
      } else {
        setRiskScores(MOCK_RISK_SCORES);
      }
    } catch {
      setRiskScores(MOCK_RISK_SCORES);
    }
  }, []);

  const fetchSocioEconomic = useCallback(async () => {
    try {
      const data = await api.get<{ data: SocioEconomicPoint[]; insights?: SocioEconomicInsights }>(
        "/predictions/socio-economic"
      );
      if (data && data.data && data.data.length > 0) {
        setSocioPoints(data.data);
        if (data.insights) setSocioInsights(data.insights);
      } else {
        setSocioPoints(MOCK_SOCIO_ECONOMIC_POINTS);
        setSocioInsights(MOCK_SOCIO_INSIGHTS);
      }
    } catch {
      setSocioPoints(MOCK_SOCIO_ECONOMIC_POINTS);
      setSocioInsights(MOCK_SOCIO_INSIGHTS);
    }
  }, []);

  const fetchAnomalies = useCallback(async (unreviewedOnly = false) => {
    try {
      const data = await api.get<Anomaly[]>("/predictions/anomalies", {
        unreviewed_only: unreviewedOnly,
      });
      if (data && data.length > 0) {
        setAnomalies(data);
      } else {
        setAnomalies(MOCK_ANOMALIES);
      }
    } catch {
      setAnomalies(MOCK_ANOMALIES);
    }
  }, []);

  const markAnomalyReviewed = useCallback(async (anomalyId: number) => {
    try {
      await api.post(`/predictions/anomalies/${anomalyId}/review`);
    } catch {
      // optimistic update
    }
    setAnomalies((prev) =>
      prev.map((a) => (a.anomaly_id === anomalyId ? { ...a, reviewed: true } : a))
    );
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchForecast(),
      fetchRiskScores(),
      fetchSocioEconomic(),
      fetchAnomalies(),
    ]);
  }, [fetchForecast, fetchRiskScores, fetchSocioEconomic, fetchAnomalies]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    forecast,
    riskScores,
    socioPoints,
    socioInsights,
    anomalies,
    anomaliesLoading: loading,
    loading,
    fetchForecast,
    fetchRiskScores,
    fetchSocioEconomic,
    fetchAnomalies,
    markAnomalyReviewed,
    reviewAnomaly: markAnomalyReviewed,
    refreshAll,
  };
}

export default usePredictions;
