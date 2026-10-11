import { Code, Smartphone, Globe, Database, Cloud, Shield, LucideIcon } from "lucide-react";

export interface ServiceInfo {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  overview: string;
  features: string[];
  process: { title: string; text: string }[];
  technologies: string[];
}

const standardProcess = (what: string) => [
  { title: "Discover", text: `We learn about your business goals and what you need from ${what}.` },
  { title: "Plan & Design", text: "We agree scope, timeline and design before any code is written." },
  { title: "Build & Test", text: "We build in short cycles, show progress often and test thoroughly." },
  { title: "Launch & Support", text: "We deploy, train your team and stay on for maintenance." },
];

export const services: ServiceInfo[] = [
  {
    slug: "software-development",
    icon: Code,
    title: "Software Development",
    description:
      "Custom software solutions tailored to your business needs with modern technologies and best practices.",
    overview:
      "We design and build custom software that fits the way your business really works: internal tools, CRMs, ERPs, automation and full products, built to be reliable and easy to grow.",
    features: [
      "Custom business applications and internal tools",
      "CRM, ERP and workflow automation",
      "API design and third-party integrations",
      "Legacy system modernisation",
      "Automated testing and clean, documented code",
    ],
    process: standardProcess("custom software"),
    technologies: ["React", "Node.js", "Python", "TypeScript", "PostgreSQL"],
  },
  {
    slug: "web-development",
    icon: Globe,
    title: "Web Development",
    description:
      "Responsive, fast, and SEO-optimized websites that deliver exceptional user experiences.",
    overview:
      "From business websites to complex web apps, we build fast, secure and search-friendly sites that look right on every device.",
    features: [
      "Responsive business and company websites",
      "E-commerce and booking platforms",
      "Web apps with login, dashboards and payments",
      "SEO, speed and accessibility optimisation",
      "Content management so you can update the site yourself",
    ],
    process: standardProcess("your website"),
    technologies: ["React", "Next.js", "Tailwind CSS", "Supabase", "Vercel"],
  },
  {
    slug: "mobile-app-development",
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android platforms.",
    overview:
      "We build mobile apps for Android and iOS that are smooth to use, connect to your systems and are ready for the app stores.",
    features: [
      "Android and iOS apps from a single codebase",
      "Push notifications, maps, payments and offline mode",
      "Backend and API development",
      "App store publishing and updates",
      "UI/UX design for small screens",
    ],
    process: standardProcess("your mobile app"),
    technologies: ["React Native", "Flutter", "Firebase", "Supabase", "REST / GraphQL"],
  },
  {
    slug: "data-analytics",
    icon: Database,
    title: "Data & Analytics",
    description:
      "Transform raw data into actionable insights with our analytics solutions.",
    overview:
      "We turn scattered data into clear dashboards and reports so you can see what is working and decide faster.",
    features: [
      "Dashboards and KPI reporting",
      "Data cleaning and pipelines",
      "Database design and optimisation",
      "Sales, operations and customer analytics",
      "Automated scheduled reports",
    ],
    process: standardProcess("data and analytics"),
    technologies: ["PostgreSQL", "Python", "Power BI", "SQL", "Charts & dashboards"],
  },
  {
    slug: "cloud-solutions",
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure and migration services for modern businesses.",
    overview:
      "We help you move to the cloud and run there reliably: hosting, deployment, backups and cost control.",
    features: [
      "Cloud hosting setup and migration",
      "Automated deployment (CI/CD)",
      "Backups, monitoring and uptime alerts",
      "Cost optimisation",
      "Secure environments and access control",
    ],
    process: standardProcess("cloud services"),
    technologies: ["AWS", "Vercel", "Supabase", "Docker", "GitHub Actions"],
  },
  {
    slug: "it-consulting",
    icon: Shield,
    title: "IT Consulting",
    description:
      "Strategic technology consulting to help you make informed decisions.",
    overview:
      "Not sure which technology to pick, or how to fix what you have? We give clear, independent advice and a practical plan.",
    features: [
      "Technology and vendor selection",
      "Architecture and code reviews",
      "Security and risk assessment",
      "Digital transformation roadmaps",
      "Team training and mentoring",
    ],
    process: standardProcess("IT consulting"),
    technologies: ["Architecture review", "Security audit", "Roadmapping", "Project management"],
  },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
