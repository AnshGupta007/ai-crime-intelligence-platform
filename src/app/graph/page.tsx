"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Network, ZoomIn, ZoomOut, Maximize, Filter, Eye, Users, Target } from "lucide-react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

// Custom Node Component
function CaseNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-800 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20 min-w-[160px]">
      <Handle type="source" position={Position.Right} className="!bg-indigo-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-indigo-400 !w-3 !h-3" />
      <div className="text-xs font-bold text-indigo-300 uppercase mb-1">{data.nodeType}</div>
      <div className="text-sm font-medium text-white">{data.label}</div>
      <div className="text-xs text-slate-400 mt-1">{data.details}</div>
      {data.badge && <div className={cn("mt-2 px-2 py-1 rounded text-xs font-medium", data.badgeColor)}>{data.badge}</div>}
    </div>
  );
}

function PersonNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 min-w-[140px]">
      <Handle type="source" position={Position.Right} className="!bg-emerald-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-emerald-400 !w-3 !h-3" />
      <Handle type="source" position={Position.Top} className="!bg-emerald-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Bottom} className="!bg-emerald-400 !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">{data.label[0]}</div>
        <div>
          <div className="text-sm font-medium text-white">{data.label}</div>
          <div className="text-xs text-slate-400">{data.details}</div>
        </div>
      </div>
      {data.isRepeat && <div className="mt-1 px-2 py-0.5 rounded bg-red-500/20 text-xs font-medium text-red-400">REPEAT OFFENDER</div>}
    </div>
  );
}

function LocationNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-800 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 min-w-[130px]">
      <Handle type="source" position={Position.Right} className="!bg-cyan-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-cyan-400 !w-3 !h-3" />
      <div className="text-xs font-bold text-cyan-300 uppercase mb-1">📍 Location</div>
      <div className="text-sm font-medium text-white">{data.label}</div>
      <div className="text-xs text-slate-400 mt-1">{data.details}</div>
    </div>
  );
}

function WeaponNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-800 border-2 border-red-500/50 shadow-lg shadow-red-500/20 min-w-[120px]">
      <Handle type="source" position={Position.Right} className="!bg-red-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-red-400 !w-3 !h-3" />
      <div className="text-xs font-bold text-red-300 uppercase mb-1">🔫 Weapon</div>
      <div className="text-sm font-medium text-white">{data.label}</div>
    </div>
  );
}

function VehicleNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-800 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 min-w-[120px]">
      <Handle type="source" position={Position.Right} className="!bg-amber-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-amber-400 !w-3 !h-3" />
      <div className="text-xs font-bold text-amber-300 uppercase mb-1">🚗 Vehicle</div>
      <div className="text-sm font-medium text-white">{data.label}</div>
      <div className="text-xs text-slate-400 mt-1">{data.details}</div>
    </div>
  );
}

function PoliceNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-800 border-2 border-violet-500/50 shadow-lg shadow-violet-500/20 min-w-[150px]">
      <Handle type="source" position={Position.Right} className="!bg-violet-400 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-violet-400 !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">👮</div>
        <div>
          <div className="text-sm font-medium text-white">{data.label}</div>
          <div className="text-xs text-slate-400">{data.details}</div>
        </div>
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  case: CaseNode,
  person: PersonNode,
  location: LocationNode,
  weapon: WeaponNode,
  vehicle: VehicleNode,
  police: PoliceNode,
};

