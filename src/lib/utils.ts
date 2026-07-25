import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(n: number): string {
  return `₹${formatNumber(n)}`;
}

export function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "critical": return "text-red-400";
    case "high": return "text-orange-400";
    case "medium": return "text-amber-400";
    case "low": return "text-emerald-400";
    default: return "text-slate-400";
  }
}

export function getRiskBg(level: string): string {
  switch (level) {
    case "critical": return "bg-red-500/20";
    case "high": return "bg-orange-500/20";
    case "medium": return "bg-amber-500/20";
    case "low": return "bg-emerald-500/20";
    default: return "bg-slate-500/20";
  }
}

export function getConfidenceColor(conf: number): string {
  if (conf >= 90) return "text-emerald-400";
  if (conf >= 75) return "text-blue-400";
  if (conf >= 60) return "text-amber-400";
  return "text-red-400";
}

export const KARNATAKA_DISTRICTS = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dakshina Kannada",
  "Dharwad", "Belagavi", "Ballari", "Hassan", "Mandya", "Tumakuru",
  "Shivamogga", "Davangere", "Chitradurga", "Kodagu", "Raichur",
  "Kalaburagi", "Bidar", "Koppal", "Uttara Kannada", "Udupi",
  "Chamarajanagar", "Ramanagara", "Chikkaballapura", "Kolar",
  "Bagalkote", "Gadag", "Haveri", "Yadgir", "Vijayapura",
  "Chikkmagaluru", "Vijayanagara"
];

export const CRIME_TYPES = [
  "Murder", "Attempt to Murder", "Culpable Homicide", "Rape",
  "Kidnapping & Abduction", "Robbery", "Burglary", "Theft",
  "Rioting", "Cruelty by Husband", "Dowry Death", "Assault",
  "Cheating & Fraud", "Forgery", "Arms Act", "Drug Offences",
  "Cybercrime", "Motor Vehicle Theft", "Cattle Theft",
  "Other IPC Crimes", "SLL Crimes"
];

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Crime Map", path: "/map", icon: "Map" },
  { label: "Knowledge Graph", path: "/graph", icon: "Network" },
  { label: "AI Analytics", path: "/ai", icon: "Brain" },
  { label: "Cases", path: "/cases", icon: "FileText" },
  { label: "Predictions", path: "/predictions", icon: "TrendingUp" },
  { label: "Investigation", path: "/investigation", icon: "Search" },
  { label: "Reports", path: "/reports", icon: "BarChart3" },
];

export type { ClassValue };
