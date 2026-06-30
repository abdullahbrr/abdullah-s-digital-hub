import { Mail, ArrowRight, MapPin, Phone, Sparkles, CalendarCheck } from "lucide-react";
import portraitAsset from "@/assets/mamun-portrait.png.asset.json";
import { profile } from "./data";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      <div aria-hidden className="hero-glow absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            {profile.status}
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Abdullah Al{" "}
            <span className="text-gradient-brand">Mamun</span>
          </h1>

          <p className="mt-5 text-lg font-semibold text-gradient-brand">
            {profile.roles.join(" · ")}
          </p>

          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-xl shadow-brand/25 transition hover:opacity-95"
            >
              <CalendarCheck className="h-4 w-4" />
              Book an appointment
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-accent"
            >
              <Mail className="h-4 w-4" /> Get in touch
            </a>
            <a
              href="#experience"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              View experience <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              <span>{profile.location}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand" />
              <span>{profile.phone}</span>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-brand opacity-30 blur-3xl" />
          <div className="ring-glow animate-float overflow-hidden rounded-3xl border border-border bg-surface-elevated">
            <img
              src={portraitAsset.url}
              alt="Portrait of Abdullah Al Mamun"
              width={900}
              height={1125}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
