import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * HERO CONTENT — every piece of text in Section 01 lives here.
 * Edit copy here only; components never hard-code hero text.
 *
 * Headline: each line is a list of words. `emphasis: true` renders the word
 * in brand blue (large display text — 3.73:1 on ice, passes AA-large).
 */

export interface HeroWord {
  text: string;
  emphasis?: boolean;
}

export type HeroDetailIcon = "studio" | "partner" | "business";

export interface HeroContent {
  eyebrow: string;
  /** Full sentence for assistive tech; the visual headline is split into words. */
  headlineLabel: string;
  headline: HeroWord[][];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  details: Array<{ icon: HeroDetailIcon; label: string }>;
  scroll: { label: string; ariaLabel: string; href: string };
  /** Small technical captions around the A-CORE visual (decorative). */
  visualCaptions: { title: string; meta: string };
  /** Accessible description of the A-CORE visual. */
  visualAlt: string;
}

const en: HeroContent = {
  eyebrow: "Digital engineering & solutions",
  headlineLabel: "We engineer what's next.",
  headline: [
    [{ text: "We" }, { text: "engineer" }],
    [{ text: "what's" }, { text: "next.", emphasis: true }],
  ],
  description:
    "We design, build and integrate digital solutions that help businesses solve complex challenges, optimize operations and grow with technology.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "Explore our work", href: "#projects" },
  details: [
    { icon: "studio", label: "Digital Engineering Studio" },
    { icon: "partner", label: "Independent technology partner" },
    { icon: "business", label: "Business-focused engineering" },
  ],
  scroll: { label: "Scroll", ariaLabel: "Scroll to the next section", href: "#philosophy" },
  visualCaptions: { title: "A-CORE", meta: "Assembled state · 01" },
  visualAlt: "A-CORE, a hexagonal structure with a central A-shaped core and circuit nodes — the studio's brand symbol in 3D.",
};

const pt: HeroContent = {
  eyebrow: "Engenharia digital & soluções",
  headlineLabel: "Nós projetamos o que vem a seguir.",
  headline: [
    [{ text: "Engenharia" }, { text: "para" }],
    [{ text: "o" }, { text: "próximo.", emphasis: true }],
  ],
  description:
    "Projetamos, desenvolvemos e integramos soluções digitais que ajudam empresas a resolver desafios complexos, otimizar operações e crescer com tecnologia.",
  primaryCta: { label: "Iniciar um projeto", href: "#contact" },
  secondaryCta: { label: "Ver nosso trabalho", href: "#projects" },
  details: [
    { icon: "studio", label: "Estúdio de engenharia digital" },
    { icon: "partner", label: "Parceiro de tecnologia independente" },
    { icon: "business", label: "Engenharia focada no negócio" },
  ],
  scroll: { label: "Rolar", ariaLabel: "Ir para a próxima seção", href: "#philosophy" },
  visualCaptions: { title: "A-CORE", meta: "Estado montado · 01" },
  visualAlt: "A-CORE, uma estrutura hexagonal com um núcleo central em forma de A e nós de circuito — o símbolo da marca em 3D.",
};

const es: HeroContent = {
  eyebrow: "Ingeniería digital y soluciones",
  headlineLabel: "Diseñamos lo que viene.",
  headline: [
    [{ text: "Diseñamos" }],
    [{ text: "lo" }, { text: "que" }, { text: "viene.", emphasis: true }],
  ],
  description:
    "Diseñamos, desarrollamos e integramos soluciones digitales que ayudan a las empresas a resolver desafíos complejos, optimizar operaciones y crecer con tecnología.",
  primaryCta: { label: "Iniciar un proyecto", href: "#contact" },
  secondaryCta: { label: "Ver nuestro trabajo", href: "#projects" },
  details: [
    { icon: "studio", label: "Estudio de ingeniería digital" },
    { icon: "partner", label: "Socio tecnológico independiente" },
    { icon: "business", label: "Ingeniería enfocada en el negocio" },
  ],
  scroll: { label: "Desplazar", ariaLabel: "Ir a la siguiente sección", href: "#philosophy" },
  visualCaptions: { title: "A-CORE", meta: "Estado ensamblado · 01" },
  visualAlt: "A-CORE, una estructura hexagonal con un núcleo central en forma de A y nodos de circuito — el símbolo de la marca en 3D.",
};

export const heroContent: Record<Locale, HeroContent> = { en, "pt-BR": pt, es };

export function getHeroContent(locale: Locale = defaultLocale): HeroContent {
  return heroContent[locale];
}
