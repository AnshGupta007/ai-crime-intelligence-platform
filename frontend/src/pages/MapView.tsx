import { useState, useCallback } from "react";
import useMapData from "@/hooks/useMapData";
import CrimeMap from "@/components/map/CrimeMap";
import MapControls from "@/components/map/MapControls";
import { Shield, TrendingUp, Navigation } from "lucide-react";

export default function MapView() {
  const { districts, hotspots, cases, fetchCasesInBounds, fetchHotspots } = useMapData();

  const [layers, setLayers] = useState({
    heatmap: false,
    policeStations: true,
    hotspots: true,
    cases: true,
  });

  const [timeRange, setTimeRange] = useState<[number, number]>([0, 23]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [showPatrol, setShowPatrol] = useState(true);

  const handleBoundsChange = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    fetchCasesInBounds(bounds);
  }, [fetchCasesInBounds]);

  const topHotspots = [...hotspots]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] -m-6">
      {/* Map */}
      <CrimeMap
        districts={districts}
        hotspots={hotspots}
        caseMarkers={cases}
        showHotspots={layers.hotspots}
        showCases={layers.cases}
        showDistricts={layers.policeStations}
        onBoundsChange={handleBoundsChange}
      />

      {/* Map Controls Overlay */}
      <MapControls
        layers={layers}
        onLayerToggle={(key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))}
        timeRange={timeRange}
        onTimeChange={setTimeRange}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        dateRange={dateRange}
        onDateChange={setDateRange}
      />

      {/* Patrol Recommendation Panel */}
      {showPatrol && topHotspots.length > 0 && (
        <div className="absolute bottom-6 right-6 z-[1000] w-72 rounded-xl border bg-white/95 backdrop-blur shadow-lg">
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold">Patrol Recommendations</span>
            </div>
            <button
              onClick={() => setShowPatrol(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 p-3 max-h-60 overflow-y-auto">
            {topHotspots.map((h, i) => (
              <div key={h.hotspot_id} className="flex items-start gap-2 rounded-lg border bg-slate-50 p-2.5 text-xs">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] font-bold ${
                  i === 0 ? "bg-red-500" : i < 3 ? "bg-amber-500" : "bg-blue-500"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    Hotspot #{h.hotspot_id}
                    <span className="ml-1 text-muted-foreground">({h.incident_count} incidents)</span>
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Risk: {(h.risk_score * 100).toFixed(1)}% &middot;
                    Priority: {i === 0 ? "Critical" : i < 3 ? "High" : "Medium"}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>2 patrol units recommended</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-2.5 text-center">
            <button
              onClick={() => fetchHotspots()}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <TrendingUp className="mr-1 inline h-3 w-3" />
              Refresh hotspot data
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[1000] rounded-xl border bg-white/95 backdrop-blur p-3 shadow-lg">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Density</p>
        <div className="space-y-1">
          {[
            { color: "#22c55e", label: "Low (<50)" },
            { color: "#eab308", label: "Medium (50-200)" },
            { color: "#f59e0b", label: "High (200-500)" },
            { color: "#ef4444", label: "Critical (>500)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[10px]">
              <div className="h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-[10px]">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 border border-white shadow-sm" />
            <span className="text-muted-foreground">Case marker</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] mt-1">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-muted-foreground">Hotspot (critical)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
