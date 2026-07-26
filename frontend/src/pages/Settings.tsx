import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shield, Bell, Database, Cpu, User, Sliders, CheckCircle, Save } from "lucide-react";
import { useToastStore } from "@/store/toast";

export default function Settings() {
  const addToast = useToastStore((s) => s.addToast);

  // Settings State
  const [officerName, setOfficerName] = useState("Inspector General S. R. Rao");
  const [badgeId, setBadgeId] = useState("KA-POL-8802");
  const [defaultDistrict, setDefaultDistrict] = useState("Bengaluru Urban");
  const [anomalySensitivity, setAnomalySensitivity] = useState("HIGH");
  const [mlInterval, setMlInterval] = useState("0.95");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Settings Saved",
      message: "Platform parameters and officer credentials updated."
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-7 h-7 text-indigo-400" />
            System Administration & Platform Configuration
          </h1>
          <p className="text-sm text-slate-400">
            Configure Karnataka SCRB AI model parameters, jurisdiction roles, and notification guardrails.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Officer Profile Settings */}
        <Card className="bg-slate-900/80 border-slate-800 md:col-span-2">
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Officer Identity & Role Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Officer Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Badge / Service ID</label>
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Role Permission</label>
                <input
                  type="text"
                  disabled
                  value="SCRB Admin / System Administrator"
                  className="w-full bg-slate-950/60 border border-slate-800/60 rounded px-3 py-2 text-sm text-indigo-400 font-semibold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Default Jurisdiction</label>
                <select
                  value={defaultDistrict}
                  onChange={(e) => setDefaultDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500"
                >
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Dakshina Kannada">Dakshina Kannada (Mangaluru)</option>
                  <option value="Belagavi">Belagavi</option>
                  <option value="Kalaburagi">Kalaburagi</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health Summary */}
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> Infrastructure Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Zoho Catalyst AppSail</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">ML Engine (Prophet)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">PostGIS Spatial Engine</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> CONNECTED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Network Graph (NetworkX)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> READY</span>
            </div>
          </CardContent>
        </Card>

        {/* AI & ML Parameter Configuration */}
        <Card className="bg-slate-900/80 border-slate-800 md:col-span-2">
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" /> AI & Predictive Analytics Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Anomaly Detection Sensitivity</label>
                <select
                  value={anomalySensitivity}
                  onChange={(e) => setAnomalySensitivity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                >
                  <option value="CRITICAL_ONLY">Critical Only (&gt;3.5 Std Dev)</option>
                  <option value="HIGH">High Sensitivity (&gt;2.5 Std Dev)</option>
                  <option value="BALANCED">Balanced (&gt;2.0 Std Dev)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Prophet Confidence Interval</label>
                <select
                  value={mlInterval}
                  onChange={(e) => setMlInterval(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                >
                  <option value="0.95">95% Confidence Band (Recommended)</option>
                  <option value="0.90">90% Confidence Band</option>
                  <option value="0.80">80% Confidence Band</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Dispatch */}
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" /> Emergency Alerts & Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">Critical Anomaly SMS</p>
                <p className="text-xs text-slate-400">Immediate SMS to SP on &gt;3x baseline spikes.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">Daily Intelligence Digest</p>
                <p className="text-xs text-slate-400">08:00 AM automated executive PDF briefing.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">Auto Catalyst AppSail Sync</p>
                <p className="text-xs text-slate-400">Real-time model re-indexing.</p>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
