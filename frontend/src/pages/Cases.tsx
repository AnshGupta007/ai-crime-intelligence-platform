import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Cases() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">FIR Cases</h1>
      <Card>
        <CardHeader>
          <CardTitle>Case List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Case management interface coming in Phase 1.</p>
        </CardContent>
      </Card>
    </div>
  );
}
