import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2, Star, CheckCircle2, XCircle } from "lucide-react";
import type { AdminRoute } from "@/lib/admin/storage";

export function RouteTable({
  routes,
  onDelete,
}: {
  routes: AdminRoute[];
  onDelete: (id: string) => void;
}) {
  if (routes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
        No routes yet. Click <span className="font-medium">Add Route</span> to create your first one.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">From → To</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {routes.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  {r.coverImageUrl ? (
                    <img src={r.coverImageUrl} alt="" className="h-12 w-16 rounded-md object-cover" />
                  ) : (
                    <div className="h-12 w-16 rounded-md bg-slate-200" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{r.routeName}</td>
                <td className="px-4 py-3 text-slate-600">
                  {r.departureCity} → {r.destinationCity}
                </td>
                <td className="px-4 py-3 text-slate-700">${r.startingPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600">{r.duration}</td>
                <td className="px-4 py-3">
                  {r.isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <Star
                    className={`h-4 w-4 ${r.isFeatured ? "fill-amber-400 text-amber-500" : "text-slate-300"}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to="/routes/$id"
                      params={{ id: r.id }}
                      target="_blank"
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="View on site"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/admin/routes/edit/$id"
                      params={{ id: r.id }}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}