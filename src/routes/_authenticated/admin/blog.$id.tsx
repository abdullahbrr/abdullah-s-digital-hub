import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/admin.functions";
import { publishBlogPost, saveBlogDraft, unpublishBlogPost } from "@/lib/blog.functions";
import { Button, Card, Field, PageHeader, TextArea, TextInput, useToast } from "@/components/admin/ui";
import { Upload, Eye, Save, Send } from "lucide-react";
import { MediaImage } from "@/components/MediaImage";
import { fileToBase64, prepareImageFile } from "@/lib/media-upload.client";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  component: BlogEditor,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimateReading(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function BlogEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  
  const { toast, view } = useToast();
  const saveDraft = useServerFn(saveBlogDraft);
  const publishPost = useServerFn(publishBlogPost);
  const unpublishPost = useServerFn(unpublishBlogPost);
  const upload = useServerFn(uploadMedia);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "blog_posts", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  useEffect(() => { if (data) setDraft(data); }, [data]);

  const saveMut = useMutation({
    mutationFn: ({ row, publish }: { row: Record<string, any>; publish: boolean }) =>
      publish ? publishPost({ data: row as any }) : saveDraft({ data: row as any }),
    onSuccess: (row) => {
      setDraft(row as any);
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts", id] });
      qc.invalidateQueries({ queryKey: ["blog"] });
      toast("ok", "Saved");
    },
    onError: (e) => toast("err", (e as Error).message),
  });

  const unpublishMut = useMutation({
    mutationFn: () => unpublishPost({ data: { id } }),
    onSuccess: (row) => {
      setDraft(row as any);
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts", id] });
      qc.invalidateQueries({ queryKey: ["blog"] });
      toast("ok", "Moved to draft");
    },
    onError: (e) => toast("err", (e as Error).message),
  });

  function set<K extends string>(key: K, value: any) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function handleCover(file: File) {
    try {
      const readyFile = await prepareImageFile(file);
      const base64 = await fileToBase64(readyFile);
      const r = await upload({ data: { filename: readyFile.name, contentType: readyFile.type, base64, pathPrefix: "blog-covers" } });
      set("cover_url", r.url);
      toast("ok", "Featured image uploaded");
    } catch (e) { toast("err", (e as Error).message); }
  }

  function save(publish?: boolean) {
    if (!draft) return;
    const row: any = {
      ...draft,
      title: (draft.title || "").trim() || "Untitled post",
      slug: (draft.slug || "").trim() || slugify(draft.title || "") || `post-${Date.now()}`,
      excerpt: draft.excerpt ?? "",
      cover_url: draft.cover_url ?? "",
      body: draft.body ?? "",
      category: draft.category ?? "",
      author_name: draft.author_name ?? "",
      tags: Array.isArray(draft.tags) ? draft.tags : [],
      reading_minutes: estimateReading(draft.body || ""),
    };
    // Timestamp cols reject empty strings — coerce to null.
    if (!row.published_at || String(row.published_at).trim() === "") row.published_at = null;
    if (publish) {
      row.status = "published";
      row.published_at = row.published_at || new Date().toISOString();
    }
    saveMut.mutate({ row, publish: Boolean(publish) });
  }


  if (isLoading || !draft) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const isPublished = draft.status === "published";

  return (
    <>
      <PageHeader
        title={draft.title || "Untitled"}
        description={`Status: ${draft.status}`}
      />
      <div className="-mt-4 mb-4">
        <Link to="/admin/blog" className="text-xs text-muted-foreground hover:text-foreground">← All posts</Link>
      </div>


      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card>
            <Field label="Title">
              <TextInput
                value={draft.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
                onBlur={() => { if (!draft.slug || draft.slug.startsWith("draft-")) set("slug", slugify(draft.title || "")); }}
              />
            </Field>
            <Field label="Slug (URL path)">
              <TextInput value={draft.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="my-post" />
            </Field>
            <Field label="Excerpt (short summary shown on the list)">
              <TextArea value={draft.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} rows={2} />
            </Field>
            <Field label="Body (HTML or plain text with blank lines between paragraphs)">
              <TextArea
                value={draft.body ?? ""}
                onChange={(e) => set("body", e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </Field>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <div className="flex flex-col gap-2">
              <Button onClick={() => save(false)} loading={saveMut.isPending}>
                <Save className="h-4 w-4" /> Save draft
              </Button>
              <Button onClick={() => save(true)} loading={saveMut.isPending}>
                <Send className="h-4 w-4" /> {isPublished ? "Update published" : "Publish now"}
              </Button>
              {isPublished && (
                <a
                  href={`/blog/${draft.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-4 w-4" /> View live
                </a>
              )}
              {isPublished && (
                <Button variant="ghost" onClick={() => unpublishMut.mutate()} loading={unpublishMut.isPending}>
                  Unpublish
                </Button>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-sm font-bold">Cover image</h3>
            {draft.cover_url && <MediaImage src={draft.cover_url} alt="" className="mb-3 aspect-[16/9] w-full rounded-lg object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">
              <Upload className="h-3 w-3" /> Upload cover
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCover(f); e.currentTarget.value = ""; }}
              />
            </label>
            <Field label="Or paste image URL">
              <TextInput value={draft.cover_url ?? ""} onChange={(e) => set("cover_url", e.target.value)} />
            </Field>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-sm font-bold">Meta</h3>
            <Field label="Tags (comma-separated)">
              <TextInput
                value={Array.isArray(draft.tags) ? draft.tags.join(", ") : ""}
                onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </Field>
            <Field label="Category">
              <TextInput value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="News, Award, Story…" />
            </Field>
            <Field label="Author name">
              <TextInput value={draft.author_name ?? ""} onChange={(e) => set("author_name", e.target.value)} placeholder="Abdullah Al Mamun" />
            </Field>
            <Field label="Publish date (ISO, optional)">
              <TextInput value={draft.published_at ?? ""} onChange={(e) => set("published_at", e.target.value)} placeholder="2026-07-02T12:00:00Z" />
            </Field>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-sm font-bold">SEO</h3>
            <Field label="SEO title (optional)">
              <TextInput value={draft.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} />
            </Field>
            <Field label="SEO description (optional)">
              <TextArea value={draft.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} rows={3} />
            </Field>
          </Card>
        </aside>
      </div>
      {view}
    </>
  );
}
