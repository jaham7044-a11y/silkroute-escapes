import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";
import { RouteTable } from "@/components/admin/RouteTable";
import { adminRoutesStore, type AdminRoute } from "@/lib/admin/storage";

export const Route = createFileRoute("/admin/routes/")({
  head: () => ({ meta: [{ title: "Routes — Admin" }] }),
  component: () => (
    <ProtectedAdmin>
      <AdminRoutesPage />
    </ProtectedAdmin>
  ),
});

function AdminRoutesPage() {
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  const [q, setQ] = useState("");

  const refresh = () => setRoutes(adminRoutesStore.list());
  useEffect(refresh, []);

  const onDelete = (id: string) => {
    const r = routes.find((x) => x.id === id);
    if (!r) return;
    if (!confirm(`Delete "${r.routeName}"? This cannot be undone.`)) return;
    adminRoutesStore.remove(id);
    refresh();
    toast.success("Route deleted");
  };

  const onReset = () => {
    if (!confirm("Reset to sample data? Your changes will be lost.")) return;
    adminRoutesStore.reset();
    refresh();
    toast.success("Sample data restored");
  };

  const filtered = routes.filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      r.routeName.toLowerCase().includes(s) ||
      r.departureCity.toLowerCase().includes(s) ||
      r.destinationCity.toLowerCase().includes(s)
    );
  });

  return (
    <AdminLayout title="Routes">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search routes…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset data
          </button>
          <Link
            to="/admin/routes/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <PlusCircle className="h-4 w-4" /> Add Route
          </Link>
        </div>
      </div>

      <RouteTable routes={filtered} onDelete={onDelete} />
    </AdminLayout>
  );
}