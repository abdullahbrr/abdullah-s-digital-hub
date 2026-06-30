import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/admin/ui";
import { BookOpen, Briefcase, FolderKanban, Image as ImageIcon, Layers, Palette, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

const TILES = [
  { to: "/admin/profile", title: "Hero & About", desc: "Name, roles, tagline, social, contact, highlights.", icon: User },
  { to: "/admin/experience", title: "Experience", desc: "Roles, companies, dates, descriptions.", icon: Briefcase },
  { to: "/admin/publications", title: "Publications", desc: "Papers, DOIs, venues.", icon: BookOpen },
  { to: "/admin/projects", title: "Projects", desc: "Featured projects with tags.", icon: FolderKanban },
  { to: "/admin/media", title: "Media & CV", desc: "Upload portrait, logo, CV PDF.", icon: ImageIcon },
  { to: "/admin/sections", title: "Section order", desc: "Reorder and hide sections.", icon: Layers },
  { to: "/admin/appearance", title: "Appearance", desc: "Pick a color preset.", icon: Palette },
];

function Overview() {
  return (
    <>
      <PageHeader title="Welcome back" description="Manage every part of your portfolio without touching code." />
      <div className="grid gap-3 sm:grid-cols-2">
        {TILES.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to as any} className="surface-card group block rounded-2xl p-5 transition hover:border-brand/40">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-foreground">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </Link>
          );
        })}
      </div>
      <Card className="mt-6">
        <p className="text-sm text-muted-foreground">
          Tip: drag items by the grip handle to reorder them inside any section.
        </p>
      </Card>
    </>
  );
}
