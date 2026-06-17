import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdmin } from "@/components/admin/ProtectedAdmin";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: () => (
    <ProtectedAdmin>
      <AdminLayout title="Settings">
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h2 className="text-base font-semibold text-slate-900">Settings</h2>
          <p className="mt-2 text-sm text-slate-500">
            Site-wide preferences will live here. Backend integration is part of a later step.
          </p>
        </div>
      </AdminLayout>
    </ProtectedAdmin>
  ),
});