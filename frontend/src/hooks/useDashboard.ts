import { useEffect } from "react";
import { useDashboardStore } from "@/store";

export function useDashboard() {
  const store = useDashboardStore();

  useEffect(() => {
    if (!store.loading && !store.kpis) {
      store.fetchDashboard();
    }
  }, []);

  return store;
}

export default useDashboard;
