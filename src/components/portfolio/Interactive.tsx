// Interactive, story-driven flourishes: rotating quote band, story timeline,
// scroll-reveal wrapper, and a Writings section.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Quote, BookText, ArrowUpRight, Feather, Sparkles } from "lucide-react";
import { Section } from "./Section";

/** Wrap any block to fade/slide it in on scroll. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}
    >
      {children}
    </div>
  );
}

/** Rotating pull-quote band, auto-advances every 6s, pauseable on hover. */
export function QuoteBand({ quotes }: { quotes: Array<{ text: string; author?: string }> }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || quotes.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, [paused, quotes.length]);
  if (!quotes.length) return null;
  const q = quotes[i];
  return (
    <section aria-label="Quote" className="relative py-16 sm:py-20">
      <div
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Reveal>
          <figure className="surface-card relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <div aria-hidden className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
            <Quote className="h-8 w-8 text-brand" aria-hidden />
            <blockquote className="mt-4 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl lg:text-4xl">
              <span key={i} className="block animate-fade-up">"{q.text}"</span>
            </blockquote>
            {q.author && (
              <figcaption className="mt-5 text-sm font-semibold uppercase tracking-wider text-gradient-brand">
                — {q.author}
              </figcaption>
            )}
            {quotes.length > 1 && (
              <div className="mt-6 flex items-center gap-1.5">
                {quotes.map((_, k) => (
                  <button
                    key={k}
                    aria-label={`Quote ${k + 1}`}
                    onClick={() => setI(k)}
                    className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gradient-brand" : "w-3 bg-border hover:bg-muted-foreground"}`}
                  />
                ))}
              </div>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/** Chronological story timeline that animates in chapter by chapter. */
export function StoryTimeline({ story }: { story: { intro?: string; chapters?: Array<{ year: string; title: string; body: string }> } }) {
  const chapters = story?.chapters ?? [];
  if (!chapters.length) return null;
  return (
    <Section id="story" eyebrow="The story" title="How I got here." description={story?.intro}>
      <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {chapters.map((c, i) => (
          <Reveal key={i} delay={i * 90}>
            <li className="surface-card group relative h-full overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-brand/50">
              <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-3xl transition group-hover:opacity-30" />
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-gradient-brand">
                <Sparkles className="h-3 w-3 text-brand" /> {c.year}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/** Writings section: essays, poetry, field notes. */
export function Writings({ rows }: { rows: any[] }) {
  if (!rows?.length) return null;
  return (
    <Section
      id="writings"
      eyebrow="Writing"
      title="Notes from the workbench."
      description="Essays, field notes, and the occasional short poem — engineering as a way of paying attention."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((w, i) => {
          const Icon = w.kind === "poetry" ? Feather : BookText;
          const Wrapper: any = w.url ? "a" : "article";
          const wrapperProps = w.url ? { href: w.url, target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <Reveal key={w.id} delay={i * 70}>
              <Wrapper
                {...wrapperProps}
                className="surface-card group relative block h-full overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-brand/50"
              >
                <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-brand opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Icon className="h-3 w-3 text-brand" /> {w.kind || "essay"}
                  </span>
                  {w.date && <span className="text-xs text-muted-foreground">{w.date}</span>}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground group-hover:text-gradient-brand">
                  {w.title}
                </h3>
                {w.summary && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.summary}</p>}
                {!w.summary && w.body && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground line-clamp-5">
                    {w.body}
                  </p>
                )}
                {(w.tags ?? []).length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {(w.tags ?? []).map((t: string) => (
                      <li key={t} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        #{t}
                      </li>
                    ))}
                  </ul>
                )}
                {w.url && (
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-gradient-brand">
                    Read <ArrowUpRight className="h-3 w-3" />
                  </span>
                )}
              </Wrapper>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
