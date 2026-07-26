import ForceGraph from "./ForceGraph";
import type { NetworkGraph as NetworkGraphType } from "@/types";

interface NetworkGraphProps {
  data: NetworkGraphType | null;
  highlightIds: Set<string>;
  selectedId: string | null;
  onNodeClick: (node: { id: string; label: string; node_type: string; weight: number }) => void;
  loading?: boolean;
}

export default function NetworkGraphWrapper({ data, highlightIds, selectedId, onNodeClick, loading }: NetworkGraphProps) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-slate-900/95">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading network...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.nodes.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-slate-900/95">
        <div className="text-center text-slate-500">
          <p className="text-lg font-medium mb-1">No Network Data</p>
          <p className="text-xs">Search for an accused or select a repeat offender to visualize</p>
        </div>
      </div>
    );
  }

  const nodes = data.nodes.map(n => ({
    id: n.id,
    label: n.label || n.name || n.id,
    node_type: n.node_type || n.type || "ACCUSED",
    weight: n.weight || 1
  }));

  const links = data.edges.map(e => ({
    source: e.source,
    target: e.target,
    relation: e.relation || e.label || "CONNECTED",
    weight: e.weight || 1
  }));

  return (
    <ForceGraph
      nodes={nodes}
      links={links}
      highlightIds={highlightIds}
      onNodeClick={onNodeClick}
      selectedId={selectedId}
    />
  );
}
