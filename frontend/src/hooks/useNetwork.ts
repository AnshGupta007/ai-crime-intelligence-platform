import { useState, useCallback } from "react";
import api from "@/lib/api";
import type { NetworkGraph, RepeatOffender, CommunityResponse, SearchResult } from "@/types";

export function useNetwork() {
  const [graph, setGraph] = useState<NetworkGraph | null>(null);
  const [repeatOffenders, setRepeatOffenders] = useState<RepeatOffender[]>([]);
  const [communities, setCommunities] = useState<CommunityResponse | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchAccusedNetwork = useCallback(async (accusedId: number, depth = 2) => {
    setGraphLoading(true);
    try {
      const data = await api.get<NetworkGraph>(`/network/accused/${accusedId}`, { depth });
      setGraph(data);
    } catch { /* ignore */ }
    setGraphLoading(false);
  }, []);

  const fetchRepeatOffenders = useCallback(async (minCases = 2) => {
    try {
      const data = await api.get<RepeatOffender[]>("/network/repeat-offenders", { min_cases: minCases });
      setRepeatOffenders(data);
    } catch { /* ignore */ }
  }, []);

  const fetchCommunities = useCallback(async () => {
    try {
      const data = await api.get<CommunityResponse>("/network/communities");
      setCommunities(data);
    } catch { /* ignore */ }
  }, []);

  const searchAccused = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await api.get<SearchResult[]>("/network/search", { q: query });
      setSearchResults(data);
    } catch { /* ignore */ }
    setSearchLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchRepeatOffenders(),
      fetchCommunities(),
    ]);
  }, [fetchRepeatOffenders, fetchCommunities]);

  return {
    graph, graphLoading,
    repeatOffenders, communities,
    searchResults, searchLoading,
    fetchAccusedNetwork, fetchRepeatOffenders,
    fetchCommunities, searchAccused, refresh,
  };
}

export default useNetwork;
