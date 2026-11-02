import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * TECHNOLOGY CONTENT — every piece of text in Section 07.
 *
 * ⚠️ Only list technologies the team genuinely works with.
 * No proficiency levels, percentages or "years of experience" — the stack is
 * shown as an honest map, not a scoreboard.
 *
 * Technology names are product names: they are the same in every language,
 * so they live once in `stack` below. Only the category texts are translated.
 * `symbol` = the 2-character tile mark (an original typographic mark, never a
 * brand logo).
 */

export type TechCategoryId =
  | "frontend"
  | "backend"
  | "databases"
  | "infrastructure"
  | "automation"
  | "design";

export type TechTone = "blue" | "cyan" | "mint";

export interface TechItem {
  name: string;
  symbol: string;
}

export interface TechCategoryStack {
  id: TechCategoryId;
  tone: TechTone;
  items: TechItem[];
}

/** EDIT HERE — the real stack, per category, in display order. */
export const stack: TechCategoryStack[] = [
  {
    id: "frontend",
    tone: "cyan",
    items: [
      { name: "React", symbol: "Re" },
      { name: "Next.js", symbol: "Nx" },
      { name: "Vue", symbol: "Vu" },
      { name: "Angular", symbol: "Ng" },
      { name: "JavaScript", symbol: "Js" },
      { name: "TypeScript", symbol: "Ts" },
      { name: "HTML", symbol: "Ht" },
      { name: "CSS", symbol: "Cs" },
    ],
  },
  {
    id: "backend",
    tone: "blue",
    items: [
      { name: "Node.js", symbol: "No" },
      { name: "Python", symbol: "Py" },
      { name: "Django", symbol: "Dj" },
      { name: "Flask", symbol: "Fl" },
      { name: ".NET", symbol: "Nt" },
      { name: "C#", symbol: "C#" },
      { name: "Laravel", symbol: "Lv" },
    ],
  },
  {
    id: "databases",
    tone: "mint",
    items: [
      { name: "PostgreSQL", symbol: "Pg" },
      { name: "Supabase", symbol: "Sb" },
      { name: "SQL Server", symbol: "Ss" },
    ],
  },
  {
    id: "infrastructure",
    tone: "cyan",
    items: [
      { name: "Linux", symbol: "Lx" },
      { name: "Windows Server", symbol: "Ws" },
      { name: "Azure", symbol: "Az" },
      { name: "Git", symbol: "Gt" },
      { name: "Docker", symbol: "Dk" },
      { name: "CI/CD", symbol: "Ci" },
    ],
  },
  {
    id: "automation",
    tone: "mint",
    items: [
      { name: "Python", symbol: "Py" },
      { name: "PowerShell", symbol: "Ps" },
      { name: "Bash", symbol: "Sh" },
      { name: "n8n", symbol: "n8" },
      { name: "APIs", symbol: "Ap" },
    ],
  },
  {
    id: "design",
    tone: "blue",
    items: [
      { name: "Figma", symbol: "Fg" },
      { name: "Adobe Creative Cloud", symbol: "Cc" },
      { name: "UX/UI", symbol: "Ux" },
    ],
  },
];

export interface TechCategoryText {
  title: string;
  /** One line: what this group is used for. */
  description: string;
}

export interface TechnologyContent {
  eyebrow: string;
  title: { text: string; emphasis?: boolean }[];
  intro: string;
  hub: { label: string; title: string };
  /** The honesty note shown in the grid's eighth cell. */
  principle: { title: string; text: string };
  labels: { technologies: string; alsoIn: string };
  categories: Record<TechCategoryId, TechCategoryText>;
}

const en: TechnologyContent = {
  eyebrow: "Technology & capabilities",
  title: [{ text: "The right tools," }, { text: "connected by engineering.", emphasis: true }],
  intro:
    "The stack we actually work with — grouped by what it does for your project. We choose it for each problem, not for the trend.",
  hub: { label: "Ecosystem", title: "One connected stack" },
  principle: {
    title: "Chosen per project",
    text: "No proficiency bars or percentages here: just the tools we use in real deliveries, combined to fit each challenge.",
  },
  labels: { technologies: "technologies", alsoIn: "Also used in" },
  categories: {
    frontend: { title: "Frontend", description: "Interfaces, websites and web applications." },
    backend: { title: "Backend", description: "APIs, business rules and services." },
    databases: { title: "Databases", description: "Reliable, structured data." },
    infrastructure: { title: "Infrastructure", description: "Servers, cloud, versioning and delivery pipelines." },
    automation: { title: "Automation", description: "Scripts, workflows and integrations between systems." },
    design: { title: "Design", description: "Research, interfaces and visual identity." },
  },
};

const ptBR: TechnologyContent = {
  eyebrow: "Tecnologia & capacidades",
  title: [{ text: "As ferramentas certas," }, { text: "conectadas pela engenharia.", emphasis: true }],
  intro:
    "A stack com que realmente trabalhamos — agrupada pelo que ela faz no seu projeto. Escolhemos pelo problema, não pela moda.",
  hub: { label: "Ecossistema", title: "Uma stack conectada" },
  principle: {
    title: "Escolhida por projeto",
    text: "Sem barras de nível ou porcentagens: apenas as ferramentas que usamos em entregas reais, combinadas para cada desafio.",
  },
  labels: { technologies: "tecnologias", alsoIn: "Também usado em" },
  categories: {
    frontend: { title: "Frontend", description: "Interfaces, sites e aplicações web." },
    backend: { title: "Backend", description: "APIs, regras de negócio e serviços." },
    databases: { title: "Bancos de dados", description: "Dados confiáveis e estruturados." },
    infrastructure: { title: "Infraestrutura", description: "Servidores, nuvem, versionamento e pipelines de entrega." },
    automation: { title: "Automação", description: "Scripts, fluxos e integrações entre sistemas." },
    design: { title: "Design", description: "Pesquisa, interfaces e identidade visual." },
  },
};

const es: TechnologyContent = {
  eyebrow: "Tecnología y capacidades",
  title: [{ text: "Las herramientas correctas," }, { text: "conectadas por la ingeniería.", emphasis: true }],
  intro:
    "El stack con el que realmente trabajamos, agrupado por lo que hace en tu proyecto. Lo elegimos por el problema, no por la moda.",
  hub: { label: "Ecosistema", title: "Un stack conectado" },
  principle: {
    title: "Elegido por proyecto",
    text: "Sin barras de nivel ni porcentajes: solo las herramientas que usamos en entregas reales, combinadas para cada desafío.",
  },
  labels: { technologies: "tecnologías", alsoIn: "También usado en" },
  categories: {
    frontend: { title: "Frontend", description: "Interfaces, sitios y aplicaciones web." },
    backend: { title: "Backend", description: "APIs, reglas de negocio y servicios." },
    databases: { title: "Bases de datos", description: "Datos confiables y estructurados." },
    infrastructure: { title: "Infraestructura", description: "Servidores, nube, versionado y pipelines de entrega." },
    automation: { title: "Automatización", description: "Scripts, flujos e integraciones entre sistemas." },
    design: { title: "Diseño", description: "Investigación, interfaces e identidad visual." },
  },
};

export const technologyContent: Record<Locale, TechnologyContent> = { en, "pt-BR": ptBR, es };

export function getTechnologyContent(locale: Locale = defaultLocale): TechnologyContent {
  return technologyContent[locale];
}
