import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";

export default function ProtectedRoute() {
  const { token, user, loadUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      loadUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user, loadUser]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
