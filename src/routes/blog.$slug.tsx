import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getPostBySlug } from "@/lib/blog.functions";
import { MediaImage } from "@/components/MediaImage";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPostBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const url = `https://mamun-digital-garden.lovable.app/blog/${params.slug}`;
    const title = loaderData.seo_title || loaderData.title;
    const desc = loaderData.seo_description || loaderData.excerpt || "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(loaderData.cover_url ? [{ property: "og:image", content: loaderData.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title,
            description: desc,
            image: loaderData.cover_url || undefined,
            datePublished: loaderData.published_at,
            author: { "@type": "Person", name: loaderData.author_name || "Abdullah Al Mamun" },
          }),
        },
      ],
    };
  },
  component: BlogPost,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Couldn't load this post</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/blog" className="mt-4 inline-block text-gradient-brand">← Back to blog</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been unpublished or moved.</p>
        <Link to="/blog" className="mt-4 inline-block text-gradient-brand">← Back to blog</Link>
      </div>
    </div>
  ),
});

function renderBody(body: string): string {
  const trimmed = body.trim();
  // If it looks like HTML already, render a small safe subset.
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) return sanitizeHtml(trimmed);
  // Otherwise treat as plain paragraphs.
  return trimmed
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeHtml(value: string) {
  if (typeof document === "undefined") return escapeHtml(value);
  const template = document.createElement("template");
  template.innerHTML = value;
  const allowed = new Set(["A", "B", "BLOCKQUOTE", "BR", "CODE", "EM", "H2", "H3", "H4", "HR", "I", "IMG", "LI", "OL", "P", "PRE", "STRONG", "U", "UL"]);
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
  const remove: Element[] = [];

  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    if (!allowed.has(el.tagName)) {
      remove.push(el);
      continue;
    }
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      const keep =
        (el.tagName === "A" && ["href", "title", "target", "rel"].includes(name) && !val.startsWith("javascript:")) ||
        (el.tagName === "IMG" && ["src", "alt", "title", "loading"].includes(name) && !val.startsWith("javascript:"));
      if (!keep) el.removeAttribute(attr.name);
    }
    if (el.tagName === "A") el.setAttribute("rel", "noopener noreferrer");
    if (el.tagName === "IMG" && !el.getAttribute("loading")) el.setAttribute("loading", "lazy");
  }
  remove.forEach((el) => el.replaceWith(document.createTextNode(el.textContent ?? "")));
  return template.innerHTML;
}

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));

  return (
    <article className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Blog</Link>
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.published_at && <time>{new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</time>}
            {post.category && <span>· {post.category}</span>}
            {post.reading_minutes ? <span>· {post.reading_minutes} min read</span> : null}
            {post.author_name && <span>· {post.author_name}</span>}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
        </header>

        {post.cover_url && (
          <MediaImage
            src={post.cover_url}
            alt=""
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}

        <div
          className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-a:text-gradient-brand prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: renderBody(post.body) }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5 border-t border-border pt-6">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
