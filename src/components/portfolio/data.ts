// Single source of truth for portfolio content (will be moved to a CMS
// in Phase 2 — admin dashboard).

export const profile = {
  name: "Abdullah Al Mamun",
  initials: "AM",
  roles: ["Technical Support Engineer", "Researcher in Renewable Energy"],
  tagline:
    "B.Sc. EEE engineer building reliable smart-metering systems, advancing photovoltaic research, and turning ideas into award-winning ventures.",
  location: "Rajbari – 7700, Bangladesh",
  email: "abdullah.br2311@gmail.com",
  phone: "(+880) 1730-601834",
  status: "Available for collaborations",
  social: {
    linkedin: "https://www.linkedin.com/",
    orcid: "https://orcid.org/",
    github: "https://github.com/",
  },
};

export const about = {
  paragraphs: [
    "I'm an Electrical & Electronic Engineering graduate working at the intersection of smart-metering systems, photovoltaic research, and renewable energy integration. My day-to-day spans technical support for AMI deployments across global markets and applied research on solar-cell materials and multilevel inverters.",
    "Alongside engineering, I co-founded ventures and youth-development initiatives — winning national innovation awards and building teams that ship real outcomes. I care about reliable systems, clean energy, and turning research into impact.",
  ],
  highlights: [
    { label: "Years of research", value: "2+" },
    { label: "Peer-reviewed papers", value: "3" },
    { label: "Innovation awards", value: "3" },
    { label: "Countries served (AMI)", value: "80+" },
  ],
};

export const education = [
  {
    period: "2025",
    degree: "B.Sc. Engg. in Electrical & Electronic Engineering",
    institution: "Gopalganj Science and Technology University",
    location: "Gopalganj – 8100, Bangladesh",
    details:
      "CGPA: 3.37 / 4.00 — Last two years: 3.81 / 4.00. Focus on power electronics, photovoltaics, and renewable energy systems.",
  },
];

export const experience = [
  {
    period: "Apr 2026 – Present",
    title: "Technical Support Engineer",
    company: "Inhemeter (Inhe Co., Ltd.)",
    description:
      "Global provider of smart metering, AMI, and smart energy solutions operating across 80+ countries. Oversee technical support, system reliability, and project delivery; coordinate documentation, monitoring, and training.",
  },
  {
    period: "Jun 2025 – Feb 2026",
    title: "Assistant Engineer",
    company: "Eresi BD Ltd. (affiliated with Eresi Solar APS, Denmark)",
    description:
      "Solar PV system design, installation, and testing. Supported performance analysis and field troubleshooting for renewable energy deployments.",
  },
  {
    period: "Feb 2024 – May 2025",
    title: "Development & Research Consultant",
    company: "NBER, Dhaka",
    description:
      "Data analysis, reporting, database management, and project feasibility support for economic research and policy analysis.",
  },
  {
    period: "Aug 2020 – Sep 2021",
    title: "Co-Founder & Executive Director",
    company: "N Trims, Dhaka",
    description:
      "Garment trimming company specializing in custom designs. Led design/artwork analysis and overall project execution.",
  },
];

export const skills = [
  {
    group: "Simulation & Analysis",
    items: ["MATLAB", "Simulink", "Proteus", "SCAPS 1D", "SPSS", "PSAF", "Lumerical"],
  },
  {
    group: "Design & Visualization",
    items: ["Adobe Illustrator", "Photoshop", "Figma"],
  },
  {
    group: "Programming & Web",
    items: ["HTML", "CSS", "JavaScript", "Bootstrap"],
  },
  {
    group: "Productivity & Research",
    items: ["LaTeX", "Zotero", "GitHub", "MS Office"],
  },
  {
    group: "Languages",
    items: ["Bengali (Native)", "English (IELTS 7)", "Arabic"],
  },
];

export const research = {
  interests: [
    "Solar cell materials & photovoltaic systems",
    "Renewable energy integration",
    "Power electronics & multilevel inverters",
    "Image processing for energy applications",
  ],
  assistantship: {
    role: "Research Assistant, Department of EEE — GSTU (2 years)",
    supervisor: "Dr. A.T.M. Saiful Islam",
    responsibilities:
      "Proposal development, experimental design, data analysis, and implementation in renewable energy and image processing.",
  },
  projects: [
    {
      title: "Renewable energy-based eco-friendly transportation system",
      funder: "GSTU funded project",
      period: "2021 – 2022",
    },
    {
      title: "Enhancement of efficiency of multilevel inverter systems",
      funder: "GSTU funded project",
      period: "2023 – 2024",
    },
  ],
};

export const publications = [
  {
    title:
      "Benefits of dietary diversity for energy conservation and food security",
    venue: "International Journal of Energy Studies",
    date: "Mar 2026",
    doi: "10.58559/ijes.1783054",
    url: "https://doi.org/10.58559/ijes.1783054",
  },
  {
    title:
      "HTL-free CuBi₂O₄ solar cells with 36% efficiency",
    venue: "International Journal of Energetica",
    date: "Dec 2024",
    doi: "10.47238/ijeca.v9i2.254",
    url: "https://doi.org/10.47238/ijeca.v9i2.254",
  },
  {
    title: "Green automobile vehicle design",
    venue: "International Journal of Electrical Engineering and Applied Sciences",
    date: "Oct 2023",
    doi: "10.54554/ijeeas.2023.6.02.005",
    url: "https://doi.org/10.54554/ijeeas.2023.6.02.005",
  },
];

export const projects = [
  {
    title: "Smart-Metering & AMI Reliability Toolkit",
    summary:
      "Documentation, monitoring dashboards, and training materials supporting AMI deployments across 80+ countries.",
    tags: ["Smart Metering", "AMI", "Reliability"],
  },
  {
    title: "HTL-free CuBi₂O₄ Photovoltaic Device",
    summary:
      "SCAPS-1D simulation and optimization of a hole-transport-layer-free copper bismuthate solar cell achieving 36% theoretical efficiency.",
    tags: ["SCAPS-1D", "Photovoltaics", "Materials"],
  },
  {
    title: "Multilevel Inverter Efficiency Enhancement",
    summary:
      "GSTU-funded research on switching topologies and modulation strategies to reduce THD and boost conversion efficiency.",
    tags: ["Power Electronics", "MATLAB/Simulink"],
  },
  {
    title: "Renewable-energy-based EV System",
    summary:
      "Concept and prototype of an eco-friendly transportation system integrating solar charging with lightweight EV design.",
    tags: ["Renewable Energy", "EV", "Prototype"],
  },
];

export const awards = [
  {
    title: "Youth Innovation Challenge — Winner",
    org: "Youth Startup Summit 2025",
    prize: "BDT 300,000",
  },
  {
    title: "PRAAN Fellowship — Energy Innovation Challenge Winner",
    org: "PRAAN, 2024",
    prize: "BDT 50,000",
  },
  {
    title: "UIHP Innovation Cohort — Runner-up",
    org: "BSMRSTU IC1, 2024",
    prize: "BDT 50,000",
  },
];

export const organizations = [
  {
    role: "Co-Founder & General Secretary",
    org: "Future Flare Foundation",
    location: "Dhaka & Georgia",
  },
  {
    role: "Organizational Secretary",
    org: "Inspirations for Human Welfare, GSTU Branch",
    location: "2021 – 2022",
  },
  {
    role: "Delegate Affairs Coordinator",
    org: "SDG Youth Summit 2022",
    location: "Bangladesh",
  },
];

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];
