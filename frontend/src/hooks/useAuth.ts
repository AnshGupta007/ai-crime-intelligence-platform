import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

export function useAuth() {
  const { user, token, loadUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
    if (!token) {
      navigate("/login");
    }
  }, [token, user, loadUser, navigate]);

  return { user, token, logout, isAuthenticated: !!token };
}
