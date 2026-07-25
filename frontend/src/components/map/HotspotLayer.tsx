import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { CrimeHotspot } from "@/types";

function getRiskColor(score: number): string {
  if (score >= 0.7) return "#ef4444";
  if (score >= 0.4) return "#f59e0b";
  return "#10b981";
}

function getRiskOpacity(score: number): number {
  return 0.3 + score * 0.4;
}

export default function HotspotLayer({ hotspots }: { hotspots: CrimeHotspot[] }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.clearLayers();
    } else {
      layerRef.current = L.layerGroup().addTo(map);
    }

    hotspots.forEach((h) => {
      if (!h.latitude || !h.longitude) return;
      const color = getRiskColor(h.risk_score);
      const radius = Math.max(h.radius_meters || 200, 200);

      const circle = L.circle([h.latitude, h.longitude], {
        radius,
        color,
        fillColor: color,
        fillOpacity: getRiskOpacity(h.risk_score),
        weight: 2,
        opacity: 0.6,
      });

      circle.bindPopup(`
        <div class="text-sm">
          <p class="font-semibold">Hotspot #${h.hotspot_id}</p>
          <p>Incidents: ${h.incident_count}</p>
          <p>Risk Score: ${(h.risk_score * 100).toFixed(1)}%</p>
        </div>
      `);

      layerRef.current?.addLayer(circle);
    });

    return () => {
      if (layerRef.current) {
        layerRef.current.clearLayers();
      }
    };
  }, [hotspots, map]);

  return null;
}
