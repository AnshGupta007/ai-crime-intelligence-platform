import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-6" style={{ borderColor: "#e2e8f0" }}>
      <div className="flex flex-1 items-center gap-2 rounded-md border bg-slate-50 px-3 py-1.5">
        <input
          type="text"
          placeholder="Search cases, crime no, accused..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>

      <div className="flex items-center gap-2 border-l pl-4" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User className="h-4 w-4" />
        </div>
        <div className="hidden md:block text-sm">
          <p className="font-medium leading-tight text-slate-700">{user?.username || "User"}</p>
          <p className="text-[10px] uppercase text-slate-400">{user?.role || "---"}</p>
        </div>
        <button onClick={handleLogout} className="ml-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
