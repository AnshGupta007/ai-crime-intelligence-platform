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
    const res = await api.post<{ access_token: string; token_type: string; expires_in: number }>("/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", res.access_token);
    set({ token: res.access_token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  loadUser: async () => {
    try {
      const user = await api.get<User>("/auth/me");
      set({ user });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    }
  },
}));

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
  kpis: null,
  trends: [],
  categories: [],
  recentAlerts: [],
  recentCases: [],
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
