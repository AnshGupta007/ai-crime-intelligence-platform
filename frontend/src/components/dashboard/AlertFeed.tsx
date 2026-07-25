import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SEVERITY_COLORS } from "@/lib/constants";
import type { Alert } from "@/types";

const severityIcons: Record<string, typeof AlertTriangle> = {
  CRITICAL: AlertTriangle,
  HIGH: AlertCircle,
  WARNING: AlertCircle,
  WATCH: Info,
  INFO: Info,
};

export default function AlertFeed({ data }: { data: Alert[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No alerts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
        {data.map((alert) => {
          const Icon = severityIcons[alert.severity] || Info;
          const colorClass = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.INFO;

          return (
            <div
              key={alert.alert_id}
              className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${colorClass}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{alert.title}</p>
                {alert.description && (
                  <p className="mt-0.5 text-xs opacity-80 line-clamp-2">{alert.description}</p>
                )}
              </div>
              {alert.created_at && (
                <span className="shrink-0 text-[10px] opacity-60">
                  {new Date(alert.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
