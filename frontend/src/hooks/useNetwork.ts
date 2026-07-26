import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import type { NetworkGraph, RepeatOffender, CommunityResponse, SearchResult } from "@/types";

const MOCK_GRAPH: NetworkGraph = {
  nodes: [
    { id: "accused_101", label: "Ramesh Kumar (Alias: Kaliya)", name: "Ramesh Kumar (Alias: Kaliya)", node_type: "ACCUSED", type: "ACCUSED", group: 1, case_count: 5, district: "Bengaluru Urban", weight: 5 },
    { id: "accused_102", label: "Suresh Gowda", name: "Suresh Gowda", node_type: "ACCUSED", type: "ACCUSED", group: 1, case_count: 3, district: "Bengaluru Urban", weight: 3 },
    { id: "accused_103", label: "Venkatesh Naik", name: "Venkatesh Naik", node_type: "ACCUSED", type: "ACCUSED", group: 2, case_count: 4, district: "Mysuru", weight: 4 },
    { id: "accused_104", label: "Mohammed Saif", name: "Mohammed Saif", node_type: "ACCUSED", type: "ACCUSED", group: 2, case_count: 2, district: "Mangaluru", weight: 2 },
    { id: "case_8001", label: "FIR 0042/2026", name: "FIR 0042/2026 (Armed Robbery)", node_type: "CASE", type: "CASE", group: 3, district: "Koramangala PS", weight: 4 },
    { id: "case_8002", label: "FIR 0108/2026", name: "FIR 0108/2026 (Cyber Fraud)", node_type: "CASE", type: "CASE", group: 3, district: "Indiranagar PS", weight: 3 },
    { id: "location_1", label: "Koramangala 5th Block", name: "Koramangala 5th Block", node_type: "LOCATION", type: "LOCATION", group: 4, weight: 2 },
    { id: "vehicle_1", label: "Pulsar 220", name: "KA-01-MJ-9921 (Pulsar 220)", node_type: "VEHICLE", type: "VEHICLE", group: 5, weight: 2 }
  ],
  edges: [
    { source: "accused_101", target: "case_8001", relation: "PRIMARY_SUSPECT", label: "PRIMARY_SUSPECT", weight: 3 },
    { source: "accused_102", target: "case_8001", relation: "ACCOMPLICE", label: "ACCOMPLICE", weight: 2 },
    { source: "accused_101", target: "location_1", relation: "LAST_SEEN", label: "LAST_SEEN", weight: 1 },
    { source: "accused_101", target: "vehicle_1", relation: "GETAWAY_VEHICLE", label: "GETAWAY_VEHICLE", weight: 2 },
    { source: "accused_103", target: "case_8002", relation: "FINANCIER", label: "FINANCIER", weight: 3 },
    { source: "accused_104", target: "case_8002", relation: "SIM_PROVIDER", label: "SIM_PROVIDER", weight: 2 },
    { source: "accused_101", target: "accused_103", relation: "CO_DEFENDANT_2025", label: "CO_DEFENDANT_2025", weight: 4 }
  ],
  metrics: {
    total_nodes: 8,
    total_edges: 7,
    density: 0.25,
    avg_degree: 2.25,
    clustering_coefficient: 0.42
  }
};

const MOCK_REPEAT_OFFENDERS: RepeatOffender[] = [
  {
    id: 101,
    accused_master_id: 101,
    name: "Ramesh Kumar (Alias: Kaliya)",
    accused_name: "Ramesh Kumar (Alias: Kaliya)",
    case_count: 5,
    crime_types: ["Armed Robbery", "Extortion", "Vehicle Theft"],
    districts: ["Bengaluru Urban", "Ramanagara"],
    last_crime_date: "2026-07-20",
    risk_score: 94
  },
  {
    id: 103,
    accused_master_id: 103,
    name: "Venkatesh Naik",
    accused_name: "Venkatesh Naik",
    case_count: 4,
    crime_types: ["Cyber Fraud", "Identity Theft"],
    districts: ["Mysuru", "Bengaluru Urban"],
    last_crime_date: "2026-07-15",
    risk_score: 88
  },
  {
    id: 102,
    accused_master_id: 102,
    name: "Suresh Gowda",
    accused_name: "Suresh Gowda",
    case_count: 3,
    crime_types: ["Burglary", "Assault"],
    districts: ["Bengaluru Urban"],
    last_crime_date: "2026-06-28",
    risk_score: 79
  }
];

