import { useState, useMemo } from "react";
import { useCases, FIRCase } from "@/hooks/useCases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Plus, FileText, ShieldAlert, CheckCircle2, Clock, AlertTriangle, MapPin } from "lucide-react";

export default function Cases() {
  const { cases, loading, createCase } = useCases();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedCase, setSelectedCase] = useState<FIRCase | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Case Form State
  const [newFirNumber, setNewFirNumber] = useState("");
  const [newComplainant, setNewComplainant] = useState("");
  const [newCategory, setNewCategory] = useState("Armed Robbery");
  const [newDistrict, setNewDistrict] = useState("Bengaluru Urban");
  const [newStation, setNewStation] = useState("Koramangala PS");
  const [newDescription, setNewDescription] = useState("");
  const [newIpc, setNewIpc] = useState("Section 392 (Robbery)");
  const [newAccused, setNewAccused] = useState("");

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchSearch =
        c.fir_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.accused_names.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.district_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchCategory = categoryFilter === "ALL" || c.category_name === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [cases, searchTerm, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    return {
      total: cases.length,
      underInv: cases.filter(c => c.status === "UNDER_INVESTIGATION").length,
      chargesheeted: cases.filter(c => c.status === "CHARGESHEET_FILED").length,
      pending: cases.filter(c => c.status === "PENDING").length,
      closed: cases.filter(c => c.status === "CLOSED").length,
    };
  }, [cases]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCase({
      fir_number: newFirNumber || `KA-2026-FIR-${Math.floor(1000 + Math.random() * 9000)}`,
      complainant_name: newComplainant || "Citizen Complaint",
      category_name: newCategory,
      district_name: newDistrict,
      station_name: newStation,
      description: newDescription || "FIR Registered in System.",
      ipc_sections: newIpc ? [newIpc] : ["IPC Sec 379"],
      accused_names: newAccused ? newAccused.split(",").map(a => a.trim()) : ["Under Investigation"]
    });
    setShowCreateModal(false);
    setNewFirNumber("");
    setNewComplainant("");
    setNewDescription("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UNDER_INVESTIGATION":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Clock className="w-3 h-3 mr-1" /> Under Investigation</span>;
      case "CHARGESHEET_FILED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Chargesheeted</span>;
      case "PENDING":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Pending Action</span>;
      case "CLOSED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20"><ShieldAlert className="w-3 h-3 mr-1" /> Case Closed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-400" />
            Karnataka Police FIR Case Management
          </h1>
          <p className="text-sm text-slate-400">
            Real-time crime investigation directory, FIR records, chargesheet tracking, and suspect mapping.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Register New FIR
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-400">Total Registered FIRs</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-blue-400">Under Investigation</p>
            <p className="text-2xl font-bold text-blue-300 mt-1">{stats.underInv}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-emerald-400">Chargesheet Filed</p>
            <p className="text-2xl font-bold text-emerald-300 mt-1">{stats.chargesheeted}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-400">Pending Triage</p>
            <p className="text-2xl font-bold text-amber-300 mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-400">Closed Cases</p>
            <p className="text-2xl font-bold text-slate-300 mt-1">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="bg-slate-900/80 border-slate-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by FIR No, Complainant, Accused name, District, IPC section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="CHARGESHEET_FILED">Chargesheeted</option>
              <option value="PENDING">Pending</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Crime Categories</option>
              <option value="Armed Robbery">Armed Robbery</option>
              <option value="Cyber Crime">Cyber Crime</option>
              <option value="Vehicle Theft">Vehicle Theft</option>
              <option value="Extortion">Extortion</option>
              <option value="Property Damage">Property Damage</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Case Directory Table */}
      <Card className="bg-slate-900/80 border-slate-800">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            <span>FIR Master Register ({filteredCases.length})</span>
            {loading && <span className="text-xs text-indigo-400 animate-pulse">Syncing cases...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">FIR Number</th>
                  <th className="p-4">District & Police Station</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Filing Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Accused / Suspects</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCases.map((c) => (
                  <tr key={c.fir_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-semibold text-indigo-400">{c.fir_number}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{c.district_name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.station_name}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                        {c.category_name}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{c.filing_date}</td>
                    <td className="p-4">{getStatusBadge(c.status)}</td>
                    <td className="p-4 text-xs">
                      {c.accused_names.map((a, idx) => (
                        <span key={idx} className="inline-block mr-1 mb-1 px-2 py-0.5 bg-rose-500/10 text-rose-300 rounded border border-rose-500/20">
                          {a}
                        </span>
                      ))}
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedCase(c)} className="border-slate-700 hover:bg-slate-800 text-xs">
                        View Dossier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-400 font-mono">{selectedCase.fir_number}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedCase.category_name} - {selectedCase.district_name}</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white">✕</Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div><span className="text-slate-400">Police Station:</span> <strong className="text-white">{selectedCase.station_name}</strong></div>
              <div><span className="text-slate-400">Status:</span> {getStatusBadge(selectedCase.status)}</div>
              <div><span className="text-slate-400">Complainant:</span> <strong className="text-white">{selectedCase.complainant_name}</strong></div>
              <div><span className="text-slate-400">Incident Date:</span> <strong className="text-slate-200">{selectedCase.incident_date}</strong></div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">IPC / IT Act Sections</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.ipc_sections.map((sec, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Accused Persons / Suspects</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.accused_names.map((acc, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Incident Summary & Narrative</h4>
              <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded border border-slate-800/80 leading-relaxed">
                {selectedCase.description}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="outline" onClick={() => setSelectedCase(null)}>Close</Button>
              <Button onClick={() => alert(`Printing Case Summary for ${selectedCase.fir_number}...`)} className="bg-indigo-600 text-white">
                Download Official PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Register New FIR Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Register New Police FIR</h3>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowCreateModal(false)}>✕</Button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">FIR Number</label>
                <input
                  type="text"
                  placeholder="e.g. KA-2026-FIR-0512"
                  value={newFirNumber}
                  onChange={(e) => setNewFirNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Complainant Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newComplainant}
                    onChange={(e) => setNewComplainant(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  >
                    <option value="Armed Robbery">Armed Robbery</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Vehicle Theft">Vehicle Theft</option>
                    <option value="Extortion">Extortion</option>
                    <option value="Property Damage">Property Damage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">District</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Police Station</label>
                  <input
                    type="text"
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">IPC / IT Act Sections</label>
                <input
                  type="text"
                  placeholder="e.g. Section 392 (Robbery)"
                  value={newIpc}
                  onChange={(e) => setNewIpc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Accused Names (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar, Suresh Gowda"
                  value={newAccused}
                  onChange={(e) => setNewAccused(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">FIR Narrative & Details</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of incident..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Register FIR</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
