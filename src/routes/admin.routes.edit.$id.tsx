import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";
import { RouteForm } from "@/components/admin/RouteForm";
import { routesService } from "@/lib/admin/routes-service";
import type { AdminRoute } from "@/lib/admin/storage";

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
    let alive = true;
    routesService.get(id).then((r) => {
      if (alive) setRoute(r);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <AdminLayout title="Edit Route">
      {route === undefined && (
        <p className="flex items-center text-sm text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </p>
      )}
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