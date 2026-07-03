import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Award as AwardIcon, ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

const getAward = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const projectId = process.env.SUPABASE_PROJECT_ID;
    const url = projectId ? `https://${projectId}.supabase.co` : process.env.SUPABASE_URL!;
    const supabase = createClient<Database>(url, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: row, error } = await supabase.from("awards").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw notFound();
    return row;
  });

const awardQuery = (id: string) =>
  queryOptions({ queryKey: ["award", id], queryFn: () => getAward({ data: { id } }) });

export const Route = createFileRoute("/awards/$id")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(awardQuery(params.id)),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Award" }] };
    const title = `${loaderData.title} — Award`;
    const desc = loaderData.description || `${loaderData.title}${loaderData.org ? " · " + loaderData.org : ""}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        ...(loaderData.image_url ? [{ property: "og:image", content: loaderData.image_url }] : []),
      ],
    };
  },
  component: AwardPage,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh grid place-items-center p-6 text-center">
      <p>{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Award not found</h1>
        <Link to="/" className="mt-4 inline-block text-gradient-brand">← Home</Link>
      </div>
    </div>
  ),
});

function AwardPage() {
  const { id } = Route.useParams();
  const { data: a } = useSuspenseQuery(awardQuery(id));
  return (
    <article className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Link to="/" hash="awards" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All awards
        </Link>
        <header className="mt-8 flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-brand-foreground">
            <AwardIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{a.title}</h1>
            {(a.org || a.date) && (
              <p className="mt-2 text-sm text-muted-foreground">
                {a.org}{a.org && a.date ? " · " : ""}{a.date}
              </p>
            )}
            {a.prize && (
              <p className="mt-3 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-gradient-brand">
                {a.prize}
              </p>
            )}
          </div>
        </header>

        {a.image_url && (
          <img src={a.image_url} alt={a.title} className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />
        )}

        {a.description && (
          <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
            {a.description}
          </div>
        )}
      </div>
    </article>
  );
}
