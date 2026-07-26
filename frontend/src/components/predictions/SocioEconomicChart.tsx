import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { SocioEconomicPoint } from "@/types";

interface SocioEconomicChartProps {
    points: SocioEconomicPoint[];
}

export default function SocioEconomicChart({ points }: SocioEconomicChartProps) {
    return (
        <div className="rounded-xl border bg-white p-3 shadow-sm">
            <ResponsiveContainer width="100%" height={220}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        type="number"
                        dataKey="unemployment_pct"
                        name="Unemployment"
                        unit="%"
                        tick={{ fontSize: 10 }}
                        label={{ value: "Unemployment Rate (%)", position: "bottom", fontSize: 10, offset: 0 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="crime_count"
                        name="Crime Count"
                        tick={{ fontSize: 10 }}
                        label={{ value: "FIR Count", angle: -90, position: "left", fontSize: 10 }}
                    />
                    <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ payload }) => {
                            if (payload && payload.length) {
                                const data = payload[0].payload as SocioEconomicPoint;
                                return (
                                    <div className="rounded-lg border bg-white p-2 text-xs shadow-md">
                                        <p className="font-semibold text-slate-800">{data.district || data.district_name}</p>
                                        <p className="text-slate-600">FIR Count: {data.crime_count}</p>
                                        <p className="text-slate-600">Unemployment: {data.unemployment_pct}%</p>
                                        <p className="text-slate-600">Urbanization: {data.urbanization_pct}%</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Scatter name="Districts" data={points} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
