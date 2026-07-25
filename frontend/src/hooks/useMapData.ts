import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { DistrictDensity, CrimeHotspot, CaseMapPin } from "@/types";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface TemporalPattern {
  hourly: number[];
  weekly: number[];
}

export function useMapData() {
  const [districts, setDistricts] = useState<DistrictDensity[]>([]);
  const [hotspots, setHotspots] = useState<CrimeHotspot[]>([]);
  const [cases, setCases] = useState<CaseMapPin[]>([]);
  const [temporal, setTemporal] = useState<TemporalPattern | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDistricts = useCallback(async () => {
    try {
      const data = await api.get<DistrictDensity[]>("/map/districts");
      setDistricts(data);
    } catch { /* ignore */ }
  }, []);

  const fetchHotspots = useCallback(async (days = 30) => {
    try {
      const data = await api.get<CrimeHotspot[]>("/map/hotspots", { days });
      setHotspots(data);
    } catch { /* ignore */ }
  }, []);

  const fetchCasesInBounds = useCallback(async (bounds: MapBounds) => {
    try {
      const data = await api.get<CaseMapPin[]>("/map/cases", bounds as unknown as Record<string, unknown>);
      setCases(data);
    } catch { /* ignore */ }
  }, []);

  const fetchTemporal = useCallback(async () => {
    try {
      const data = await api.get<TemporalPattern>("/map/temporal-pattern");
      setTemporal(data);
    } catch { /* ignore */ }
  }, []);

  const refresh = useCallback(async (bounds?: MapBounds) => {
    setLoading(true);
    await Promise.all([
      fetchDistricts(),
      fetchHotspots(),
      fetchTemporal(),
      bounds ? fetchCasesInBounds(bounds) : Promise.resolve(),
    ]);
    setLoading(false);
  }, [fetchDistricts, fetchHotspots, fetchTemporal, fetchCasesInBounds]);

  useEffect(() => {
    refresh();
  }, []);

  return {
    districts, hotspots, cases, temporal,
    loading, refresh, fetchCasesInBounds, fetchHotspots,
  };
}

export default useMapData;
