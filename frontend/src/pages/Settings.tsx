import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">User and system settings coming in Phase 1.</p>
        </CardContent>
      </Card>
    </div>
  );
}
