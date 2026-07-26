import { Users, Share2, GitBranch, Layers, Network } from "lucide-react";
import type { CommunityResponse } from "@/types";

interface NetworkMetricsProps {
  nodeCount: number;
  edgeCount: number;
  communities: CommunityResponse | null;
}

export default function NetworkMetrics({ nodeCount, edgeCount, communities }: NetworkMetricsProps) {
  const avgDegree = nodeCount > 0 ? (edgeCount / nodeCount).toFixed(1) : "0";
  const communityCount = communities?.communities?.length || 0;
  const totalNodes = communities?.total_nodes || nodeCount || 1;
  const totalEdges = communities?.total_edges || edgeCount || 0;
  const clusterCoef = totalNodes > 1
    ? (2 * totalEdges / Math.max(1, totalNodes * (totalNodes - 1))).toFixed(3)
    : "0";

  const cards = [
    { label: "Nodes", value: nodeCount.toString(), icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { label: "Edges", value: edgeCount.toString(), icon: Share2, color: "text-purple-500 bg-purple-500/10" },
    { label: "Avg Degree", value: avgDegree, icon: GitBranch, color: "text-amber-500 bg-amber-500/10" },
    { label: "Clustering Coef", value: clusterCoef, icon: Network, color: "text-cyan-500 bg-cyan-500/10" },
    { label: "Communities", value: communityCount.toString(), icon: Layers, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.label}</p>
                <p className="text-lg font-bold mt-0.5">{card.value}</p>
              </div>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
