import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Compass, Lock } from "lucide-react";
import { ADMIN_EMAIL, ADMIN_PASSWORD, adminLogin, isAdminLoggedIn } from "@/lib/admin/storage";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Silk Route Escapes" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate({ to: "/admin/dashboard", replace: true });
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const ok = adminLogin(email, password);
    if (!ok) {
      setError("Invalid email or password.");
      toast.error("Invalid email or password");
      setSubmitting(false);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/admin/dashboard", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
            <Compass className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-white">Silk Route Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your tours</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur"
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ADMIN_EMAIL}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </label>

            {error && (
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" /> Sign in
            </button>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Demo credentials:</span> {ADMIN_EMAIL} / {ADMIN_PASSWORD}
          </div>
        </form>
      </div>
    </div>
  );
}