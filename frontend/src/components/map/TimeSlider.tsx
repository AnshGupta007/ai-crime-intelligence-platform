import { useState } from "react";
import { Clock } from "lucide-react";

interface TimeSliderProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function TimeSlider({ value, onChange }: TimeSliderProps) {
  const fmt = (h: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}${period}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Time Filter: {fmt(value[0])} — {fmt(value[1])}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-6 text-right">{fmt(value[0])}</span>
        <input
          type="range"
          min={0}
          max={23}
          value={value[0]}
          onChange={(e) => {
            const start = parseInt(e.target.value);
            const end = Math.max(start + 1, value[1]);
            onChange([start, Math.min(end, 23)]);
          }}
          className="flex-1 h-1.5 accent-blue-600"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-6 text-right">{fmt(value[1])}</span>
        <input
          type="range"
          min={1}
          max={23}
          value={value[1]}
          onChange={(e) => {
            const end = parseInt(e.target.value);
            const start = Math.min(end - 1, value[0]);
            onChange([Math.max(0, start), end]);
          }}
          className="flex-1 h-1.5 accent-blue-600"
        />
      </div>
    </div>
  );
}
