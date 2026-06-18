import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminAuthProvider } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  ),
});