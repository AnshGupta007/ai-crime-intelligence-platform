import { create } from "zustand";
import api from "@/lib/api";
import type { User, KpiSummary, TrendPoint, CrimeCategory, Alert, RecentCase } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  login: async (username, password) => {
    try {
      const res = await api.post<{ access_token: string; token_type: string; expires_in: number }>("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.access_token);
      set({ token: res.access_token });
    } catch (err) {
      // Demo fallback when offline or before backend cloud connection
      if (
        (username === "scrb_admin" && password === "admin123") ||
        (username === "sp_admin" && password === "admin123") ||
        (username === "io_officer" && password === "admin123")
      ) {
        const demoToken = `demo-token-${username}`;
        const demoUser: User = {
          user_id: 1,
          username,
          role: username.startsWith("scrb") ? "SCRB" : username.startsWith("sp") ? "SP" : "IO",
          district_id: username.startsWith("sp") ? 1 : null,
          station_id: username.startsWith("io") ? 101 : null,
        };
        localStorage.setItem("token", demoToken);
        localStorage.setItem("demo_user", JSON.stringify(demoUser));
        set({ token: demoToken, user: demoUser });
        return;
      }
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("demo_user");
    set({ user: null, token: null });
  },
  loadUser: async () => {
    const storedDemoUser = localStorage.getItem("demo_user");
    if (storedDemoUser) {
      try {
        set({ user: JSON.parse(storedDemoUser) });
        return;
      } catch {
        // Fall through
      }
    }
    try {
      const user = await api.get<User>("/auth/me");
      set({ user });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem("token");
      localStorage.removeItem("demo_user");
    }
  },
}));

const MOCK_KPIS: KpiSummary = {
  total_firs: 8420,
  today_firs: 14,
  active_hotspots: 18,
  critical_alerts: 5,
  mom_change: 4.2,
  yoy_change: -2.1,
};

const MOCK_TRENDS: TrendPoint[] = [
  { date: "2025-08-01", count: 120 },
  { date: "2025-09-01", count: 135 },
  { date: "2025-10-01", count: 150 },
  { date: "2025-11-01", count: 142 },
  { date: "2025-12-01", count: 168 },
  { date: "2026-01-01", count: 160 },
];

const MOCK_CATEGORIES: CrimeCategory[] = [
  { category: "Theft / Burglary", count: 3240, percentage: 38.5 },
  { category: "Cyber Crime & Fraud", count: 2150, percentage: 25.5 },
  { category: "Assault & Bodily Offences", count: 1480, percentage: 17.6 },
  { category: "Crimes Against Women", count: 980, percentage: 11.6 },
  { category: "Narcotics (NDPS)", count: 570, percentage: 6.8 },
];

const MOCK_ALERTS: Alert[] = [
  {
    alert_id: 1,
    title: "Cluster Spike in Koramangala",
    description: "40+ theft incidents registered in 1km radius within 7 days",
    severity: "CRITICAL",
    created_at: new Date().toISOString(),
  },
  {
    alert_id: 2,
    title: "Repeat Offender Activity: Ramesh Kumar",
    description: "Linked to 6 open property theft cases across 3 districts",
    severity: "WARNING",
    created_at: new Date().toISOString(),
  },
];

const MOCK_CASES: RecentCase[] = [
  {
    case_master_id: 101,
    crime_no: "104430006202600001",
    date: "2026-07-25",
    district: "Bengaluru Urban",
    type: "Property Crimes",
    status: "Under Investigation",
  },
  {
    case_master_id: 102,
    crime_no: "104430006202600002",
    date: "2026-07-24",
    district: "Mysuru",
    type: "Cyber Crimes",
    status: "Under Investigation",
  },
];

interface DashboardState {
  kpis: KpiSummary | null;
  trends: TrendPoint[];
  categories: CrimeCategory[];
  recentAlerts: Alert[];
  recentCases: RecentCase[];
  loading: boolean;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  kpis: MOCK_KPIS,
  trends: MOCK_TRENDS,
  categories: MOCK_CATEGORIES,
  recentAlerts: MOCK_ALERTS,
  recentCases: MOCK_CASES,
  loading: false,
  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const [kpis, trendsRes, categories, alertsRes, casesRes] = await Promise.all([
        api.get<KpiSummary>("/dashboard/summary"),
        api.get<{ points: TrendPoint[] }>("/dashboard/trends", { months: 12 }),
        api.get<CrimeCategory[]>("/dashboard/categories"),
        api.get<Alert[]>("/dashboard/alerts", { limit: 10 }),
        api.get<RecentCase[]>("/dashboard/recent-cases", { limit: 10 }),
      ]);
      set({
        kpis,
        trends: trendsRes.points,
        categories,
        recentAlerts: alertsRes,
        recentCases: casesRes,
      });
    } catch {
      // Retain fallback mock data when API is unreachable
      set({
        kpis: MOCK_KPIS,
        trends: MOCK_TRENDS,
        categories: MOCK_CATEGORIES,
        recentAlerts: MOCK_ALERTS,
        recentCases: MOCK_CASES,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

interface AppState {
  selectedDistrict: number | null;
  selectedDateRange: [Date, Date];
  selectedCrimeCategory: number | null;
  setSelectedDistrict: (id: number | null) => void;
  setSelectedDateRange: (range: [Date, Date]) => void;
  setSelectedCrimeCategory: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedDistrict: null,
  selectedDateRange: [new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date()],
  selectedCrimeCategory: null,
  setSelectedDistrict: (id) => set({ selectedDistrict: id }),
  setSelectedDateRange: (range) => set({ selectedDateRange: range }),
  setSelectedCrimeCategory: (id) => set({ selectedCrimeCategory: id }),
}));
