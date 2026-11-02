import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * PROCESS CONTENT — every piece of text in Section 06.
 * `icon` picks the Lucide icon in process-timeline.tsx.
 * Each stage also assembles one part of the A-CORE (see a-core-placeholder.tsx).
 */

export type ProcessIcon = "discovery" | "architecture" | "engineering" | "testing" | "delivery";

export interface ProcessStage {
  id: string;
  title: string;
  description: string;
  /** What the client receives at the end of the stage. */
  deliverables: string[];
  icon: ProcessIcon;
}

export interface ProcessContent {
  eyebrow: string;
  title: { text: string; emphasis?: boolean }[];
  intro: string;
  labels: { deliverables: string; stage: string; assembly: string };
  stages: [ProcessStage, ProcessStage, ProcessStage, ProcessStage, ProcessStage];
}

const en: ProcessContent = {
  eyebrow: "Our engineering process",
  title: [{ text: "From the first conversation" }, { text: "to continuous evolution.", emphasis: true }],
  intro:
    "Five clear stages, each with something concrete delivered. You always know where the project is and what comes next.",
  labels: { deliverables: "What you get", stage: "Stage", assembly: "A-CORE · assembly" },
  stages: [
    {
      id: "discovery",
      title: "Discovery",
      description: "Understand the business, its challenges and requirements.",
      deliverables: ["Process and requirements map", "Priorities and success criteria", "Initial scope"],
      icon: "discovery",
    },
    {
      id: "strategy-architecture",
      title: "Strategy & Architecture",
      description: "Define the technical solution, architecture and roadmap.",
      deliverables: ["Solution architecture", "Technical roadmap", "Phases and estimate"],
      icon: "architecture",
    },
    {
      id: "design-engineering",
      title: "Design & Engineering",
      description: "Design the experience and develop the software.",
      deliverables: ["UX/UI design and prototypes", "Working software in short cycles", "Regular demos"],
      icon: "engineering",
    },
    {
      id: "testing-integration",
      title: "Testing & Integration",
      description: "Validate functionality, security, performance and integrations.",
      deliverables: ["Automated and manual tests", "Security and performance checks", "Validated integrations"],
      icon: "testing",
    },
    {
      id: "delivery-evolution",
      title: "Delivery & Evolution",
      description: "Deploy, monitor, maintain and continuously improve.",
      deliverables: ["Go-live and team training", "Monitoring and support", "Continuous improvements"],
      icon: "delivery",
    },
  ],
};

const ptBR: ProcessContent = {
  eyebrow: "Nosso processo de engenharia",
  title: [{ text: "Da primeira conversa" }, { text: "à evolução contínua.", emphasis: true }],
  intro:
    "Cinco etapas claras, cada uma com uma entrega concreta. Você sempre sabe em que ponto o projeto está e o que vem a seguir.",
  labels: { deliverables: "O que você recebe", stage: "Etapa", assembly: "A-CORE · montagem" },
  stages: [
    {
      id: "discovery",
      title: "Descoberta",
      description: "Entender o negócio, seus desafios e requisitos.",
      deliverables: ["Mapa de processos e requisitos", "Prioridades e critérios de sucesso", "Escopo inicial"],
      icon: "discovery",
    },
    {
      id: "strategy-architecture",
      title: "Estratégia & Arquitetura",
      description: "Definir a solução técnica, a arquitetura e o roadmap.",
      deliverables: ["Arquitetura da solução", "Roadmap técnico", "Fases e estimativa"],
      icon: "architecture",
    },
    {
      id: "design-engineering",
      title: "Design & Engenharia",
      description: "Desenhar a experiência e desenvolver o software.",
      deliverables: ["Design de UX/UI e protótipos", "Software funcionando em ciclos curtos", "Demonstrações frequentes"],
      icon: "engineering",
    },
    {
      id: "testing-integration",
      title: "Testes & Integração",
      description: "Validar funcionalidades, segurança, desempenho e integrações.",
      deliverables: ["Testes automatizados e manuais", "Verificações de segurança e desempenho", "Integrações validadas"],
      icon: "testing",
    },
    {
      id: "delivery-evolution",
      title: "Entrega & Evolução",
      description: "Publicar, monitorar, manter e melhorar continuamente.",
      deliverables: ["Lançamento e treinamento da equipe", "Monitoramento e suporte", "Melhorias contínuas"],
      icon: "delivery",
    },
  ],
};

const es: ProcessContent = {
  eyebrow: "Nuestro proceso de ingeniería",
  title: [{ text: "De la primera conversación" }, { text: "a la evolución continua.", emphasis: true }],
  intro:
    "Cinco etapas claras, cada una con una entrega concreta. Siempre sabes en qué punto está el proyecto y qué viene después.",
  labels: { deliverables: "Lo que recibes", stage: "Etapa", assembly: "A-CORE · ensamblaje" },
  stages: [
    {
      id: "discovery",
      title: "Descubrimiento",
      description: "Entender el negocio, sus desafíos y requisitos.",
      deliverables: ["Mapa de procesos y requisitos", "Prioridades y criterios de éxito", "Alcance inicial"],
      icon: "discovery",
    },
    {
      id: "strategy-architecture",
      title: "Estrategia y Arquitectura",
      description: "Definir la solución técnica, la arquitectura y la hoja de ruta.",
      deliverables: ["Arquitectura de la solución", "Hoja de ruta técnica", "Fases y estimación"],
      icon: "architecture",
    },
    {
      id: "design-engineering",
      title: "Diseño e Ingeniería",
      description: "Diseñar la experiencia y desarrollar el software.",
      deliverables: ["Diseño UX/UI y prototipos", "Software funcionando en ciclos cortos", "Demostraciones frecuentes"],
      icon: "engineering",
    },
    {
      id: "testing-integration",
      title: "Pruebas e Integración",
      description: "Validar funcionalidades, seguridad, rendimiento e integraciones.",
      deliverables: ["Pruebas automatizadas y manuales", "Controles de seguridad y rendimiento", "Integraciones validadas"],
      icon: "testing",
    },
    {
      id: "delivery-evolution",
      title: "Entrega y Evolución",
      description: "Desplegar, monitorear, mantener y mejorar continuamente.",
      deliverables: ["Puesta en marcha y capacitación", "Monitoreo y soporte", "Mejoras continuas"],
      icon: "delivery",
    },
  ],
};

export const processContent: Record<Locale, ProcessContent> = { en, "pt-BR": ptBR, es };

export function getProcessContent(locale: Locale = defaultLocale): ProcessContent {
  return processContent[locale];
}
