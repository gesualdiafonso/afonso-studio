import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * SELECTED WORK — section texts and labels (Section 04).
 * The projects themselves live in src/content/projects/projects.json.
 */
export interface WorkContent {
  eyebrow: string;
  title: { text: string; emphasis?: boolean }[];
  intro: string;
  labels: {
    challenge: string;
    solution: string;
    engineering: string;
    technologies: string;
    approach: string;
    scope: string;
    outcomes: string;
    client: string;
    confidential: string;
    year: string;
    industry: string;
    viewCaseStudy: string;
    close: string;
    visitLive: string;
    externalCaseStudy: string;
    sample: string;
    caseStudy: string;
    of: string;
  };
}

const en: WorkContent = {
  eyebrow: "Selected work",
  title: [{ text: "From the problem" }, { text: "to production.", emphasis: true }],
  intro:
    "A selection of platforms, systems and products — each one starting from a real business problem and engineered to keep working.",
  labels: {
    challenge: "Challenge",
    solution: "Solution",
    engineering: "Engineering",
    technologies: "Technologies",
    approach: "How we approached it",
    scope: "Our scope",
    outcomes: "Outcomes",
    client: "Client",
    confidential: "Confidential client",
    year: "Year",
    industry: "Industry",
    viewCaseStudy: "View case study",
    close: "Close case study",
    visitLive: "Visit live product",
    externalCaseStudy: "Read the full write-up",
    sample: "Sample project",
    caseStudy: "Case study",
    of: "of",
  },
};

const ptBR: WorkContent = {
  eyebrow: "Projetos selecionados",
  title: [{ text: "Do problema" }, { text: "à produção.", emphasis: true }],
  intro:
    "Uma seleção de plataformas, sistemas e produtos — cada um partindo de um problema real do negócio e construído para continuar funcionando.",
  labels: {
    challenge: "Desafio",
    solution: "Solução",
    engineering: "Engenharia",
    technologies: "Tecnologias",
    approach: "Como conduzimos",
    scope: "Nosso escopo",
    outcomes: "Resultados",
    client: "Cliente",
    confidential: "Cliente confidencial",
    year: "Ano",
    industry: "Setor",
    viewCaseStudy: "Ver estudo de caso",
    close: "Fechar estudo de caso",
    visitLive: "Ver produto no ar",
    externalCaseStudy: "Ler o material completo",
    sample: "Projeto de exemplo",
    caseStudy: "Estudo de caso",
    of: "de",
  },
};

const es: WorkContent = {
  eyebrow: "Proyectos seleccionados",
  title: [{ text: "Del problema" }, { text: "a producción.", emphasis: true }],
  intro:
    "Una selección de plataformas, sistemas y productos: cada uno parte de un problema real del negocio y está construido para seguir funcionando.",
  labels: {
    challenge: "Desafío",
    solution: "Solución",
    engineering: "Ingeniería",
    technologies: "Tecnologías",
    approach: "Cómo lo abordamos",
    scope: "Nuestro alcance",
    outcomes: "Resultados",
    client: "Cliente",
    confidential: "Cliente confidencial",
    year: "Año",
    industry: "Sector",
    viewCaseStudy: "Ver caso de estudio",
    close: "Cerrar caso de estudio",
    visitLive: "Ver producto en línea",
    externalCaseStudy: "Leer el material completo",
    sample: "Proyecto de ejemplo",
    caseStudy: "Caso de estudio",
    of: "de",
  },
};

export const workContent: Record<Locale, WorkContent> = { en, "pt-BR": ptBR, es };

export function getWorkContent(locale: Locale = defaultLocale): WorkContent {
  return workContent[locale];
}
