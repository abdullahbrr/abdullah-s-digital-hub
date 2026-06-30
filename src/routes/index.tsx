import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import {
  About,
  Awards,
  Contact,
  Education,
  Experience,
  Footer,
  Organizations,
  Projects,
  Publications,
  Research,
  Skills,
} from "@/components/portfolio/Sections";

const SITE_TITLE =
  "Abdullah Al Mamun — Technical Support Engineer & Renewable-Energy Researcher";
const SITE_DESC =
  "Portfolio of Abdullah Al Mamun: B.Sc. EEE engineer building smart-metering systems, advancing photovoltaic research, and shipping award-winning ventures from Bangladesh.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { name: "keywords", content: "Abdullah Al Mamun, EEE engineer, renewable energy researcher, smart metering, photovoltaic research, Bangladesh, technical support engineer" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Research />
        <Publications />
        <Projects />
        <Awards />
        <Organizations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
