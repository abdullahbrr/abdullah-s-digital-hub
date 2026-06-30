import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteContent } from "@/lib/content.functions";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import {
  About, Awards, Contact, Education, Experience, Footer, Organizations, Projects, Publications, Research, Skills,
} from "@/components/portfolio/Sections";

const SITE_TITLE = "Abdullah Al Mamun — Technical Support Engineer & Renewable-Energy Researcher";
const SITE_DESC = "Portfolio of Abdullah Al Mamun: B.Sc. EEE engineer building smart-metering systems, advancing photovoltaic research, and shipping award-winning ventures from Bangladesh.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const SECTION_LABELS: Record<string, string> = {
  about: "About", education: "Education", experience: "Experience", skills: "Skills",
  research: "Research", publications: "Publications", projects: "Projects", awards: "Awards",
  organizations: "Organizations", contact: "Contact",
};

const THEME_PRESET_VARS: Record<string, { brand: string; brand2: string; brand3: string }> = {
  cyan:    { brand: "oklch(0.82 0.17 220)", brand2: "oklch(0.7 0.2 265)",  brand3: "oklch(0.68 0.22 305)" },
  emerald: { brand: "oklch(0.8 0.17 165)",  brand2: "oklch(0.72 0.16 185)", brand3: "oklch(0.66 0.15 205)" },
  amber:   { brand: "oklch(0.82 0.16 70)",  brand2: "oklch(0.7 0.22 30)",   brand3: "oklch(0.68 0.22 350)" },
  rose:    { brand: "oklch(0.75 0.18 15)",  brand2: "oklch(0.68 0.22 310)", brand3: "oklch(0.66 0.2 270)" },
};

function applyThemePreset(id?: string) {
  if (typeof document === "undefined") return;
  const preset = THEME_PRESET_VARS[id ?? "cyan"] ?? THEME_PRESET_VARS.cyan;
  const root = document.documentElement;
  root.style.setProperty("--brand", preset.brand);
  root.style.setProperty("--brand-2", preset.brand2);
  root.style.setProperty("--brand-3", preset.brand3);
  root.style.setProperty("--ring", preset.brand);
  root.style.setProperty("--primary", preset.brand);
}

function Home() {
  const fetchContent = useServerFn(getSiteContent);
  const { data, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => fetchContent(),
  });

  useEffect(() => { applyThemePreset(data?.settings?.theme?.preset); }, [data]);

  if (isLoading || !data) {
    return <div className="grid min-h-dvh place-items-center bg-background text-muted-foreground">Loading…</div>;
  }

  const s = data.settings;
  const profile = s.profile ?? {};
  const order: string[] = Array.isArray(s.sectionOrder) ? s.sectionOrder : Object.keys(SECTION_LABELS);
  const visible: Set<string> = new Set(Array.isArray(s.visibleSections) ? s.visibleSections : order);
  const navItems = order.filter((id) => visible.has(id)).map((id) => ({ id, label: SECTION_LABELS[id] ?? id }));

  function renderSection(id: string) {
    if (!visible.has(id)) return null;
    switch (id) {
      case "about":         return <About key={id} profile={profile} about={s.about ?? {}} />;
      case "education":     return <Education key={id} rows={data.educations} />;
      case "experience":    return <Experience key={id} rows={data.experiences} />;
      case "skills":        return <Skills key={id} rows={data.skillGroups} />;
      case "research":      return <Research key={id} research={s.research ?? {}} />;
      case "publications":  return <Publications key={id} rows={data.publications} />;
      case "projects":      return <Projects key={id} rows={data.projects} />;
      case "awards":        return <Awards key={id} rows={data.awards} />;
      case "organizations": return <Organizations key={id} rows={data.organizations} />;
      case "contact":       return <Contact key={id} profile={profile} social={s.social ?? {}} cvUrl={s.media?.cvUrl} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav name={profile.name ?? ""} initials={profile.initials ?? "AM"} sections={navItems} />
      <main id="main">
        <Hero profile={profile} portraitUrl={s.media?.portraitUrl} />
        {order.map(renderSection)}
      </main>
      <Footer name={profile.name ?? ""} location={profile.location ?? ""} />
    </div>
  );
}
