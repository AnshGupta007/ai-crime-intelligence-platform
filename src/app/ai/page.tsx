"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Target, TrendingUp, AlertTriangle, Eye, Shield, Zap,
  CheckCircle, Info, ArrowRight, Cpu, BarChart3, Users,
  MapPin, FileText, Gauge,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { cn, formatNumber, getRiskColor, getRiskBg, getConfidenceColor } from "@/lib/utils";

interface AIData {
  predictions: any[];
  models: any[];
  repeatOffenders: any[];
  forecasts: any[];
  riskScores: any[];
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const PREDICTION_TYPE_ICONS: Record<string, any> = {
  crime_risk: Target,
  repeat_offender: Users,
  hotspot: MapPin,
  anomaly: AlertTriangle,
  emerging_crime: Zap,
  district_risk: Gauge,
};

const PREDICTION_TYPE_COLORS: Record<string, string> = {
  crime_risk: "text-indigo-400",
  repeat_offender: "text-red-400",
  hotspot: "text-amber-400",
  anomaly: "text-orange-400",
  emerging_crime: "text-violet-400",
  district_risk: "text-cyan-400",
};

const PREDICTION_TYPE_BGS: Record<string, string> = {
  crime_risk: "bg-indigo-500/20",
  repeat_offender: "bg-red-500/20",
  hotspot: "bg-amber-500/20",
  anomaly: "bg-orange-500/20",
  emerging_crime: "bg-violet-500/20",
  district_risk: "bg-cyan-500/20",
};

export default function AIPage() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<number>(0);

  useEffect(() => {
    fetch("/api/ai/analytics")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading AI Analytics...</span>
        </div>
      </div>
    );
  }

