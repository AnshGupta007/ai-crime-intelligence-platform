export interface User {
  user_id: number;
  username: string;
  role: string;
  district_id: number | null;
  station_id: number | null;
}

export interface KpiSummary {
  total_firs: number;
  today_firs: number;
  active_hotspots: number;
  critical_alerts: number;
  mom_change: number;
  yoy_change: number;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface CrimeCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface Alert {
  alert_id: number;
  title: string;
  severity: string;
  description: string;
  created_at: string;
}

export interface RecentCase {
  case_master_id: number;
  crime_no: string;
  date: string;
  type: string;
  district: string;
  status: string;
}

export interface CaseDetail {
  case_master_id: number;
  crime_no: string;
  crime_registered_date: string;
  crime_group_name: string;
  district_name: string;
  case_status_name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface CaseMapPin {
  case_master_id: number;
  crime_no: string;
  latitude: number;
  longitude: number;
  crime_head: string | null;
}

export interface CrimeHotspot {
  hotspot_id: number;
  latitude: number;
  longitude: number;
  radius_meters: number;
  incident_count: number;
  risk_score: number;
}

export interface DistrictDensity {
  district_id: number;
  district_name: string;
  count: number;
  density: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  node_type: string;
  weight: number;
  name?: string;
  type?: string;
  group?: number;
  case_count?: number;
  district?: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
  label?: string;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  metrics?: {
    total_nodes: number;
    total_edges: number;
    density: number;
    avg_degree: number;
    clustering_coefficient: number;
  };
}

export interface RepeatOffender {
  id?: number;
  accused_master_id?: number;
  name?: string;
  accused_name?: string;
  case_count: number;
  crime_types?: string[];
  districts?: string[];
  last_crime_date?: string;
  risk_score?: number;
  district?: string;
}

export interface RiskScore {
  district_id: number;
  district_name: string;
  risk_score: number;
  risk_level: string;
  crime_rate_per_100k?: number;
  predicted_trend?: string;
  primary_factors?: string[];
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  predicted_count?: number;
  lower_bound: number | null;
  upper_bound: number | null;
  confidence?: number;
}

export interface Community {
  id?: number;
  community_id?: number;
  name?: string;
  size: number;
  members: string[];
  primary_districts?: string[];
  threat_level?: string;
}

export interface CommunityResponse {
  communities: Community[];
  communities_count?: number;
  modularity_score?: number;
  total_nodes?: number;
  total_edges?: number;
}

export interface SearchResult {
  accused_master_id: number;
  accused_name: string;
  case_count: number;
  id?: number;
  name?: string;
  district?: string;
}

export interface Anomaly {
  anomaly_id: number;
  anomaly_type: string;
  category_name?: string;
  station_name?: string;
  district_name?: string;
  actual_count?: number;
  expected_count?: number;
  deviation_factor?: number;
  z_score?: number;
  anomaly_score: number;
  description: string;
  reasoning?: string;
  severity?: string;
  detected_at: string;
  reviewed: boolean;
}

export interface ForecastResponse {
  points: ForecastPoint[];
  district_id: number | null;
  category_id: number | null;
}

export interface SocioEconomicPoint {
  district_id: number;
  district: string;
  district_name?: string;
  crime_count: number;
  crime_rate?: number;
  risk_score?: number;
  population?: number;
  literacy_rate?: number;
  urbanization_pct?: number;
  urbanization_rate?: number;
  unemployment_pct?: number;
  unemployment_rate?: number;
}

export interface SocioEconomicResponse {
  data: SocioEconomicPoint[];
}

export interface SocioEconomicInsights {
  literacy_crime_correlation?: number;
  urbanization_crime_correlation?: number;
  unemployment_crime_correlation?: number;
  correlations?: {
    literacy_vs_crime: number;
    unemployment_vs_crime: number;
    urbanization_vs_crime: number;
  };
  insights?: string[];
  key_findings?: string[];
}
