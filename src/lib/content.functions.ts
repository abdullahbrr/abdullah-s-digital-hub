// Public read of site content. Uses publishable-key server client so it works
// during SSR and on edge runtimes; everything is gated by anon SELECT policies.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type SiteContent = Awaited<ReturnType<typeof loadSiteContent>>;

function makeClient() {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const url = projectId
    ? `https://${projectId}.supabase.co`
    : process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function loadSiteContent() {
  const supabase = makeClient();
  const [settings, publications, projects, experiences, educations, awards, organizations, skills, writings] =
    await Promise.all([
      supabase.from("site_settings").select("data").eq("id", "global").maybeSingle(),
      supabase.from("publications").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("educations").select("*").order("sort_order"),
      supabase.from("awards").select("*").order("sort_order"),
      supabase.from("organizations").select("*").order("sort_order"),
      supabase.from("skill_groups").select("*").order("sort_order"),
      supabase.from("writings").select("*").order("sort_order"),
    ]);

  return {
    settings: (settings.data?.data ?? {}) as Record<string, any>,
    publications: publications.data ?? [],
    projects: projects.data ?? [],
    experiences: experiences.data ?? [],
    educations: educations.data ?? [],
    awards: awards.data ?? [],
    organizations: organizations.data ?? [],
    skillGroups: skills.data ?? [],
    writings: writings.data ?? [],
  };
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  return loadSiteContent();
});
