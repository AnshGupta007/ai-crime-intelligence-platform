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
}

export interface NetworkEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface RepeatOffender {
  accused_master_id: number;
  accused_name: string;
  case_count: number;
}

export interface RiskScore {
  district_id: number;
  district_name: string;
  risk_score: number;
  risk_level: string;
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lower_bound: number | null;
  upper_bound: number | null;
}

export interface Community {
  id: number;
  size: number;
  members: string[];
}

export interface CommunityResponse {
  communities: Community[];
  total_nodes: number;
  total_edges: number;
}

export interface SearchResult {
  accused_master_id: number;
  accused_name: string;
  case_count: number;
}

export interface Anomaly {
  anomaly_id: number;
  anomaly_type: string;
  anomaly_score: number;
  description: string;
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
  district_name: string;
  crime_count: number;
  risk_score: number;
}

export interface SocioEconomicResponse {
  data: SocioEconomicPoint[];
}
