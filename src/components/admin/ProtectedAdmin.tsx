import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isAdminLoggedIn } from "@/lib/admin/storage";

export function ProtectedAdmin({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate({ to: "/admin/login", replace: true });
      return;
    }
    setChecked(true);
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking session…
      </div>
    );
  }
  return <>{children}</>;
}