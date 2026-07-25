import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import DistrictChoropleth from "./DistrictChoropleth";
import HotspotLayer from "./HotspotLayer";
import type { DistrictDensity, CrimeHotspot, CaseMapPin } from "@/types";

function MapBoundsHandler({ onBoundsChange }: { onBoundsChange: (b: { north: number; south: number; east: number; west: number }) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    },
  });

  useEffect(() => {
    const b = map.getBounds();
    onBoundsChange({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  }, []);

  return null;
}

function CaseMarkers({ cases }: { cases: CaseMapPin[] }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.clearLayers();
    } else {
      layerRef.current = L.layerGroup().addTo(map);
    }

    cases.forEach((c) => {
      if (!c.latitude || !c.longitude) return;

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:10px;height:10px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon });
      marker.bindPopup(`
        <div class="text-sm leading-relaxed">
          <p class="font-semibold text-base">${c.crime_no}</p>
          <p class="text-muted-foreground">${c.crime_head || "N/A"}</p>
          <p class="text-xs text-muted-foreground mt-1">Lat: ${c.latitude.toFixed(4)}, Lng: ${c.longitude.toFixed(4)}</p>
        </div>
      `);

      layerRef.current?.addLayer(marker);
    });

    return () => {
      if (layerRef.current) {
        layerRef.current.clearLayers();
      }
    };
  }, [cases, map]);

  return null;
}

interface CrimeMapProps {
  districts: DistrictDensity[];
  hotspots: CrimeHotspot[];
  caseMarkers: CaseMapPin[];
  showHotspots: boolean;
  showCases: boolean;
  showDistricts: boolean;
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function CrimeMap({
  districts, hotspots, caseMarkers,
  showHotspots, showCases, showDistricts,
  onBoundsChange,
}: CrimeMapProps) {
  return (
    <MapContainer
      center={[14.5, 76.5]}
      zoom={7}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapBoundsHandler onBoundsChange={onBoundsChange} />

      {showDistricts && <DistrictChoropleth districts={districts} />}
      {showHotspots && <HotspotLayer hotspots={hotspots} />}
      {showCases && <CaseMarkers cases={caseMarkers} />}
    </MapContainer>
  );
}
