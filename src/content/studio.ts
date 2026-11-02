import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * STUDIO CONTENT — every piece of text in Section 08.
 * `statement` is split into words for the progressive reveal; words listed
 * in `statementEmphasis` are set in brand blue.
 */

export type StudioValueIcon = "purpose" | "intention" | "scalability" | "trust";

export interface StudioValue {
  id: string;
  title: string;
  text: string;
  icon: StudioValueIcon;
}

export interface StudioContent {
  eyebrow: string;
  /** Small label above the statement. */
  kicker: string;
  statement: string;
  statementEmphasis: string[];
  positioning: { title: string; text: string };
  /** The four disciplines that add up to the partner. */
  disciplines: [string, string, string, string];
  equals: string;
  valuesTitle: string;
  values: [StudioValue, StudioValue, StudioValue, StudioValue];
  next: { label: string; text: string; cta: string };
}

const en: StudioContent = {
  eyebrow: "The studio",
  kicker: "What we believe",
  statement:
    "We believe technology should simplify complexity, improve operations and create opportunities for growth.",
  statementEmphasis: ["simplify", "complexity,", "growth."],
  positioning: {
    title: "A technology partner, not just a supplier.",
    text: "We combine software engineering, systems thinking, design and business understanding — so what we build fits how your company really works, and keeps working as it grows.",
  },
  disciplines: ["Software engineering", "Systems thinking", "Design", "Business understanding"],
  equals: "Your technology partner",
  valuesTitle: "Our values",
  values: [
    {
      id: "purpose",
      title: "Engineering with purpose",
      text: "Every line of code answers a business need. If it doesn't solve something, we don't build it.",
      icon: "purpose",
    },
    {
      id: "intention",
      title: "Design with intention",
      text: "Interfaces shaped around the people who use them every day — clear, fast and accessible.",
      icon: "intention",
    },
    {
      id: "scalability",
      title: "Architecture for scalability",
      text: "Foundations planned to grow with your operation, not to be rebuilt in two years.",
      icon: "scalability",
    },
    {
      id: "trust",
      title: "Partnerships built on trust",
      text: "Transparent estimates, honest conversations and a team that stays after go-live.",
      icon: "trust",
    },
  ],
  next: { label: "Next", text: "Ready to build something that lasts?", cta: "Start a conversation" },
};

const ptBR: StudioContent = {
  eyebrow: "O estúdio",
  kicker: "No que acreditamos",
  statement:
    "Acreditamos que a tecnologia deve simplificar a complexidade, melhorar as operações e criar oportunidades de crescimento.",
  statementEmphasis: ["simplificar", "complexidade,", "crescimento."],
  positioning: {
    title: "Um parceiro de tecnologia, não apenas um fornecedor.",
    text: "Unimos engenharia de software, pensamento sistêmico, design e entendimento do negócio — para que o que construímos se encaixe em como a sua empresa realmente funciona, e continue funcionando enquanto ela cresce.",
  },
  disciplines: ["Engenharia de software", "Pensamento sistêmico", "Design", "Entendimento do negócio"],
  equals: "Seu parceiro de tecnologia",
  valuesTitle: "Nossos valores",
  values: [
    {
      id: "purpose",
      title: "Engenharia com propósito",
      text: "Cada linha de código responde a uma necessidade do negócio. Se não resolve algo, não construímos.",
      icon: "purpose",
    },
    {
      id: "intention",
      title: "Design com intenção",
      text: "Interfaces pensadas para quem as usa todos os dias — claras, rápidas e acessíveis.",
      icon: "intention",
    },
    {
      id: "scalability",
      title: "Arquitetura para escalar",
      text: "Bases planejadas para crescer com a sua operação, e não para serem refeitas em dois anos.",
      icon: "scalability",
    },
    {
      id: "trust",
      title: "Parcerias baseadas em confiança",
      text: "Estimativas transparentes, conversas honestas e uma equipe que continua depois do lançamento.",
      icon: "trust",
    },
  ],
  next: { label: "A seguir", text: "Pronto para construir algo que dure?", cta: "Iniciar uma conversa" },
};

const es: StudioContent = {
  eyebrow: "El estudio",
  kicker: "En lo que creemos",
  statement:
    "Creemos que la tecnología debe simplificar la complejidad, mejorar las operaciones y crear oportunidades de crecimiento.",
  statementEmphasis: ["simplificar", "complejidad,", "crecimiento."],
  positioning: {
    title: "Un socio tecnológico, no solo un proveedor.",
    text: "Unimos ingeniería de software, pensamiento sistémico, diseño y comprensión del negocio, para que lo que construimos encaje con cómo funciona realmente tu empresa y siga funcionando mientras crece.",
  },
  disciplines: ["Ingeniería de software", "Pensamiento sistémico", "Diseño", "Comprensión del negocio"],
  equals: "Tu socio tecnológico",
  valuesTitle: "Nuestros valores",
  values: [
    {
      id: "purpose",
      title: "Ingeniería con propósito",
      text: "Cada línea de código responde a una necesidad del negocio. Si no resuelve algo, no lo construimos.",
      icon: "purpose",
    },
    {
      id: "intention",
      title: "Diseño con intención",
      text: "Interfaces pensadas para quienes las usan todos los días: claras, rápidas y accesibles.",
      icon: "intention",
    },
    {
      id: "scalability",
      title: "Arquitectura para escalar",
      text: "Bases planificadas para crecer con tu operación, no para rehacerse en dos años.",
      icon: "scalability",
    },
    {
      id: "trust",
      title: "Alianzas basadas en confianza",
      text: "Estimaciones transparentes, conversaciones honestas y un equipo que sigue después del lanzamiento.",
      icon: "trust",
    },
  ],
  next: { label: "A continuación", text: "¿Listo para construir algo que perdure?", cta: "Iniciar una conversación" },
};

export const studioContent: Record<Locale, StudioContent> = { en, "pt-BR": ptBR, es };

export function getStudioContent(locale: Locale = defaultLocale): StudioContent {
  return studioContent[locale];
}
