import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Map, Share2, TrendingUp,
  AlertTriangle, FileText, Settings, ChevronLeft, ChevronRight,
  ShieldAlert, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Cases", path: "/cases", icon: FolderOpen },
  { label: "Map View", path: "/map", icon: Map },
  { label: "Network", path: "/network", icon: Share2 },
  { label: "Predictions", path: "/predictions", icon: TrendingUp },
  { label: "Anomalies", path: "/anomalies", icon: AlertTriangle },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }}
    >
      <div className={cn(
        "flex h-14 items-center border-b px-4 font-semibold text-white",
        collapsed ? "justify-center" : "gap-2"
      )}
        style={{ borderColor: "#1e293b" }}
      >
        <ShieldAlert className="h-5 w-5 shrink-0 text-blue-400" />
        {!collapsed && <span className="text-sm tracking-wide">CIP</span>}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed ? "justify-center" : "gap-3",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-3" style={{ borderColor: "#1e293b" }}>
        {!collapsed && user && (
          <div className="mb-2 truncate px-2 text-xs text-slate-500">
            {user.username}
            <span className="ml-1 text-[10px] uppercase text-slate-600">({user.role})</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Logout"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
    </aside>
  );
}
