import {
  Award, BookOpen, Briefcase, ExternalLink, FlaskConical, GraduationCap, Mail, MapPin, Phone, Users, Wrench, CalendarCheck, Linkedin, Github, Sparkles, ArrowUpRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Section } from "./Section";


export function About({ profile, about }: { profile: Record<string, any>; about: Record<string, any> }) {
  const paragraphs: string[] = about?.paragraphs ?? [];
  const highlights: Array<{ label: string; value: string }> = about?.highlights ?? [];
  return (
    <Section id="about" eyebrow="About" title="Engineer, researcher, and builder.">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {highlights.length > 0 && (
          <dl className="grid grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div key={h.label} className="surface-card rounded-2xl p-5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{h.label}</dt>
                <dd className="mt-2 font-display text-3xl font-bold text-gradient-brand">{h.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  );
}

export function Education({ rows }: { rows: any[] }) {
  return (
    <Section id="education" eyebrow="Education" title="Academic foundation.">
      <ul className="space-y-4">
        {rows.map((e) => (
          <li key={e.id} className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:p-8">
            <div className="flex items-center gap-3 sm:flex-col sm:items-start">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"><GraduationCap className="h-5 w-5" /></span>
              <span className="text-sm font-semibold text-gradient-brand">{e.period}</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold text-foreground">{e.degree}</h3>
              <p className="mt-1 text-sm font-medium text-foreground">{e.institution}</p>
              {e.location && <p className="text-sm text-muted-foreground">{e.location}</p>}
              {e.details && <p className="mt-3 text-sm text-muted-foreground">{e.details}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Experience({ rows }: { rows: any[] }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked."
      description="From global smart-metering to renewable-energy field work, research consultancy, and entrepreneurship.">
      <ol className="relative space-y-4 border-l border-border pl-6">
        {rows.map((job) => (
          <li key={job.id} className="relative">
            <span aria-hidden className="absolute -left-[31px] top-6 grid h-5 w-5 place-items-center rounded-full bg-gradient-brand ring-4 ring-background">
              <Briefcase className="h-2.5 w-2.5 text-brand-foreground" />
            </span>
            <article className="surface-card rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">{job.period}</p>
              <h3 className="mt-1.5 font-display text-lg font-bold text-foreground sm:text-xl">{job.title}</h3>
              {job.company && <p className="text-sm font-medium text-foreground">{job.company}</p>}
              {job.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.description}</p>}
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Skills({ rows }: { rows: any[] }) {
  return (
    <Section id="skills" eyebrow="Skills" title="Tools I work with."
      description="Simulation, analysis, design, and research workflows that move projects from idea to result.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((g) => (
          <div key={g.id} className="surface-card rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{g.group_name}</h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {(g.items ?? []).map((s: string) => (
                <li key={s} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground">{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Research({ research }: { research: Record<string, any> }) {
  const interests: string[] = research?.interests ?? [];
  const ass = research?.assistantship ?? {};
  const projects: any[] = research?.projects ?? [];
  return (
    <Section id="research" eyebrow="Research" title="Interests & projects."
      description="Applied research in renewable energy, photovoltaics, and power electronics.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card rounded-2xl p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Research interests</h3>
          </div>
          <ul className="space-y-3">
            {interests.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>{i}</span>
              </li>
            ))}
          </ul>
          {(ass.role || ass.supervisor || ass.responsibilities) && (
            <div className="mt-8 rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">Research Assistantship</p>
              {ass.role && <p className="mt-2 text-sm font-semibold text-foreground">{ass.role}</p>}
              {ass.supervisor && <p className="text-sm text-muted-foreground">Supervisor: {ass.supervisor}</p>}
              {ass.responsibilities && <p className="mt-3 text-sm text-muted-foreground">{ass.responsibilities}</p>}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {projects.map((p, i) => (
            <article key={i} className="surface-card rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">{p.period}</p>
              <h4 className="mt-1.5 font-display text-lg font-bold text-foreground">{p.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{p.funder}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Publications({ rows }: { rows: any[] }) {
  return (
    <Section id="publications" eyebrow="Publications" title="Peer-reviewed work."
      description="Journal publications on renewable energy, photovoltaics, and sustainable engineering.">
      <ul className="space-y-3">
        {rows.map((p) => (
          <li key={p.id}>
            <a href={p.url || `https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="surface-card group block rounded-2xl p-6 transition hover:border-brand/40">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"><BookOpen className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold text-foreground sm:text-lg">{p.title}</h3>
                  {(p.venue || p.date) && <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium text-foreground">{p.venue}</span>{p.venue && p.date ? " · " : ""}{p.date}</p>}
                  {p.doi && <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gradient-brand">DOI: {p.doi}<ExternalLink className="h-3 w-3" /></p>}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Projects({ rows }: { rows: any[] }) {
  return (
    <Section id="projects" eyebrow="Projects" title="Selected work."
      description="Engineering and research projects spanning smart metering, photovoltaics, and power electronics.">
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((p) => (
          <article key={p.id} className="surface-card group relative overflow-hidden rounded-2xl p-6 sm:p-7">
            <div aria-hidden className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-brand opacity-0 blur-3xl transition group-hover:opacity-30" />
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">{p.title}</h3>
            {p.summary && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>}
            {(p.tags ?? []).length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {(p.tags ?? []).map((t: string) => (
                  <li key={t} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">{t}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Awards({ rows }: { rows: any[] }) {
  return (
    <Section id="awards" eyebrow="Awards" title="Recognition."
      description="Each award has its own page — click any card to read the story and see photos.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => (
          <Link
            key={a.id}
            to="/awards/$id"
            params={{ id: a.id }}
            className="surface-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-brand/50"
          >
            {a.image_url ? (
              <img src={a.image_url} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="grid aspect-[16/9] w-full place-items-center bg-gradient-brand/15">
                <Award className="h-10 w-10 text-brand" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-base font-bold text-foreground group-hover:text-gradient-brand">{a.title}</h3>
              {a.org && <p className="mt-1 text-sm text-muted-foreground">{a.org}</p>}
              <div className="mt-3 flex items-center justify-between gap-2">
                {a.prize && <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-gradient-brand">{a.prize}</span>}
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-gradient-brand">
                  Read <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}


export function Organizations({ rows }: { rows: any[] }) {
  return (
    <Section id="organizations" eyebrow="Organizations" title="Leadership & community."
      description="Roles in youth-development, welfare, and policy organizations.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((o) => (
          <article key={o.id} className="surface-card rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"><Users className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-base font-bold text-foreground">{o.role}</h3>
            {o.org && <p className="mt-1 text-sm font-medium text-foreground">{o.org}</p>}
            {o.location && <p className="text-sm text-muted-foreground">{o.location}</p>}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Contact({ profile, social, cvUrl }: { profile: Record<string, any>; social: Record<string, any>; cvUrl?: string }) {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something together."
      description="Open to research collaborations, consultancy, career guidance conversations, and engineering partnerships.">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-card relative overflow-hidden rounded-3xl p-8 sm:p-10">
          <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Book an appointment</h3>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Schedule a 1:1 to discuss research, consultancy, career guidance, collaboration, or anything else.
          </p>
          <button type="button" disabled title="Booking flow ships in Phase 3" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-xl shadow-brand/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
            <CalendarCheck className="h-4 w-4" /> Book a meeting
          </button>
          <p className="mt-3 text-xs text-muted-foreground">Booking system activates in the next deployment phase.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-accent"><Linkedin className="h-4 w-4" /></a>}
            {social?.github && <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-accent"><Github className="h-4 w-4" /></a>}
            {cvUrl && <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-xs font-semibold text-foreground transition hover:bg-accent">Download CV</a>}
          </div>
        </div>

        <div className="space-y-3">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="surface-card group flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand/40">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"><Mail className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="truncate text-sm font-semibold text-foreground">{profile.email}</p>
              </div>
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${String(profile.phone).replace(/[^+\d]/g, "")}`} className="surface-card group flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand/40">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"><Phone className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                <p className="text-sm font-semibold text-foreground">{profile.phone}</p>
              </div>
            </a>
          )}
          {profile.location && (
            <div className="surface-card flex items-center gap-4 rounded-2xl p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"><MapPin className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground">{profile.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export function Footer({ name, location }: { name: string; location: string }) {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {name}. All rights reserved.</p>
        {location && <p className="text-xs text-muted-foreground">Built with care · {location}</p>}
      </div>
    </footer>
  );
}
