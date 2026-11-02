import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * PHILOSOPHY CONTENT — every piece of text in Section 02 lives here.
 *
 * Headline: a flat list of words. `emphasis: true` turns the word brand blue
 * as it is revealed on scroll (large display text — passes AA-large).
 */

export interface PhilosophyWord {
  text: string;
  emphasis?: boolean;
}

export interface PhilosophyPrinciple {
  title: string;
  description: string;
}

export interface PhilosophyContent {
  eyebrow: string;
  headline: PhilosophyWord[];
  description: string;
  principlesLabel: string;
  principles: [PhilosophyPrinciple, PhilosophyPrinciple, PhilosophyPrinciple];
  /** Small caption next to the A-CORE (decorative). */
  visualCaption: string;
}

const words = (sentence: string, emphasis: string[]): PhilosophyWord[] =>
  sentence.split(" ").map((text) => ({ text, emphasis: emphasis.includes(text) || undefined }));

const en: PhilosophyContent = {
  eyebrow: "Engineering philosophy",
  headline: words("Technology is only powerful when it solves something.", ["powerful", "solves", "something."]),
  description:
    "We transform business challenges into reliable digital systems, intelligent workflows and scalable software solutions.",
  principlesLabel: "Our principles",
  principles: [
    {
      title: "Understand the problem.",
      description:
        "Before any line of code, we map how the business really works — its processes, constraints and goals.",
    },
    {
      title: "Engineer the solution.",
      description:
        "We design the architecture and software that fit the problem precisely: reliable, measurable and maintainable.",
    },
    {
      title: "Build for the future.",
      description:
        "Every system is built to integrate, scale and evolve with the business — not to be replaced next year.",
    },
  ],
  visualCaption: "Problem → System",
};

const ptBR: PhilosophyContent = {
  eyebrow: "Filosofia de engenharia",
  headline: words("Tecnologia só é poderosa quando resolve alguma coisa.", ["poderosa", "resolve", "alguma", "coisa."]),
  description:
    "Transformamos desafios de negócio em sistemas digitais confiáveis, fluxos de trabalho inteligentes e soluções de software escaláveis.",
  principlesLabel: "Nossos princípios",
  principles: [
    {
      title: "Entender o problema.",
      description:
        "Antes de qualquer linha de código, mapeamos como o negócio realmente funciona — processos, restrições e objetivos.",
    },
    {
      title: "Projetar a solução.",
      description:
        "Desenhamos a arquitetura e o software sob medida para o problema: confiáveis, mensuráveis e fáceis de manter.",
    },
    {
      title: "Construir para o futuro.",
      description:
        "Cada sistema é feito para integrar, escalar e evoluir com o negócio — e não para ser substituído no ano que vem.",
    },
  ],
  visualCaption: "Problema → Sistema",
};

const es: PhilosophyContent = {
  eyebrow: "Filosofía de ingeniería",
  headline: words("La tecnología solo es poderosa cuando resuelve algo.", ["poderosa", "resuelve", "algo."]),
  description:
    "Transformamos desafíos de negocio en sistemas digitales confiables, flujos de trabajo inteligentes y soluciones de software escalables.",
  principlesLabel: "Nuestros principios",
  principles: [
    {
      title: "Entender el problema.",
      description:
        "Antes de escribir una línea de código, mapeamos cómo funciona realmente el negocio: procesos, restricciones y objetivos.",
    },
    {
      title: "Diseñar la solución.",
      description:
        "Diseñamos la arquitectura y el software a la medida del problema: confiables, medibles y fáciles de mantener.",
    },
    {
      title: "Construir para el futuro.",
      description:
        "Cada sistema se construye para integrarse, escalar y evolucionar con el negocio, no para reemplazarse el próximo año.",
    },
  ],
  visualCaption: "Problema → Sistema",
};

export const philosophyContent: Record<Locale, PhilosophyContent> = { en, "pt-BR": ptBR, es };

export function getPhilosophyContent(locale: Locale = defaultLocale): PhilosophyContent {
  return philosophyContent[locale];
}
