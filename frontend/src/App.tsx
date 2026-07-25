import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import MapView from "./pages/MapView";
import Network from "./pages/Network";
import Predictions from "./pages/Predictions";
import Reports from "./pages/Reports";
import Anomalies from "./pages/Anomalies";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="map" element={<MapView />} />
          <Route path="network" element={<Network />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
