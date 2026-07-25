import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { ForecastPoint } from "@/types";

interface ForecastChartProps {
  data: ForecastPoint[];
  loading?: boolean;
}

export default function ForecastChart({ data, loading }: ForecastChartProps) {
  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Generating forecast...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border bg-white">
        <p className="text-sm text-muted-foreground">No forecast data available. Select a district or crime type.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
            labelFormatter={(v: string) => new Date(v).toLocaleDateString("en-IN", { dateStyle: "medium" })}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {data[0]?.lower_bound != null && (
            <Area
              type="monotone"
              dataKey="upper_bound"
              stroke="none"
              fill="#3b82f6"
              fillOpacity={0.08}
            />
          )}
          {data[0]?.lower_bound != null && (
            <Area
              type="monotone"
              dataKey="lower_bound"
              stroke="none"
              fill="#3b82f6"
              fillOpacity={0.08}
            />
          )}
          {data[0]?.lower_bound != null && (
            <Area
              type="monotone"
              dataKey="upper_bound"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
              dot={false}
              name="Upper Bound"
            />
          )}
          {data[0]?.lower_bound != null && (
            <Area
              type="monotone"
              dataKey="lower_bound"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
              dot={false}
              name="Lower Bound"
            />
          )}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            name="Predicted"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
