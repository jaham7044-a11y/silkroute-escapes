import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";
import { RouteForm } from "@/components/admin/RouteForm";

export const Route = createFileRoute("/admin/routes/new")({
  head: () => ({ meta: [{ title: "Add Route — Admin" }] }),
  component: () => (
    <ProtectedAdmin>
      <AdminLayout title="Add Route">
        <RouteForm mode="create" />
      </AdminLayout>
    </ProtectedAdmin>
  ),
});