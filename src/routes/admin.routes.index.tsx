import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, PlusCircle, Search, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";
import { RouteTable } from "@/components/admin/RouteTable";
import { routesService } from "@/lib/admin/routes-service";
import { seedSampleRoutes } from "@/lib/admin/seed";
import type { AdminRoute } from "@/lib/admin/storage";

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
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [q, setQ] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      setRoutes(await routesService.list());
    } catch (e) {
      toast.error("Could not load routes");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void refresh();
  }, []);

  const onDelete = async (id: string) => {
    const r = routes.find((x) => x.id === id);
    if (!r) return;
    if (!confirm(`Delete "${r.routeName}"? This cannot be undone.`)) return;
    try {
      await routesService.remove(id);
      toast.success("Route deleted");
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Could not delete route");
    }
  };

  const onSeed = async () => {
    setSeeding(true);
    try {
      const n = await seedSampleRoutes();
      if (n > 0) toast.success(`Seeded ${n} sample routes`);
      else toast.info("Routes already exist — nothing to seed");
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Could not seed sample data");
    } finally {
      setSeeding(false);
    }
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
          {!loading && routes.length === 0 && (
            <button
              onClick={onSeed}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-60"
            >
              {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Seed Sample Routes
            </button>
          )}
          <Link
            to="/admin/routes/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <PlusCircle className="h-4 w-4" /> Add Route
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-sm text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading routes…
        </div>
      ) : (
        <RouteTable routes={filtered} onDelete={onDelete} />
      )}
    </AdminLayout>
  );
}