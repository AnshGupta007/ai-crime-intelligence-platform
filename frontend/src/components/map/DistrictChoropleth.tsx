import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { DISTRICT_GEO } from "@/lib/karnataka-geo";
import type { DistrictDensity } from "@/types";

function getDensityColor(count: number): string {
  if (count > 500) return "#ef4444";
  if (count > 200) return "#f59e0b";
  if (count > 50) return "#eab308";
  return "#22c55e";
}

function getDensityOpacity(count: number): number {
  return Math.min(0.15 + (count / 1000) * 0.4, 0.55);
}

export default function DistrictChoropleth({ districts }: { districts: DistrictDensity[] }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.clearLayers();
    } else {
      layerRef.current = L.layerGroup().addTo(map);
    }

    districts.forEach((d) => {
      const geo = DISTRICT_GEO.find((g) => g.id === d.district_id);
      if (!geo) return;

      const [[south, west], [north, east]] = geo.bounds;
      const color = getDensityColor(d.count);
      const opacity = getDensityOpacity(d.count);

      const rect = L.rectangle([[south, west], [north, east]], {
        color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: opacity,
        opacity: 0.7,
      });

      rect.bindPopup(`
        <div class="text-sm">
          <p class="font-semibold">${d.district_name}</p>
          <p>FIRs (30d): ${d.count}</p>
          <p>Density: ${d.density?.toFixed(2) || "N/A"}</p>
        </div>
      `);

      rect.on("mouseover", () => {
        rect.setStyle({ weight: 3, fillOpacity: Math.min(opacity + 0.2, 0.75) });
      });
      rect.on("mouseout", () => {
        rect.setStyle({ weight: 1.5, fillOpacity: opacity });
      });

      layerRef.current?.addLayer(rect);
    });

    return () => {
      if (layerRef.current) {
        layerRef.current.clearLayers();
      }
    };
  }, [districts, map]);

  return null;
}
