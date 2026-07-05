// Public reads for the blog. Uses publishable-key server client (RLS applies).
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "@tanstack/react-router";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "./admin-config";

type ServerCtx = {
  claims: { email?: string } & Record<string, any>;
  supabase: import("@supabase/supabase-js").SupabaseClient<Database>;
};

const statusSchema = z.enum(["draft", "published"]);
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(140, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only use lowercase letters, numbers, and hyphens");

const blogInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().max(180, "Title is too long").optional().default("Untitled post"),
  slug: slugSchema,
  excerpt: z.string().trim().max(500, "Excerpt is too long").nullable().optional(),
  cover_url: z.string().trim().max(1000, "Cover image URL is too long").nullable().optional(),
  body: z.string().max(200000, "Post body is too long").optional().default(""),
  category: z.string().trim().max(80, "Category is too long").nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20, "Too many tags").optional().default([]),
  status: statusSchema.optional().default("draft"),
  published_at: z.string().trim().nullable().optional(),
  seo_title: z.string().trim().max(180, "SEO title is too long").nullable().optional(),
  seo_description: z.string().trim().max(500, "SEO description is too long").nullable().optional(),
  author_name: z.string().trim().max(120, "Author name is too long").nullable().optional(),
});

const blogIdSchema = z.object({ id: z.string().uuid() });

function makeClient() {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const url = projectId ? `https://${projectId}.supabase.co` : process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

function adminClient(context: ServerCtx) {
  const email = context.claims?.email ?? "";
  if (!isAdminEmail(email)) throw new Error("Forbidden: not an admin");
  return context.supabase;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimateReading(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function normalizePost(input: z.infer<typeof blogInputSchema>, publish: boolean) {
  const title = input.title?.trim() || "Untitled post";
  const body = input.body ?? "";
  const status = publish ? "published" : "draft";
  const publishedAt =
    status === "published" ? input.published_at?.trim() || new Date().toISOString() : null;

  if (publish) {
    const missing = [
      !title || title === "Untitled post" ? "title" : null,
      !input.slug ? "slug" : null,
      !input.excerpt?.trim() ? "excerpt" : null,
      !body.trim() ? "body" : null,
      !input.cover_url?.trim() ? "featured image" : null,
      !input.author_name?.trim() ? "author" : null,
    ].filter(Boolean);
    if (missing.length) throw new Error(`Cannot publish yet. Missing: ${missing.join(", ")}.`);
  }

  return {
    ...(input.id ? { id: input.id } : {}),
    title,
    slug: input.slug || slugify(title) || `post-${Date.now()}`,
    excerpt: input.excerpt?.trim() || null,
    cover_url: input.cover_url?.trim() || null,
    body,
    category: input.category?.trim() || null,
    tags: Array.from(new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))),
    status,
    published_at: publishedAt,
    seo_title: input.seo_title?.trim() || null,
    seo_description: input.seo_description?.trim() || null,
    author_name: input.author_name?.trim() || null,
    reading_minutes: estimateReading(body),
  };
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

export const createBlogDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = adminClient(context as any);
    const slug = `draft-${Date.now()}`;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: "Untitled post",
        slug,
        status: "draft",
        body: "",
        tags: [],
        author_name: "Abdullah Al Mamun",
      })
      .select()
      .single();
    if (error) throw new Error(`Could not create draft: ${error.message}`);
    return data;
  });

export const saveBlogDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => blogInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = adminClient(context as any);
    const row = normalizePost(data, false);
    const { data: out, error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(`Could not save post: ${error.message}`);
    return out;
  });

export const publishBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => blogInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = adminClient(context as any);
    const row = normalizePost(data, true);
    const { data: out, error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(`Could not publish post: ${error.message}`);
    return out;
  });

export const unpublishBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => blogIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = adminClient(context as any);
    const { data: out, error } = await supabase
      .from("blog_posts")
      .update({ status: "draft", published_at: null })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(`Could not unpublish post: ${error.message}`);
    return out;
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => blogIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = adminClient(context as any);
    const { error } = await supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(`Could not delete post: ${error.message}`);
    return { ok: true };
  });
