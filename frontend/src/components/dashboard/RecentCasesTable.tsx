import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { RecentCase } from "@/types";

type SortKey = "crime_no" | "date" | "type" | "district" | "status";

export default function RecentCasesTable({ data }: { data: RecentCase[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 5;

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const aVal = a[sortKey]?.toString() || "";
      const bVal = b[sortKey]?.toString() || "";
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return copy;
  }, [data, sortKey, sortAsc]);

  const paginated = sorted.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const cols: { label: string; key: SortKey }[] = [
    { label: "FIR #", key: "crime_no" },
    { label: "Date", key: "date" },
    { label: "Type", key: "type" },
    { label: "District", key: "district" },
    { label: "Status", key: "status" },
  ];

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No cases</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Cases</CardTitle>
          <span className="text-xs text-muted-foreground">{sorted.length} total</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                {cols.map((col) => (
                  <th
                    key={col.key}
                    className="cursor-pointer select-none px-4 py-3 text-left font-medium hover:text-foreground"
                    onClick={() => toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon column={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.case_master_id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.crime_no}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.date)}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.district}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "Closed" ? "secondary" : "default"}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-30"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
