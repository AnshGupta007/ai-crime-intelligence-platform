"use client";

import { useEffect, useState } from "react";
import L from "leaflet";

interface CrimeMapProps {
  districts: { districtCode: number; districtName: string; count: number; latitude: string; longitude: string }[];
  hotspots: { id: string; latitude: string; longitude: string; intensityScore: string; crimeType: string; radiusKm: string; method: string; explanation: string; districtCode: number }[];
  showDistricts: boolean;
  showHotspots: boolean;
}

const CRIME_COLORS: Record<string, string> = {
  "Vehicle Theft": "#ef4444",
  "Burglary": "#f59e0b",
  "Chain Snatching": "#ec4899",
  "Tourist Fraud": "#06b6d4",
  "Communal Rioting": "#8b5cf6",
  "Cybercrime": "#3b82f6",
};

export default function CrimeMap({ districts, hotspots, showDistricts, showHotspots }: CrimeMapProps) {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    // Create map
    const map = L.map("crime-map-container", {
      center: [12.97, 77.59],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing layers
    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    const maxCount = Math.max(...districts.map(d => d.count));

    // Add district markers
    if (showDistricts) {
      districts.forEach((d) => {
        if (!d.latitude || !d.longitude) return;
        const size = Math.max(8, Math.min(40, (d.count / maxCount) * 40));
        const color = d.count > 2000 ? "#ef4444" : d.count > 500 ? "#f59e0b" : d.count > 200 ? "#6366f1" : "#10b981";
        
        L.circle([Number(d.latitude), Number(d.longitude)], {
          radius: size * 1000,
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(mapInstance)
          .bindPopup(`<div style="font-size:14px"><strong>${d.districtName}</strong><br>Total FIRs: <b>${d.count}</b></div>`);
      });
    }

    // Add hotspot markers
    if (showHotspots) {
      hotspots.forEach((h) => {
        const color = CRIME_COLORS[h.crimeType] || "#ef4444";
        const intensity = Number(h.intensityScore);
        const fillOpacity = intensity > 80 ? 0.4 : intensity > 60 ? 0.25 : 0.15;

        L.circle([Number(h.latitude), Number(h.longitude)], {
          radius: Number(h.radiusKm) * 1000,
          color: color,
          fillColor: color,
          fillOpacity: fillOpacity,
          weight: 3,
        }).addTo(mapInstance)
          .bindPopup(`<div style="font-size:14px"><strong style="color:${color}">${h.crimeType}</strong><br>Intensity: <b>${h.intensityScore}</b><br>Method: ${h.method}<br>${h.explanation}</div>`);
      });
    }
  }, [mapInstance, districts, hotspots, showDistricts, showHotspots]);

  return <div id="crime-map-container" style={{ height: "100%", width: "100%", borderRadius: "12px" }} />;
}
