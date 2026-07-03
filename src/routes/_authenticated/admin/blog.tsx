import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { upsertCollectionItem, deleteCollectionItem } from "@/lib/admin.functions";
import { Button, Card, PageHeader, useToast } from "@/components/admin/ui";
import { Plus, Trash2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});


function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `post-${Date.now()}`;
}

function BlogAdmin() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast, view } = useToast();
  const upsert = useServerFn(upsertCollectionItem);
  const del = useServerFn(deleteCollectionItem);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,status,published_at,updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      return upsert({
        data: {
          table: "blog_posts",
          row: {
            title: "Untitled post",
            slug: `draft-${Date.now()}`,
            status: "draft",
            body: "",
            tags: [],
            author_name: "Abdullah Al Mamun",
          },
        },
      });
    },
    onSuccess: (row: any) => {
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      toast("ok", "Draft created");
      if (row?.id) navigate({ to: "/admin/blog/$id", params: { id: row.id } });
    },
    onError: (e) => toast("err", (e as Error).message),
  });


  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { table: "blog_posts", id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] }); toast("ok", "Deleted"); },
    onError: (e) => toast("err", (e as Error).message),
  });

  return (
    <>
      <PageHeader title="Blog" description="Write, edit, and publish blog posts. Each published post gets its own public page at /blog/<slug>." />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => createMut.mutate()} loading={createMut.isPending}>
          <Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <Card><p className="text-sm text-muted-foreground">No posts yet. Click "New post" to write your first.</p></Card>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="surface-card flex items-center gap-3 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.status === "published" ? "bg-green-500/15 text-green-500" : "bg-amber-500/15 text-amber-500"}`}>
                    {p.status}
                  </span>
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">/{p.slug}</p>
              </div>
              {p.status === "published" && (
                <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="View live">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Link
                to="/admin/blog/$id"
                params={{ id: p.id }}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Edit
              </Link>
              <Button variant="danger" onClick={() => { if (confirm(`Delete "${p.title}"?`)) delMut.mutate(p.id); }} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {view}
    </>
  );
}

export { slugify };