// Sample graph data representing a criminal network
const initialNodes: Node[] = [
  { id: "case-1", type: "case", position: { x: 400, y: 0 }, data: { nodeType: "FIR", label: "FIR/2025/0001", details: "Burglary - Koramangala", badge: "Under Investigation", badgeColor: "bg-amber-500/20 text-amber-400" } },
  { id: "case-2", type: "case", position: { x: 400, y: 200 }, data: { nodeType: "FIR", label: "FIR/2025/0045", details: "Vehicle Theft - MG Road", badge: "Chargesheeted", badgeColor: "bg-indigo-500/20 text-indigo-400" } },
  { id: "case-3", type: "case", position: { x: 400, y: 400 }, data: { nodeType: "FIR", label: "FIR/2025/0089", details: "Robbery - Indiranagar", badge: "High Profile", badgeColor: "bg-red-500/20 text-red-400" } },
  { id: "accused-1", type: "person", position: { x: 0, y: 100 }, data: { label: "Ravi Kumar", details: "32 yrs, Male, Bengaluru", isRepeat: true } },
  { id: "accused-2", type: "person", position: { x: 0, y: 250 }, data: { label: "Mohammed Ashraf", details: "28 yrs, Male, Mysuru", isRepeat: true } },
  { id: "accused-3", type: "person", position: { x: 0, y: 400 }, data: { label: "Venkatesh Prasad", details: "45 yrs, Male, Dharwad", isRepeat: true } },
  { id: "victim-1", type: "person", position: { x: 800, y: 50 }, data: { label: "Priya S", details: "35 yrs, Female", isRepeat: false } },
  { id: "victim-2", type: "person", position: { x: 800, y: 250 }, data: { label: "Suresh M", details: "42 yrs, Male", isRepeat: false } },
  { id: "location-1", type: "location", position: { x: 200, y: -100 }, data: { label: "Koramangala", details: "Bengaluru Urban" } },
  { id: "location-2", type: "location", position: { x: 200, y: 350 }, data: { label: "MG Road", details: "Bengaluru Central" } },
  { id: "weapon-1", type: "weapon", position: { x: -200, y: 300 }, data: { label: "Knife" } },
  { id: "vehicle-1", type: "vehicle", position: { x: -200, y: 150 }, data: { label: "KA-05-MZ-1234", details: "Honda Activa" } },
  { id: "vehicle-2", type: "vehicle", position: { x: -200, y: 450 }, data: { label: "KA-41-AB-5678", details: "Toyota Innova" } },
  { id: "police-1", type: "police", position: { x: 600, y: 100 }, data: { label: "Insp. Ramesh K", details: "Bengaluru Urban" } },
  { id: "police-2", type: "police", position: { x: 600, y: 300 }, data: { label: "SI Murthy D", details: "Mysuru" } },
  { id: "gang-1", type: "person", position: { x: -400, y: 180 }, data: { label: "Brigade Road Crew", details: "Gang — 6 members", isRepeat: false } },
  { id: "phone-1", type: "person", position: { x: -300, y: 50 }, data: { label: "📱 +91-98XXX", details: "Shared mobile", isRepeat: false } },
];

