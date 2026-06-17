import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";
import { RouteForm } from "@/components/admin/RouteForm";
import { adminRoutesStore, type AdminRoute } from "@/lib/admin/storage";

export const Route = createFileRoute("/admin/routes/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Route — Admin" }] }),
  component: () => (
    <ProtectedAdmin>
      <EditRoutePage />
    </ProtectedAdmin>
  ),
});

function EditRoutePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState<AdminRoute | null | undefined>(undefined);

  useEffect(() => {
    const r = adminRoutesStore.get(id);
    setRoute(r ?? null);
  }, [id]);

  return (
    <AdminLayout title="Edit Route">
      {route === undefined && <p className="text-sm text-slate-500">Loading…</p>}
      {route === null && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">Route not found.</p>
          <button
            onClick={() => navigate({ to: "/admin/routes" })}
            className="mt-3 text-sm font-medium text-slate-900 underline"
          >
            Back to routes
          </button>
        </div>
      )}
      {route && <RouteForm mode="edit" initial={route} />}
    </AdminLayout>
  );
}