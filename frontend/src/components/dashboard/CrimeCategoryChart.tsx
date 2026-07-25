import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CRIME_COLORS } from "@/lib/constants";
import type { CrimeCategory } from "@/types";

export default function CrimeCategoryChart({ data }: { data: CrimeCategory[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crime Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crime Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="category"
              width={140}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: any, _name: any, item: any) => [
                `${value} (${item?.payload?.percentage ?? 0}%)`,
                "Count",
              ]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {data.map((_, i) => (
                <Cell key={i} fill={CRIME_COLORS[i % CRIME_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-1.5">
          {data.map((c) => (
            <div key={c.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CRIME_COLORS[data.indexOf(c) % CRIME_COLORS.length] }}
                />
                <span className="text-muted-foreground">{c.category}</span>
              </div>
              <span className="font-medium">{c.count} ({c.percentage}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