const initialEdges: Edge[] = [
  { id: "e-a1-c1", source: "accused-1", target: "case-1", label: "Accused in", markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" }, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e-a1-c2", source: "accused-1", target: "case-2", label: "Accused in", markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" }, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e-a2-c2", source: "accused-2", target: "case-2", label: "Co-accused", markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" }, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e-a3-c3", source: "accused-3", target: "case-3", label: "Accused in", markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" }, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e-v1-c1", source: "case-1", target: "victim-1", label: "Victim", markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" }, style: { stroke: "#10b981" } },
  { id: "e-v2-c2", source: "case-2", target: "victim-2", label: "Victim", markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" }, style: { stroke: "#10b981" } },
  { id: "e-l1-c1", source: "location-1", target: "case-1", label: "Location", markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" }, style: { stroke: "#06b6d4" } },
  { id: "e-l2-c2", source: "location-2", target: "case-2", label: "Location", markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" }, style: { stroke: "#06b6d4" } },
  { id: "e-w1-c3", source: "weapon-1", target: "case-3", label: "Weapon used", markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" }, style: { stroke: "#dc2626" } },
  { id: "e-v1-c2", source: "vehicle-1", target: "case-2", label: "Vehicle used", markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" }, style: { stroke: "#f59e0b" } },
  { id: "e-v2-c3", source: "vehicle-2", target: "case-3", label: "Vehicle used", markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" }, style: { stroke: "#f59e0b" } },
  { id: "e-p1-c1", source: "police-1", target: "case-1", label: "Investigating", markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" }, style: { stroke: "#8b5cf6" } },
  { id: "e-p2-c2", source: "police-2", target: "case-2", label: "Investigating", markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" }, style: { stroke: "#8b5cf6" } },
  { id: "e-g1-a1", source: "gang-1", target: "accused-1", label: "Gang member", markerEnd: { type: MarkerType.ArrowClosed, color: "#ec4899" }, style: { stroke: "#ec4899", strokeWidth: 3 } },
  { id: "e-g1-a2", source: "gang-1", target: "accused-2", label: "Gang member", markerEnd: { type: MarkerType.ArrowClosed, color: "#ec4899" }, style: { stroke: "#ec4899", strokeWidth: 3 } },
  { id: "e-phone-a1", source: "phone-1", target: "accused-1", label: "Shared phone", markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" }, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e-phone-a2", source: "phone-1", target: "accused-2", label: "Shared phone", markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" }, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e-a1-a3", source: "accused-1", target: "accused-3", label: "Shared address", markerEnd: { type: MarkerType.ArrowClosed, color: "#14b8a6" }, style: { stroke: "#14b8a6", strokeWidth: 1 } },
];

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [nodeCount, setNodeCount] = useState(initialNodes.length);
  const [edgeCount, setEdgeCount] = useState(initialEdges.length);

  const handleFilter = useCallback((filterType: string) => {
    setSelectedFilter(filterType);
    if (filterType === "all") {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setNodeCount(initialNodes.length);
      setEdgeCount(initialEdges.length);
    } else {
      const filteredNodes = initialNodes.filter(n => {
        if (filterType === "cases") return n.type === "case";
        if (filterType === "persons") return n.type === "person";
        if (filterType === "locations") return n.type === "location";
        if (filterType === "repeat") return n.data?.isRepeat === true;
        if (filterType === "gangs") return String(n.data?.details ?? "").includes("Gang");
        return true;
      });
      const nodeIds = filteredNodes.map(n => n.id);
      const filteredEdges = initialEdges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));
      setNodes(filteredNodes);
      setEdges(filteredEdges);
      setNodeCount(filteredNodes.length);
      setEdgeCount(filteredEdges.length);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Network className="w-7 h-7 text-indigo-400" />
            Criminal Network Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">Knowledge Graph &bull; Criminal Associations &bull; Gang Detection &bull; Community Detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">{nodeCount} Nodes</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">{edgeCount} Links</span>
          </div>
        </div>
      </motion.div>

      {/* Filter Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        {["all", "cases", "persons", "locations", "repeat", "gangs"].map((f) => (
          <button key={f} onClick={() => handleFilter(f)} className={cn("glass-card px-3 py-1.5 text-xs transition-all capitalize", selectedFilter === f ? "border-indigo-500/50 text-indigo-300" : "text-slate-400")}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Graph */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="h-[calc(100vh-220px)] rounded-xl overflow-hidden border border-slate-800/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={2}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          style={{ backgroundColor: "#0a0f1e" }}
        >
          <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg" />
          <Background color="#1e293b" gap={20} size={1} />
          <MiniMap
            nodeStrokeColor="#6366f1"
            nodeColor="#1e293b"
            nodeBorderRadius={8}
            maskColor="rgba(10, 15, 30, 0.8)"
            style={{ backgroundColor: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 8 }}
          />
        </ReactFlow>
      </motion.div>

      {/* Network Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-4 gap-3">
        {[
          { label: "Gang Communities", value: "3 detected", icon: "👥", color: "text-pink-400" },
          { label: "Shared Mobiles", value: "7 links", icon: "📱", color: "text-blue-400" },
          { label: "Shared Addresses", value: "4 links", icon: "🏠", color: "text-teal-400" },
          { label: "Shortest Path", value: "2 hops avg", icon: "🔗", color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-3 flex items-center gap-3">
            <span className="text-lg">{s.icon}</span>
            <div>
              <div className={cn("text-sm font-bold", s.color)}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
