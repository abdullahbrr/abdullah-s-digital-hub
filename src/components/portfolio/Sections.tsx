import {
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Users,
  Wrench,
  CalendarCheck,
  Linkedin,
  Github,
  Sparkles,
} from "lucide-react";
import { Section } from "./Section";
import {
  about,
  awards,
  education,
  experience,
  organizations,
  profile,
  projects,
  publications,
  research,
  skills,
} from "./data";

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineer, researcher, and builder.">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-4">
          {about.highlights.map((h) => (
            <div
              key={h.label}
              className="surface-card rounded-2xl p-5"
            >
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {h.label}
              </dt>
              <dd className="mt-2 font-display text-3xl font-bold text-gradient-brand">
                {h.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic foundation.">
      <ul className="space-y-4">
        {education.map((e) => (
          <li
            key={e.degree}
            className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:p-8"
          >
            <div className="flex items-center gap-3 sm:flex-col sm:items-start">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-gradient-brand">{e.period}</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold text-foreground">{e.degree}</h3>
              <p className="mt-1 text-sm font-medium text-foreground">{e.institution}</p>
              <p className="text-sm text-muted-foreground">{e.location}</p>
              <p className="mt-3 text-sm text-muted-foreground">{e.details}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked."
      description="From global smart-metering to renewable-energy field work, research consultancy, and entrepreneurship."
    >
      <ol className="relative space-y-4 border-l border-border pl-6">
        {experience.map((job) => (
          <li key={job.title + job.period} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-6 grid h-5 w-5 place-items-center rounded-full bg-gradient-brand ring-4 ring-background"
            >
              <Briefcase className="h-2.5 w-2.5 text-brand-foreground" />
            </span>
            <article className="surface-card rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">
                {job.period}
              </p>
              <h3 className="mt-1.5 font-display text-lg font-bold text-foreground sm:text-xl">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-foreground">{job.company}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {job.description}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tools I work with."
      description="Simulation, analysis, design, and research workflows that move projects from idea to result."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g) => (
          <div key={g.group} className="surface-card rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {g.group}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Research() {
  return (
    <Section
      id="research"
      eyebrow="Research"
      title="Interests & projects."
      description="Applied research in renewable energy, photovoltaics, and power electronics."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card rounded-2xl p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Research interests
            </h3>
          </div>
          <ul className="space-y-3">
            {research.interests.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{i}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">
              Research Assistantship
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {research.assistantship.role}
            </p>
            <p className="text-sm text-muted-foreground">
              Supervisor: {research.assistantship.supervisor}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {research.assistantship.responsibilities}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {research.projects.map((p) => (
            <article key={p.title} className="surface-card rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gradient-brand">
                {p.period}
              </p>
              <h4 className="mt-1.5 font-display text-lg font-bold text-foreground">
                {p.title}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">{p.funder}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Publications() {
  return (
    <Section
      id="publications"
      eyebrow="Publications"
      title="Peer-reviewed work."
      description="Journal publications on renewable energy, photovoltaics, and sustainable engineering."
    >
      <ul className="space-y-3">
        {publications.map((p) => (
          <li key={p.doi}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card group block rounded-2xl p-6 transition hover:border-brand/40"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{p.venue}</span> · {p.date}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gradient-brand">
                    DOI: {p.doi}
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work."
      description="Engineering and research projects spanning smart metering, photovoltaics, and power electronics."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className="surface-card group relative overflow-hidden rounded-2xl p-6 sm:p-7"
          >
            <div
              aria-hidden
              className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-brand opacity-0 blur-3xl transition group-hover:opacity-30"
            />
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
              {p.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {p.summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Awards() {
  return (
    <Section
      id="awards"
      eyebrow="Awards"
      title="Recognition."
      description="National innovation challenges and fellowships won across renewable energy and entrepreneurship."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((a) => (
          <article key={a.title} className="surface-card rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
              <Award className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-foreground">
              {a.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.org}</p>
            <p className="mt-3 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-gradient-brand">
              {a.prize}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Organizations() {
  return (
    <Section
      id="organizations"
      eyebrow="Organizations"
      title="Leadership & community."
      description="Roles in youth-development, welfare, and policy organizations."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((o) => (
          <article key={o.role + o.org} className="surface-card rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-foreground">
              {o.role}
            </h3>
            <p className="mt-1 text-sm font-medium text-foreground">{o.org}</p>
            <p className="text-sm text-muted-foreground">{o.location}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something together."
      description="Open to research collaborations, consultancy, career guidance conversations, and engineering partnerships."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-card relative overflow-hidden rounded-3xl p-8 sm:p-10">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-brand opacity-25 blur-3xl"
          />
          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Book an appointment
          </h3>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Schedule a 1:1 to discuss research, consultancy, career guidance, collaboration,
            or anything else. Pick a slot that works for you — you'll receive a confirmation
            and a Google Meet link.
          </p>
          <button
            type="button"
            disabled
            title="Booking flow goes live in the next build phase"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-xl shadow-brand/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CalendarCheck className="h-4 w-4" />
            Book a meeting
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Booking system activates in the next deployment phase.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-accent"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-accent"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={`mailto:${profile.email}`}
            className="surface-card group flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand/40"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
              <Mail className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p className="truncate text-sm font-semibold text-foreground">{profile.email}</p>
            </div>
          </a>
          <a
            href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
            className="surface-card group flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand/40"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
              <Phone className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone
              </p>
              <p className="text-sm font-semibold text-foreground">{profile.phone}</p>
            </div>
          </a>
          <div className="surface-card flex items-center gap-4 rounded-2xl p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </p>
              <p className="text-sm font-semibold text-foreground">{profile.location}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with care · {profile.location}
        </p>
      </div>
    </footer>
  );
}
