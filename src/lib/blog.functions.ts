// Public reads for the blog. Uses publishable-key server client (RLS applies).
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";

function makeClient() {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const url = projectId ? `https://${projectId}.supabase.co` : process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = makeClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,cover_url,category,tags,published_at,reading_minutes,author_name")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const supabase = makeClient();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw notFound();
    return post;
  });
