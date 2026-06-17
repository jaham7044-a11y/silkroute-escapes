import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Map, Star, Video, CheckCircle2, PlusCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";
import { adminRoutesStore, type AdminRoute } from "@/lib/admin/storage";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }] }),
  component: () => (
    <ProtectedAdmin>
      <DashboardPage />
    </ProtectedAdmin>
  ),
});

function DashboardPage() {
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  useEffect(() => setRoutes(adminRoutesStore.list()), []);

  const stats = useMemo(() => {
    const totalVideos = routes.reduce((sum, r) => sum + r.youtubeVideos.length, 0);
    return {
      total: routes.length,
      active: routes.filter((r) => r.isActive).length,
      featured: routes.filter((r) => r.isFeatured).length,
      videos: totalVideos,
    };
  }, [routes]);

  const recent = routes.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Welcome back. Here's an overview of your tours.</p>
        </div>
        <Link
          to="/admin/routes/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <PlusCircle className="h-4 w-4" /> Add New Route
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Routes" value={stats.total} icon={Map} tint="from-sky-500 to-sky-600" />
        <StatCard label="Active Routes" value={stats.active} icon={CheckCircle2} tint="from-emerald-500 to-emerald-600" />
        <StatCard label="Featured Routes" value={stats.featured} icon={Star} tint="from-amber-500 to-amber-600" />
        <StatCard label="Total Videos" value={stats.videos} icon={Video} tint="from-rose-500 to-rose-600" />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent Routes</h2>
          <Link to="/admin/routes" className="text-xs font-medium text-slate-500 hover:text-slate-900">
            View all →
          </Link>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Departure</th>
                <th className="px-5 py-3">Destination</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3 font-medium text-slate-900">{r.routeName}</td>
                  <td className="px-5 py-3 text-slate-600">{r.departureCity}</td>
                  <td className="px-5 py-3 text-slate-600">{r.destinationCity}</td>
                  <td className="px-5 py-3 text-slate-700">${r.startingPrice.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">
                    No routes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tint} text-white`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}