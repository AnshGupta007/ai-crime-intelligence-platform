import { useEffect, useState, useCallback } from "react";
import { Search, Users, ArrowRight, Filter, X } from "lucide-react";
import useNetwork from "@/hooks/useNetwork";
import NetworkGraph from "@/components/network/NetworkGraph";
import NodeDetails from "@/components/network/NodeDetails";
import NetworkMetrics from "@/components/network/NetworkMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KARNATAKA_DISTRICTS, CRIME_TYPES } from "@/lib/constants";

export default function Network() {
  const {
    graph, graphLoading, repeatOffenders, communities,
    searchResults, searchLoading,
    fetchAccusedNetwork, searchAccused, refresh,
  } = useNetwork();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<{ id: string; label: string; node_type: string; weight: number } | null>(null);
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterCrimeType, setFilterCrimeType] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    searchAccused(query);
  }, [searchAccused]);

  const handleSelectAccused = useCallback((id: number, name: string) => {
    fetchAccusedNetwork(id);
    setSelectedNode(null);
    setHighlightIds(new Set([`accused-${id}`]));
    setSearchQuery("");
  }, [fetchAccusedNetwork]);

  const handleNodeClick = useCallback((node: { id: string; label: string; node_type: string; weight: number }) => {
    setSelectedNode(node);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterDistrict("");
    setFilterCrimeType("");
  }, []);

  const nodeCount = graph?.nodes?.length || 0;
  const edgeCount = graph?.edges?.length || 0;
  const hasFilters = filterDistrict || filterCrimeType;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Network Analysis</h1>
      </div>

      {/* Search + Graph + Details */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Left: Graph area */}
        <div className="xl:col-span-3 space-y-4">
          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search accused by name..."
                className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {searchResults.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border bg-white shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((r, idx) => {
                    const accId = r.accused_master_id || r.id || (idx + 100);
                    const accName = r.accused_name || r.name || "Unknown Accused";
                    return (
                      <button
                        key={accId}
                        onClick={() => handleSelectAccused(accId, accName)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{accName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{r.case_count} cases</Badge>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              )}
            </div>

            {/* Filter dropdowns */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="rounded-xl border bg-white px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Districts</option>
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={filterCrimeType}
                onChange={(e) => setFilterCrimeType(e.target.value)}
                className="rounded-xl border bg-white px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Crimes</option>
                {CRIME_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl border px-2.5 py-2.5 text-xs text-muted-foreground hover:bg-slate-50"
                  title="Clear filters"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Graph */}
          <div className="h-[500px]">
            <NetworkGraph
              data={graph}
              highlightIds={highlightIds}
              selectedId={selectedNode?.id || null}
              onNodeClick={handleNodeClick}
              loading={graphLoading}
            />
          </div>

          {/* Network Metrics */}
          <NetworkMetrics nodeCount={nodeCount} edgeCount={edgeCount} communities={communities} />
        </div>

        {/* Right: Node Details & Repeat Offenders */}
        <div className="space-y-4">
          <NodeDetails
            node={selectedNode}
            linkedCases={graph?.edges
              ?.filter((e) => e.source === selectedNode?.id || e.target === selectedNode?.id)
              ?.map((e) => ({
                caseNo: e.source.startsWith("case-") ? e.source : e.target,
                relation: e.relation || e.label || "CONNECTED",
              })) || []}
            onClose={() => setSelectedNode(null)}
          />

          {/* Repeat Offenders Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Repeat Offenders</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[320px] overflow-y-auto space-y-1.5 p-3 pt-0">
              {repeatOffenders.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No repeat offenders found</p>
              ) : (
                repeatOffenders.slice(0, 10).map((offender, idx) => {
                  const offId = offender.accused_master_id || offender.id || (idx + 100);
                  const offName = offender.accused_name || offender.name || "Unknown Offender";
                  return (
                    <button
                      key={offId}
                      onClick={() => handleSelectAccused(offId, offName)}
                      className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-slate-50"
                    >
                      <span className="font-medium truncate">{offName}</span>
                      <Badge variant="secondary">{offender.case_count}</Badge>
                    </button>
                  );
                })
              )}
              {repeatOffenders.length > 0 && (
                <button
                  onClick={() => refresh()}
                  className="w-full text-center text-[10px] text-blue-600 hover:text-blue-700 mt-2"
                >
                  Refresh list
                </button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
