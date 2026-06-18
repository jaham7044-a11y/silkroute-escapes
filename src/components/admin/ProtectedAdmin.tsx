import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";

export function ProtectedAdmin({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking session…
      </div>
    );
  }
  return <>{children}</>;
}