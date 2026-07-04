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
import { QuoteBand, StoryTimeline, BlogPreview, Reveal } from "@/components/portfolio/Interactive";

const SITE_TITLE = "Abdullah Al Mamun — Engineer, Researcher & Writer";
const SITE_DESC = "Portfolio of Abdullah Al Mamun: B.Sc. EEE engineer building smart-metering systems, advancing photovoltaic research, writing essays, and shipping award-winning ventures from Bangladesh.";

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
  loader: async () => {
    return getSiteContent();
  },
  component: Home,
});

const SECTION_LABELS: Record<string, string> = {
  about: "About", education: "Education", experience: "Experience", skills: "Skills",
  research: "Research", publications: "Publications", projects: "Projects",
  writings: "Blog", awards: "Awards", organizations: "Organizations", contact: "Contact",
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
  const loaderData = Route.useLoaderData();
  const fetchContent = useServerFn(getSiteContent);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => fetchContent(),
    initialData: loaderData,
    staleTime: 30_000,
  });

  useEffect(() => { applyThemePreset(data?.settings?.theme?.preset); }, [data]);

  if (isError) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-foreground">Could not load portfolio</p>
          <p className="mt-2 text-sm text-muted-foreground">{(error as Error)?.message ?? "Unknown error"}</p>
          <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="grid min-h-dvh place-items-center bg-background text-muted-foreground">Loading…</div>;
  }

  const s = data.settings;
  const profile = s.profile ?? {};
  const order: string[] = Array.isArray(s.sectionOrder) ? s.sectionOrder : Object.keys(SECTION_LABELS);
  const visible: Set<string> = new Set(Array.isArray(s.visibleSections) ? s.visibleSections : order);
  const navItems = order.filter((id) => visible.has(id)).map((id) => ({ id, label: SECTION_LABELS[id] ?? id }));

  const quotes: Array<{ text: string; author?: string }> = Array.isArray(s.quotes) ? s.quotes : [];
  const story = s.story ?? {};
  const interludeAfter = new Set(["about", "experience", "publications"]);

  const d = data;
  function renderSection(id: string) {
    if (!visible.has(id)) return null;
    switch (id) {
      case "about":         return <Reveal key={id}><About profile={profile} about={s.about ?? {}} /></Reveal>;
      case "education":     return <Reveal key={id}><Education rows={d.educations} /></Reveal>;
      case "experience":    return <Reveal key={id}><Experience rows={d.experiences} /></Reveal>;
      case "skills":        return <Reveal key={id}><Skills rows={d.skillGroups} /></Reveal>;
      case "research":      return <Reveal key={id}><Research research={s.research ?? {}} /></Reveal>;
      case "publications":  return <Reveal key={id}><Publications rows={d.publications} /></Reveal>;
      case "projects":      return <Reveal key={id}><Projects rows={d.projects} /></Reveal>;
      case "writings":      return <Reveal key={id}><BlogPreview posts={(d as any).posts ?? []} /></Reveal>;
      case "awards":        return <Reveal key={id}><Awards rows={d.awards} /></Reveal>;
      case "organizations": return <Reveal key={id}><Organizations rows={d.organizations} /></Reveal>;
      case "contact":       return <Reveal key={id}><Contact profile={profile} social={s.social ?? {}} cvUrl={s.media?.cvUrl} /></Reveal>;
      default: return null;
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav name={profile.name ?? ""} initials={profile.initials ?? "AM"} sections={navItems} />
      <main id="main">
        <Hero profile={profile} portraitUrl={s.media?.portraitUrl} />
        {quotes.length > 0 && (
          <QuoteBand quotes={quotes.length > 1 ? [quotes[0]] : quotes} />
        )}
        {(story?.chapters?.length ?? 0) > 0 && <StoryTimeline story={story} />}
        {order.map((id, idx) => (
          <div key={id}>
            {renderSection(id)}
            {interludeAfter.has(id) && quotes[idx % quotes.length] && (
              <QuoteBand quotes={[quotes[(idx + 1) % quotes.length]]} />
            )}
          </div>
        ))}
      </main>
      <Footer name={profile.name ?? ""} location={profile.location ?? ""} />
    </div>
  );
}
