export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Cases", path: "/cases", icon: "FolderOpen" },
  { label: "Map View", path: "/map", icon: "Map" },
  { label: "Network", path: "/network", icon: "Share2" },
  { label: "Predictions", path: "/predictions", icon: "TrendingUp" },
  { label: "Anomalies", path: "/anomalies", icon: "AlertTriangle" },
  { label: "Reports", path: "/reports", icon: "FileText" },
  { label: "Settings", path: "/settings", icon: "Settings" },
] as const;

export const KARNATAKA_DISTRICTS = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dakshina Kannada",
  "Dharwad", "Belagavi", "Ballari", "Hassan", "Mandya", "Tumakuru",
  "Shivamogga", "Davangere", "Chitradurga", "Kodagu", "Raichur",
  "Kalaburagi", "Bidar", "Koppal", "Uttara Kannada", "Udupi",
  "Chamarajanagar", "Ramanagara", "Chikkaballapura", "Kolar",
  "Bagalkote", "Gadag", "Haveri", "Yadgir", "Vijayapura",
  "Chikkmagaluru", "Vijayanagara",
] as const;

export const CRIME_TYPES = [
  "Murder", "Attempt to Murder", "Rape", "Kidnapping & Abduction",
  "Robbery", "Burglary", "Theft", "Rioting", "Cruelty by Husband",
  "Dowry Death", "Cheating & Fraud", "Cybercrime", "Motor Vehicle Theft",
  "Arms Act", "Drug Offences",
] as const;

export const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "text-red-500 bg-red-500/10 border-red-500/20",
  HIGH: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  WARNING: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  WATCH: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  INFO: "text-blue-500 bg-blue-500/10 border-blue-500/20",
};

export const CRIME_COLORS = [
  "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#e11d48", "#a855f7", "#0ea5e9", "#84cc16", "#d946ef",
];