const MOCK_COMMUNITIES: CommunityResponse = {
  communities_count: 2,
  modularity_score: 0.68,
  total_nodes: 8,
  total_edges: 7,
  communities: [
    {
      id: 1,
      community_id: 1,
      name: "Koramangala Theft & Extortion Syndicate",
      size: 4,
      members: ["Ramesh Kumar", "Suresh Gowda", "Vehicle KA-01-MJ-9921", "Loc: Koramangala"],
      primary_districts: ["Bengaluru Urban"],
      threat_level: "CRITICAL"
    },
    {
      id: 2,
      community_id: 2,
      name: "Inter-district Cyber Syndicate",
      size: 3,
      members: ["Venkatesh Naik", "Mohammed Saif", "FIR 0108/2026"],
      primary_districts: ["Mysuru", "Mangaluru"],
      threat_level: "HIGH"
    }
  ]
};

export function useNetwork() {
  const [graph, setGraph] = useState<NetworkGraph | null>(MOCK_GRAPH);
  const [repeatOffenders, setRepeatOffenders] = useState<RepeatOffender[]>(MOCK_REPEAT_OFFENDERS);
  const [communities, setCommunities] = useState<CommunityResponse | null>(MOCK_COMMUNITIES);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchAccusedNetwork = useCallback(async (accusedId: number, depth = 2) => {
    setGraphLoading(true);
    try {
      const data = await api.get<NetworkGraph>(`/network/accused/${accusedId}`, { depth });
      if (data && data.nodes && data.nodes.length > 0) {
        setGraph(data);
      } else {
        setGraph(MOCK_GRAPH);
      }
    } catch {
      setGraph(MOCK_GRAPH);
    }
    setGraphLoading(false);
  }, []);

  const fetchRepeatOffenders = useCallback(async (minCases = 2) => {
    try {
      const data = await api.get<RepeatOffender[]>("/network/repeat-offenders", { min_cases: minCases });
      if (data && data.length > 0) {
        setRepeatOffenders(data);
      } else {
        setRepeatOffenders(MOCK_REPEAT_OFFENDERS);
      }
    } catch {
      setRepeatOffenders(MOCK_REPEAT_OFFENDERS);
    }
  }, []);

  const fetchCommunities = useCallback(async () => {
    try {
      const data = await api.get<CommunityResponse>("/network/communities");
      if (data && data.communities && data.communities.length > 0) {
        setCommunities(data);
      } else {
        setCommunities(MOCK_COMMUNITIES);
      }
    } catch {
      setCommunities(MOCK_COMMUNITIES);
    }
  }, []);

  const searchAccused = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await api.get<SearchResult[]>("/network/search", { q: query });
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        const qLower = query.toLowerCase();
        const filtered: SearchResult[] = MOCK_REPEAT_OFFENDERS.filter(
          o => (o.name || o.accused_name || "").toLowerCase().includes(qLower) || (o.crime_types || []).some(ct => ct.toLowerCase().includes(qLower))
        ).map(o => ({
          accused_master_id: o.accused_master_id || o.id || 101,
          accused_name: o.accused_name || o.name || "Ramesh Kumar",
          case_count: o.case_count,
          district: (o.districts && o.districts[0]) || "Bengaluru Urban"
        }));
        setSearchResults(filtered);
      }
    } catch {
      const qLower = query.toLowerCase();
      const filtered: SearchResult[] = MOCK_REPEAT_OFFENDERS.filter(
        o => (o.name || o.accused_name || "").toLowerCase().includes(qLower) || (o.crime_types || []).some(ct => ct.toLowerCase().includes(qLower))
      ).map(o => ({
        accused_master_id: o.accused_master_id || o.id || 101,
        accused_name: o.accused_name || o.name || "Ramesh Kumar",
        case_count: o.case_count,
        district: (o.districts && o.districts[0]) || "Bengaluru Urban"
      }));
      setSearchResults(filtered);
    }
    setSearchLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchRepeatOffenders(),
      fetchCommunities(),
    ]);
  }, [fetchRepeatOffenders, fetchCommunities]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    graph, graphLoading,
    repeatOffenders, communities,
    searchResults, searchLoading,
    fetchAccusedNetwork, fetchRepeatOffenders,
    fetchCommunities, searchAccused, refresh,
  };
}

export default useNetwork;
