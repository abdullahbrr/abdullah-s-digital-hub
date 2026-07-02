import { useEffect, useState } from "react";
import { Menu, X, CalendarCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Nav({
  name,
  initials,
  sections,
}: {
  name: string;
  initials: string;
  sections: Array<{ id: string; label: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-lg" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand font-display text-sm font-bold text-brand-foreground">
            {initials}
          </span>
          <span className="truncate font-display text-base font-bold text-foreground">{name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.slice(0, 6).map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
              {item.label}
            </a>
          ))}
          <a href="/blog" className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
            Blog
          </a>
        </nav>


        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" className="hidden items-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 transition hover:opacity-95 sm:inline-flex">
            <CalendarCheck className="h-4 w-4" /> Hire me
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {sections.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                {item.label}
              </a>
            ))}
            <a href="/blog" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
              Blog
            </a>
          </nav>

        </div>
      )}
    </header>
  );
}
