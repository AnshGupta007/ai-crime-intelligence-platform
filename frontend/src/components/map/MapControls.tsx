import { useState } from "react";
import { Layers, MapPin, Thermometer, Shield, Mountain } from "lucide-react";
import TimeSlider from "./TimeSlider";

interface LayerState {
  heatmap: boolean;
  policeStations: boolean;
  hotspots: boolean;
  cases: boolean;
}

interface MapControlsProps {
  layers: LayerState;
  onLayerToggle: (key: keyof LayerState) => void;
  timeRange: [number, number];
  onTimeChange: (range: [number, number]) => void;
  categoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  dateRange: [string, string];
  onDateChange: (range: [string, string]) => void;
}

const toggleButtons: { key: keyof LayerState; label: string; icon: typeof MapPin }[] = [
  { key: "heatmap", label: "Heatmap", icon: Thermometer },
  { key: "policeStations", label: "Stations", icon: Shield },
  { key: "hotspots", label: "Hotspots", icon: Mountain },
  { key: "cases", label: "Cases", icon: MapPin },
];

const CATEGORIES = [
  { id: null, label: "All Crime Types" },
  { id: 1, label: "Murder" },
  { id: 2, label: "Theft" },
  { id: 3, label: "Cybercrime" },
  { id: 4, label: "Burglary" },
  { id: 5, label: "Rape" },
];

export default function MapControls({
  layers, onLayerToggle, timeRange, onTimeChange,
  categoryId, onCategoryChange, dateRange, onDateChange,
}: MapControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`absolute left-4 top-4 z-[1000] rounded-xl border bg-white/95 backdrop-blur shadow-lg transition-all ${
        collapsed ? "w-12" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between border-b p-3">
        {!collapsed && <span className="text-sm font-semibold">Map Controls</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 hover:bg-muted text-muted-foreground"
        >
          <Layers className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-4 p-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Layers</p>
            {toggleButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.key}
                  onClick={() => onLayerToggle(btn.key)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    layers[btn.key]
                      ? "bg-blue-100 text-blue-700"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {btn.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Crime Type</p>
            <select
              value={categoryId ?? ""}
              onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg border px-2.5 py-1.5 text-xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id ?? "all"} value={c.id ?? ""}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date Range</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange[0]}
                onChange={(e) => onDateChange([e.target.value, dateRange[1]])}
                className="w-full rounded-lg border px-2 py-1 text-xs"
              />
              <input
                type="date"
                value={dateRange[1]}
                onChange={(e) => onDateChange([dateRange[0], e.target.value])}
                className="w-full rounded-lg border px-2 py-1 text-xs"
              />
            </div>
          </div>

          <TimeSlider value={timeRange} onChange={onTimeChange} />
        </div>
      )}
    </div>
  );
}