  const prediction = data.predictions[selectedPrediction];
  const modelRadarData = data.models.map(m => ({
    model: m.modelName.split(/(?=[A-Z])/)[0],
    accuracy: Number(m.accuracy ?? 0),
    f1: Number(m.f1Score ?? 0) * 100,
    deployed: m.status === "deployed" ? 100 : 50,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-indigo-400" />
            AI Intelligence Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">Predictive Analytics &bull; Explainable AI &bull; Risk Assessment &bull; Anomaly Detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2 animate-pulse-glow">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">7 Models Active</span>
          </div>
        </div>
      </motion.div>

      {/* Model Performance Overview */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Model Radar */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Model Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={modelRadarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="model" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <PolarRadiusAxis angle={90} tick={{ fill: "#94a3b8", fontSize: 8 }} domain={[0, 100]} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="F1" dataKey="f1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #4f46e5", borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Active Models */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Deployed ML Models
          </h3>
          <div className="space-y-3">
            {data.models.slice(0, 5).map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{m.modelName}</span>
                  <span className={cn("px-2 py-1 rounded text-xs font-medium uppercase", m.status === "deployed" ? "bg-emerald-500/20 text-emerald-400" : m.status === "experimental" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400")}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Type: {m.modelType}</span>
                  <span>Acc: {m.accuracy}%</span>
                  {m.f1Score && <span>F1: {m.f1Score}</span>}
                  <span>v{m.version}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Scores */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            AI Risk Assessments
          </h3>
          <div className="space-y-3">
            {data.riskScores.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getRiskBg(r.riskLevel))}>
                    <span className={cn("text-xs font-bold", getRiskColor(r.riskLevel))}>{Number(r.riskScore).toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-200 capitalize">{r.entityType}: {r.entityId}</span>
                    <div className="text-xs text-slate-500">{(r.contributingFactors ?? []).slice(0, 2).join(", ")}</div>
                  </div>
                </div>
                <div className={cn("px-2 py-1 rounded text-xs font-medium uppercase", getRiskBg(r.riskLevel), getRiskColor(r.riskLevel))}>
                  {r.riskLevel}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Predictions - Explainable AI */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Explainable AI Predictions — Every prediction explains WHY
        </h3>

        {/* Prediction Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          {data.predictions.map((p, i) => {
            const Icon = PREDICTION_TYPE_ICONS[p.predictionType] || Brain;
            const color = PREDICTION_TYPE_COLORS[p.predictionType] || "text-slate-400";
            const bg = PREDICTION_TYPE_BGS[p.predictionType] || "bg-slate-500/20";
            return (
              <button key={p.id} onClick={() => setSelectedPrediction(i)} className={cn("px-3 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap", selectedPrediction === i ? `${bg} border-indigo-500/50` : "bg-slate-800/30 border-transparent hover:bg-slate-800/50")}>
                <Icon className={cn("w-4 h-4", color)} />
                <span className={cn("text-xs font-medium", selectedPrediction === i ? color : "text-slate-400")}>{p.predictionType.replace("_", " ")}</span>
                <span className={cn("text-xs font-bold", getConfidenceColor(Number(p.confidence)))}>{p.confidence}%</span>
              </button>
            );
          })}
        </div>

        {/* Selected Prediction Detail */}
        {prediction && (
          <motion.div key={selectedPrediction} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-4">
            {/* Prediction Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", PREDICTION_TYPE_BGS[prediction.predictionType])}>
                  {(() => { const Icon = PREDICTION_TYPE_ICONS[prediction.predictionType] || Brain; return <Icon className={cn("w-5 h-5", PREDICTION_TYPE_COLORS[prediction.predictionType])} />; })()}
                </div>
                <div>
                  <span className="text-base font-semibold text-white">{prediction.predictedValue}</span>
                  <span className="text-xs text-slate-400 ml-2">Confidence: {prediction.confidence}%</span>
                </div>
              </div>
              <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold", getConfidenceColor(Number(prediction.confidence)), Number(prediction.confidence) >= 90 ? "bg-emerald-500/20" : Number(prediction.confidence) >= 75 ? "bg-blue-500/20" : "bg-amber-500/20")}>
                {Number(prediction.confidence) >= 90 ? "HIGH CONFIDENCE" : Number(prediction.confidence) >= 75 ? "MODERATE" : "LOW"}
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-lg bg-slate-900/50 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase">Why This Was Predicted</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{prediction.explanation}</p>
            </div>

            {/* Feature Importance */}
            {prediction.featuresUsed && (
              <div className="p-4 rounded-lg bg-slate-900/50 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase">Feature Importance (SHAP Values)</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(prediction.featuresUsed).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-36 truncate">{key}</span>
                      <div className="flex-1 h-4 bg-slate-800/50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500" style={{ width: `${Number(value) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium text-indigo-300 w-8 text-right">{(Number(value) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Action */}
            {prediction.recommendedAction && (
              <div className="p-4 rounded-lg bg-slate-900/50 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-violet-300 uppercase">Recommended Action</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{prediction.recommendedAction}</p>
              </div>
            )}

            {/* Historical Comparison */}
            {prediction.historicalComparison && (
              <div className="p-4 rounded-lg bg-slate-900/50 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase">Historical Comparison</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(prediction.historicalComparison).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{key}</span>
                      <span className="text-sm font-medium text-white">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Repeat Offenders */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          AI-Identified Repeat Offenders — Predicted Re-offend Risk
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.repeatOffenders.map((ro) => (
            <div key={ro.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-red-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-sm font-bold text-red-400">
                  {ro.accusedName[0]}
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{ro.accusedName}</span>
                  {ro.alias && <span className="text-xs text-slate-500 ml-1">({ro.alias})</span>}
                  <div className="text-xs text-slate-400">{ro.accusedAge} yrs, {ro.accusedGender}</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Prior Cases</span>
                  <span className="text-red-400 font-bold">{ro.previousCaseCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className={cn("font-medium capitalize", ro.accusedStatus === "absconding" ? "text-red-400" : ro.accusedStatus === "on_bail" ? "text-amber-400" : "text-emerald-400")}>{ro.accusedStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gang</span>
                  <span className="text-pink-400">{ro.gangAffiliation ?? "None"}</span>
                </div>
                {ro.criminalHistory && <p className="text-slate-500 mt-1 leading-relaxed">{ro.criminalHistory}</p>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
