import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/routes", label: "Routes", icon: Map },
  { to: "/admin/routes/new", label: "Add Route", icon: PlusCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/admin/login", replace: true });
  };

  const isActive = (to: string) =>
    to === "/admin/routes" ? pathname === to || pathname.startsWith("/admin/routes/edit") : pathname === to;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" richColors />

      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarBody isActive={isActive} onLogout={handleLogout} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <SidebarBody isActive={isActive} onLogout={handleLogout} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="hidden sm:inline">{user?.email ?? ""}</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500" />
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );

  function SidebarBody({
    isActive,
    onLogout,
    onNavigate,
  }: {
    isActive: (to: string) => boolean;
    onLogout: () => void;
    onNavigate?: () => void;
  }) {
    return (
      <>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
            <Compass className="h-6 w-6 text-amber-600" />
            <span className="font-serif text-lg font-semibold tracking-tight">Luxury China Travels</span>
          </Link>
          <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive(to)
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </>
    );
  }
}