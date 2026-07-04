import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listPublishedPosts } from "@/lib/blog.functions";
import { MediaImage } from "@/components/MediaImage";

const postsQuery = queryOptions({
  queryKey: ["blog", "list"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/blog")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Blog — Abdullah Al Mamun" },
      { name: "description", content: "Essays, notes, and stories by Abdullah Al Mamun." },
      { property: "og:title", content: "Blog — Abdullah Al Mamun" },
      { property: "og:description", content: "Essays, notes, and stories." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogList,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Couldn't load posts</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-gradient-brand">← Home</Link>
      </div>
    </div>
  ),
});

function BlogList() {
  const { data: posts } = useSuspenseQuery(postsQuery);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
        </div>
        <header className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Journal</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Writings & stories</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A quiet place for essays, notes, and things I'm thinking about.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border p-10 text-center">
            <p className="text-muted-foreground">No posts yet. Come back soon.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group grid gap-5 rounded-2xl border border-border bg-card p-5 transition hover:border-brand/40 hover:shadow-lg sm:grid-cols-[220px_1fr] sm:p-6"
                >
                  {p.cover_url ? (
                    <MediaImage
                      src={p.cover_url}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full rounded-xl bg-gradient-brand/10" />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {p.published_at && <time>{new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time>}
                      {p.reading_minutes ? <span>· {p.reading_minutes} min read</span> : null}
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-snug group-hover:text-gradient-brand">
                      {p.title}
                    </h2>
                    {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>}
                    {p.tags && p.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
