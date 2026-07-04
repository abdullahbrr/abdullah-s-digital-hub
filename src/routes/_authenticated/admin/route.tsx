// Admin layout: sidebar nav + email-guard. Non-admin signed-in users get
// kicked to the public site (server fns also re-check).
import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hop as Home, User, GraduationCap, Briefcase, Wrench, FlaskConical, BookOpen, FolderKanban, Award, Users, Image as ImageIcon, Palette, Layers, LogOut, ExternalLink, Quote, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin-config";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Portfolio" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Overview", icon: Home, exact: true },
  { to: "/admin/profile", label: "Hero & About", icon: User },
  { to: "/admin/story", label: "Story & Quotes", icon: Quote },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/skills", label: "Skills", icon: Wrench },
  { to: "/admin/research", label: "Research", icon: FlaskConical },
  { to: "/admin/publications", label: "Publications", icon: BookOpen },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/blog", label: "Blog & Writing", icon: Newspaper },

  { to: "/admin/awards", label: "Awards", icon: Award },
  { to: "/admin/organizations", label: "Organizations", icon: Users },
  { to: "/admin/media", label: "Media & CV", icon: ImageIcon },
  { to: "/admin/sections", label: "Section order", icon: Layers },
  { to: "/admin/appearance", label: "Appearance", icon: Palette },
];

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        const e = data.user?.email ?? null;
        setEmail(e);
        if (!isAdminEmail(e)) {
          navigate({ to: "/" });
        }
      })
      .catch(() => {
        navigate({ to: "/auth" });
      });
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (!email) {
    return <div className="grid min-h-dvh place-items-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-border p-2 text-muted-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            <Layers className="h-4 w-4" />
          </button>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-xs font-bold text-brand-foreground">AM</span>
          <span className="truncate font-display text-sm font-bold">Portfolio admin</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
            View site <ExternalLink className="h-3 w-3" />
          </a>
          <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
          <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <nav className="surface-card sticky top-20 flex flex-col gap-0.5 rounded-2xl p-2">
            {NAV.map((item) => {
              const isActive = item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-3 px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            Locked admin: {ADMIN_EMAIL}
          </p>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
