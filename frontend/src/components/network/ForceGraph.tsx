import { useEffect, useRef, useState, useCallback } from "react";

interface FGNode {
  id: string;
  label: string;
  node_type: string;
  weight: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface FGLink {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

interface ForceGraphProps {
  nodes: FGNode[];
  links: FGLink[];
  highlightIds: Set<string>;
  onNodeClick: (node: FGNode) => void;
  selectedId: string | null;
}

const W = 800;
const H = 600;
const REPULSION = 6000;
const ATTRACTION = 0.005;
const CENTERING = 0.02;
const DAMPING = 0.85;
const MIN_DIST = 30;
const NODE_COLORS: Record<string, string> = {
  accused: "#3b82f6",
  case: "#eab308",
  victim: "#22c55e",
  location: "#ef4444",
};

export default function ForceGraph({ nodes, links, highlightIds, onNodeClick, selectedId }: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [simNodes, setSimNodes] = useState<FGNode[]>([]);
  const [dim, setDim] = useState({ w: W, h: H });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ node: FGNode | null; ox: number; oy: number }>({ node: null, ox: 0, oy: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDim({ w: rect.width || W, h: rect.height || H });
  }, []);

  useEffect(() => {
    const cx = dim.w / 2;
    const cy = dim.h / 2;
    const radius = Math.min(dim.w, dim.h) * 0.35;

    const initialized = nodes.map((n, i) => ({
      ...n,
      x: cx + radius * Math.cos((2 * Math.PI * i) / nodes.length),
      y: cy + radius * Math.sin((2 * Math.PI * i) / nodes.length),
      vx: 0,
      vy: 0,
    }));

    setSimNodes(initialized);

    let running = true;
    const simulate = () => {
      if (!running) return;
      setSimNodes((prev) => {
        const next = prev.map((n) => ({ ...n }));
        const linkMap = new Map<string, number>();
        links.forEach((l) => {
          linkMap.set(`${l.source}->${l.target}`, l.weight);
          linkMap.set(`${l.target}->${l.source}`, l.weight);
        });

        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = (next[j].x || 0) - (next[i].x || 0);
            const dy = (next[j].y || 0) - (next[i].y || 0);
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), MIN_DIST);
            const force = REPULSION / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            next[i].vx = (next[i].vx || 0) - fx;
            next[i].vy = (next[i].vy || 0) - fy;
            next[j].vx = (next[j].vx || 0) + fx;
            next[j].vy = (next[j].vy || 0) + fy;
          }
        }

        for (const link of links) {
          const s = next.find((n) => n.id === link.source);
          const t = next.find((n) => n.id === link.target);
          if (!s || !t) continue;
          const dx = (t.x || 0) - (s.x || 0);
          const dy = (t.y || 0) - (s.y || 0);
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), MIN_DIST);
          const force = ATTRACTION * (dist - 100) * link.weight;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          s.vx = (s.vx || 0) + fx;
          s.vy = (s.vy || 0) + fy;
          t.vx = (t.vx || 0) - fx;
          t.vy = (t.vy || 0) - fy;
        }

        for (const n of next) {
          n.vx = (n.vx || 0) + (dim.w / 2 - (n.x || 0)) * CENTERING;
          n.vy = (n.vy || 0) + (dim.h / 2 - (n.y || 0)) * CENTERING;
          n.vx = (n.vx || 0) * DAMPING;
          n.vy = (n.vy || 0) * DAMPING;
          n.x = (n.x || 0) + (n.vx || 0);
          n.y = (n.y || 0) + (n.vy || 0);
        }

        return next;
      });
      requestAnimationFrame(simulate);
    };

    const timer = requestAnimationFrame(simulate);
    return () => {
      running = false;
      cancelAnimationFrame(timer);
    };
  }, [nodes, links, dim]);

  const getNodeColor = (nt: string) => NODE_COLORS[nt] || "#8b5cf6";
  const getNodeSize = (w: number) => Math.max(5, w * 8);

  const handleMouseDown = useCallback((e: React.MouseEvent, node: FGNode) => {
    dragRef.current = { node, ox: e.clientX, oy: e.clientY };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.node) return;
      const dx = (e.clientX - dragRef.current.ox) / zoom;
      const dy = (e.clientY - dragRef.current.oy) / zoom;
      setSimNodes((prev) =>
        prev.map((n) =>
          n.id === dragRef.current.node?.id ? { ...n, x: (n.x || 0) + dx, y: (n.y || 0) + dy } : n
        )
      );
      dragRef.current.ox = e.clientX;
      dragRef.current.oy = e.clientY;
    };
    const handleMouseUp = () => { dragRef.current.node = null; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoom]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border bg-slate-900/95">
      <svg width={dim.w} height={dim.h} className="cursor-grab active:cursor-grabbing">
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {links.map((link, i) => {
            const s = simNodes.find((n) => n.id === link.source);
            const t = simNodes.find((n) => n.id === link.target);
            if (!s || !t) return null;
            return (
              <line
                key={`link-${i}`}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="rgba(148,163,184,0.3)"
                strokeWidth={Math.max(0.5, link.weight)}
              />
            );
          })}

          {simNodes.map((n) => {
            const size = getNodeSize(n.weight);
            const color = getNodeColor(n.node_type);
            const isHighlighted = highlightIds.has(n.id);
            const isSelected = selectedId === n.id;
            const isHovered = hoveredId === n.id;

            return (
              <g key={n.id} className="transition-opacity duration-200">
                {isHighlighted && (
                  <circle cx={n.x} cy={n.y} r={size + 8} fill="none" stroke="#f59e0b" strokeWidth={2} opacity={0.6}>
                    <animate attributeName="r" from={size + 4} to={size + 12} dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from={0.6} to={0} dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={n.x} cy={n.y} r={size}
                  fill={isSelected ? "#f59e0b" : isHovered ? "#60a5fa" : color}
                  stroke={isSelected ? "#fff" : isHovered ? "#93c5fd" : "rgba(255,255,255,0.5)"}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                  style={{ cursor: "pointer", filter: isSelected ? "drop-shadow(0 0 6px rgba(245,158,11,0.6))" : undefined }}
                  onClick={() => onNodeClick(n)}
                  onMouseEnter={() => setHoveredId(n.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onMouseDown={(e) => handleMouseDown(e, n)}
                />
                <text
                  x={n.x} y={(n.y || 0) + size + 14}
                  textAnchor="middle"
                  fill={isHighlighted ? "#f59e0b" : "#cbd5e1"}
                  fontSize={isHighlighted ? 11 : 9}
                  fontWeight={isHighlighted ? "bold" : "normal"}
                  pointerEvents="none"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {n.label.length > 20 ? n.label.slice(0, 18) + "..." : n.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-3 right-3 flex gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
          className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
        >
          Reset
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.2))}
          className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
        >
          -
        </button>
      </div>
      <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] text-slate-500">
        <span><span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1" />Accused</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1" />Case</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1" />Victim</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1" />Location</span>
      </div>
    </div>
  );
}
