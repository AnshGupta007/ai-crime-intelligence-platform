import { X, User, FileText, MapPin, AlertTriangle, Link2, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface NodeDetail {
  id: string;
  label: string;
  node_type: string;
  weight: number;
}

interface LinkedCase {
  caseNo: string;
  relation: string;
}

interface NodeDetailsProps {
  node: NodeDetail | null;
  linkedCases?: LinkedCase[];
  onClose: () => void;
}

const TYPE_META: Record<string, { label: string; color: string; icon: typeof User }> = {
  accused: { label: "Accused", color: "text-blue-500 bg-blue-500/10", icon: User },
  case: { label: "Case", color: "text-yellow-500 bg-yellow-500/10", icon: FileText },
  victim: { label: "Victim", color: "text-green-500 bg-green-500/10", icon: User },
  location: { label: "Location", color: "text-red-500 bg-red-500/10", icon: MapPin },
};

const MO_PATTERNS: Record<string, string> = {
  "accused": "Repeat involvement across multiple cases indicates organized pattern. Modus operandi involves co-accused collaboration and cross-district operations.",
  "case": "Single incident case with documented evidence chain. Standard investigation protocol applicable.",
  "victim": "Victim pattern shows targeting in specific geographical and temporal windows.",
  "location": "Location serves as convergence point for multiple criminal activities.",
};

export default function NodeDetails({ node, linkedCases = [], onClose }: NodeDetailsProps) {
  if (!node) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center text-sm text-muted-foreground">
        <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-30" />
        <p>Click a node to view details</p>
      </div>
    );
  }

  const meta = TYPE_META[node.node_type] || TYPE_META.accused;
  const Icon = meta.icon;
  const moSummary = MO_PATTERNS[node.node_type] || MO_PATTERNS.accused;

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1.5 ${meta.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">Node Details</span>
        </div>
        <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Name</p>
          <p className="text-sm font-medium">{node.label}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Type</p>
          <Badge variant="outline">{meta.label}</Badge>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Node ID</p>
          <p className="text-xs font-mono text-muted-foreground">{node.id}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Centrality Score</p>
          <p className="text-sm font-medium">{(node.weight * 100).toFixed(1)}%</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Connections</p>
          <p className="text-sm font-medium">{Math.round(node.weight * 10)} linked entities</p>
        </div>

        {/* Linked Cases */}
        {node.node_type === "accused" && linkedCases.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Linked Cases</p>
            </div>
            <div className="space-y-1">
              {linkedCases.map((lc, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5">
                  <span className="text-xs font-mono text-blue-600">{lc.caseNo.replace("case-", "#")}</span>
                  <Badge variant="outline" className="text-[9px]">{lc.relation}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MO Pattern Summary */}
        <div className="border-t pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-medium text-muted-foreground">MO Pattern Summary</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{moSummary}</p>
        </div>

        {/* Risk Assessment */}
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Risk Assessment</p>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Score: {Math.min(100, Math.round(node.weight * 100))}/100
          </p>
        </div>
      </div>
    </div>
  );
}
