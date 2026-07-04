// Interactive, story-driven flourishes: rotating quote band, animated story
// timeline with journey cursor, scroll-reveal wrapper, and a blog preview.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Quote, ArrowUpRight, Sparkles } from "lucide-react";
import { Section } from "./Section";
import { MediaImage } from "@/components/MediaImage";

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

/**
 * Story timeline with an animated cursor that moves down a journey line as the
 * user scrolls. Each chapter reveals with its own image if provided.
 */
export function StoryTimeline({
  story,
}: {
  story: { intro?: string; chapters?: Array<{ year: string; title: string; body: string; image_url?: string }> };
}) {
  const chapters = story?.chapters ?? [];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    if (!chapters.length) return;
    let raf = 0;
    function update() {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start when top hits 80% of viewport, finish when bottom hits 20%.
      const total = rect.height + vh * 0.6;
      const traveled = vh * 0.8 - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapters.length]);

  if (!chapters.length) return null;

  return (
    <Section id="story" eyebrow="The story" title="How I got here." description={story?.intro}>
      <div ref={wrapRef} className="relative">
        {/* Journey line — hidden on very small screens */}
        <div aria-hidden className="pointer-events-none absolute left-4 top-0 bottom-0 hidden w-0.5 sm:block md:left-1/2 md:-translate-x-1/2">
          <div className="h-full w-full rounded-full bg-border/60" />
          <div
            className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-brand via-brand-2 to-brand-3 shadow-[0_0_16px_hsl(var(--ring)/.55)] transition-[height] duration-150 ease-out"
            style={{ height: `${progress * 100}%` }}
          />
          {/* Moving cursor */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-[top] duration-150 ease-out"
            style={{ top: `calc(${progress * 100}% - 10px)` }}
          >
            <span className="relative block h-5 w-5 rounded-full bg-gradient-brand shadow-lg shadow-brand/40">
              <span className="absolute inset-0 rounded-full bg-gradient-brand opacity-60 blur-md animate-pulse" />
              <span className="absolute inset-1 rounded-full bg-background" />
              <span className="absolute inset-1.5 rounded-full bg-gradient-brand" />
            </span>
          </div>
        </div>

        <ol className="relative space-y-8 sm:space-y-12">
          {chapters.map((c, i) => {
            const side = i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]";
            return (
              <Reveal key={i} delay={i * 60}>
                <li className={`relative pl-10 sm:pl-14 md:pl-0 ${side}`}>
                  {/* Dot on the line for each chapter */}
                  <span aria-hidden className="absolute left-2.5 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-gradient-brand sm:block md:left-1/2" />
                  <div className="surface-card group relative overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-brand/50">
                    {c.image_url && (
                      <MediaImage
                        src={c.image_url}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-gradient-brand">
                        <Sparkles className="h-3 w-3 text-brand" /> {c.year}
                      </span>
                      <h3 className="mt-4 font-display text-lg font-bold text-foreground">{c.title}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                    </div>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/** Blog preview — replaces the old Writings section. Shows latest posts (min 3 slots). */
export function BlogPreview({ posts }: { posts: any[] }) {
  const rows = (posts ?? []).slice(0, 6);
  const placeholders = Math.max(0, 3 - rows.length);
  return (
    <Section
      id="writings"
      eyebrow="Journal"
      title="Latest from the blog."
      description="Essays, field notes, and short reflections. New posts appear here the moment they're published."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <Link
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="surface-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-brand/50"
            >
              {p.cover_url ? (
                <MediaImage src={p.cover_url} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              ) : (
                <div className="aspect-[16/9] w-full bg-gradient-brand/15" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  {p.published_at && (
                    <time>{new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time>
                  )}
                  {p.reading_minutes ? <span>· {p.reading_minutes} min</span> : null}
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-gradient-brand">
                  {p.title}
                </h3>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gradient-brand">
                  Read <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="surface-card grid aspect-[4/5] place-items-center rounded-2xl border-dashed p-6 text-center text-sm text-muted-foreground sm:aspect-auto"
          >
            <div>
              <p className="font-display text-base font-semibold">Coming soon</p>
              <p className="mt-1 text-xs">A new post will land here.</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/50"
        >
          Visit the blog <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}

/** Backwards-compat shim so existing imports of Writings still work. */
export function Writings({ rows: _rows }: { rows: any[] }) {
  return null;
}
