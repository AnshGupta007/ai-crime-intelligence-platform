"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Layers, Filter, Target, Brain } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const CrimeMap = dynamic(() => import("@/components/crime-map"), { ssr: false });

interface MapData {
  casesByDistrict: { districtCode: number; districtName: string; count: number; latitude: string; longitude: string }[];
  hotspots: { id: string; latitude: string; longitude: string; intensityScore: string; crimeType: string; radiusKm: string; method: string; explanation: string; districtCode: number }[];
}

export default function MapPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);

  useEffect(() => {
    // Load Leaflet CSS dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => setData({ casesByDistrict: d.casesByDistrict, hotspots: d.hotspots }))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading Crime Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MapPin className="w-7 h-7 text-indigo-400" />
            Crime Geo Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">Karnataka District Crime Map &bull; Hotspot Detection &bull; KDE + DBSCAN</p>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setShowDistricts(!showDistricts)} className={cn("glass-card px-4 py-2 flex items-center gap-2 transition-all", showDistricts ? "border-indigo-500/50 text-indigo-300" : "text-slate-500")}>
          <Layers className="w-4 h-4" /> Districts
        </button>
        <button onClick={() => setShowHotspots(!showHotspots)} className={cn("glass-card px-4 py-2 flex items-center gap-2 transition-all", showHotspots ? "border-red-500/50 text-red-300" : "text-slate-500")}>
          <Target className="w-4 h-4" /> Hotspots
        </button>
      </motion.div>

      {/* Map */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="relative h-[calc(100vh-220px)] rounded-xl overflow-hidden border border-slate-800/50">
        <CrimeMap districts={data.casesByDistrict} hotspots={data.hotspots} showDistricts={showDistricts} showHotspots={showHotspots} />

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 glass-card p-3 space-y-2 z-[1000]">
          <span className="text-xs font-medium text-indigo-300">Legend</span>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-slate-400">High Crime (&gt;2000)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs text-slate-400">Medium Crime (500-2000)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-xs text-slate-400">Normal Crime (200-500)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-slate-400">Low Crime (&lt;200)</span></div>
          {showHotspots && <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500" /><span className="text-xs text-slate-400">AI Hotspot Prediction</span></div>}
        </div>

        {/* Stats overlay */}
        <div className="absolute top-4 left-4 glass-card p-3 z-[1000]">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">AI Predictions Active</span>
          </div>
          <div className="text-xs text-slate-400">
            {data.hotspots.length} hotspot predictions<br />
            KDE + DBSCAN clustering<br />
            Updated: Today
          </div>
        </div>
      </motion.div>
    </div>
  );
}
