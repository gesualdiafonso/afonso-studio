import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * SERVICES CONTENT — every piece of text in Section 03 lives here.
 *
 * `module` links each service to one of the four frame modules of the
 * A-CORE (ids from frameSegments in symbol-geometry.ts). When a service is
 * active, that module glows and separates in 3D, and the card's module map
 * highlights the same piece.
 */

export type ServiceModule = "top-left" | "top-right" | "bottom-right" | "bottom-left";

export interface Service {
  id: string;
  title: string;
  /** One-line summary, always visible. */
  summary: string;
  /** Revealed when the card expands. */
  capabilities: string[];
  module: ServiceModule;
}

export interface ServicesContent {
  eyebrow: string;
  title: { text: string; emphasis?: boolean }[];
  intro: string;
  capabilitiesLabel: string;
  moduleLabel: string;
  /** Names of the four A-CORE modules, in service order (legend). */
  visualCaption: string;
  services: [Service, Service, Service, Service];
}

const en: ServicesContent = {
  eyebrow: "What we engineer",
  title: [{ text: "Four disciplines." }, { text: "One engineering system.", emphasis: true }],
  intro:
    "Each discipline is a module of the same core. Together they turn complex business needs into reliable digital systems.",
  capabilitiesLabel: "Capabilities",
  moduleLabel: "A-CORE module",
  visualCaption: "A-CORE · modular state",
  services: [
    {
      id: "software-engineering",
      title: "Software Engineering",
      summary: "Software built around how your business actually operates.",
      capabilities: ["Custom applications", "Enterprise software", "SaaS platforms", "Web applications", "API integrations"],
      module: "top-left",
    },
    {
      id: "business-automation",
      title: "Business Automation",
      summary: "Less manual work, fewer hand-offs and clearer operations.",
      capabilities: ["Workflow automation", "Business process optimization", "System integrations", "Operational efficiency"],
      module: "top-right",
    },
    {
      id: "digital-products",
      title: "Digital Products",
      summary: "Interfaces and platforms people find clear and useful.",
      capabilities: ["UX/UI design", "Dashboards", "Customer portals", "Digital platforms", "Product development"],
      module: "bottom-right",
    },
    {
      id: "systems-infrastructure",
      title: "Systems & Infrastructure",
      summary: "Secure, scalable foundations for everything you run.",
      capabilities: ["Cloud architecture", "IT infrastructure", "Identity management", "Security", "Scalable systems"],
      module: "bottom-left",
    },
  ],
};

const ptBR: ServicesContent = {
  eyebrow: "O que construímos",
  title: [{ text: "Quatro disciplinas." }, { text: "Um único sistema de engenharia.", emphasis: true }],
  intro:
    "Cada disciplina é um módulo do mesmo núcleo. Juntas, transformam necessidades complexas do negócio em sistemas digitais confiáveis.",
  capabilitiesLabel: "Competências",
  moduleLabel: "Módulo do A-CORE",
  visualCaption: "A-CORE · estado modular",
  services: [
    {
      id: "software-engineering",
      title: "Engenharia de Software",
      summary: "Software construído em torno de como o seu negócio realmente opera.",
      capabilities: ["Aplicações sob medida", "Software corporativo", "Plataformas SaaS", "Aplicações web", "Integrações via API"],
      module: "top-left",
    },
    {
      id: "business-automation",
      title: "Automação de Negócios",
      summary: "Menos trabalho manual, menos repasses e operações mais claras.",
      capabilities: ["Automação de fluxos de trabalho", "Otimização de processos", "Integração de sistemas", "Eficiência operacional"],
      module: "top-right",
    },
    {
      id: "digital-products",
      title: "Produtos Digitais",
      summary: "Interfaces e plataformas claras e úteis para quem usa.",
      capabilities: ["Design de UX/UI", "Dashboards", "Portais do cliente", "Plataformas digitais", "Desenvolvimento de produto"],
      module: "bottom-right",
    },
    {
      id: "systems-infrastructure",
      title: "Sistemas & Infraestrutura",
      summary: "Bases seguras e escaláveis para tudo o que você opera.",
      capabilities: ["Arquitetura em nuvem", "Infraestrutura de TI", "Gestão de identidades", "Segurança", "Sistemas escaláveis"],
      module: "bottom-left",
    },
  ],
};

const es: ServicesContent = {
  eyebrow: "Lo que construimos",
  title: [{ text: "Cuatro disciplinas." }, { text: "Un solo sistema de ingeniería.", emphasis: true }],
  intro:
    "Cada disciplina es un módulo del mismo núcleo. Juntas convierten necesidades complejas del negocio en sistemas digitales confiables.",
  capabilitiesLabel: "Capacidades",
  moduleLabel: "Módulo del A-CORE",
  visualCaption: "A-CORE · estado modular",
  services: [
    {
      id: "software-engineering",
      title: "Ingeniería de Software",
      summary: "Software construido en torno a cómo opera realmente tu negocio.",
      capabilities: ["Aplicaciones a medida", "Software empresarial", "Plataformas SaaS", "Aplicaciones web", "Integraciones por API"],
      module: "top-left",
    },
    {
      id: "business-automation",
      title: "Automatización de Negocios",
      summary: "Menos trabajo manual, menos traspasos y operaciones más claras.",
      capabilities: ["Automatización de flujos de trabajo", "Optimización de procesos", "Integración de sistemas", "Eficiencia operativa"],
      module: "top-right",
    },
    {
      id: "digital-products",
      title: "Productos Digitales",
      summary: "Interfaces y plataformas claras y útiles para quien las usa.",
      capabilities: ["Diseño UX/UI", "Dashboards", "Portales de clientes", "Plataformas digitales", "Desarrollo de producto"],
      module: "bottom-right",
    },
    {
      id: "systems-infrastructure",
      title: "Sistemas e Infraestructura",
      summary: "Bases seguras y escalables para todo lo que operas.",
      capabilities: ["Arquitectura en la nube", "Infraestructura de TI", "Gestión de identidades", "Seguridad", "Sistemas escalables"],
      module: "bottom-left",
    },
  ],
};

export const servicesContent: Record<Locale, ServicesContent> = { en, "pt-BR": ptBR, es };

export function getServicesContent(locale: Locale = defaultLocale): ServicesContent {
  return servicesContent[locale];
}
