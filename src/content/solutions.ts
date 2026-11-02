import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * BUSINESS SOLUTIONS CONTENT — every piece of text in Section 05.
 * Written for business owners: plain words, no jargon.
 *
 * Each case drives one diagram:
 *   modules  → the 4 disconnected pieces of the problem (short labels)
 *   hub      → what connects them (the solution)
 *   outcome  → caption of the UI mockup that appears at the end
 *   mockup   → which mockup is drawn: dashboard | workflow | portal | architecture
 */

export type SolutionMockup = "dashboard" | "workflow" | "portal" | "architecture";

export interface SolutionCase {
  id: string;
  title: string;
  problem: string;
  solution: string;
  /** One concrete sentence a non-technical reader recognises. */
  example: string;
  modules: [string, string, string, string];
  hub: string;
  outcome: string;
  mockup: SolutionMockup;
}

export interface SolutionsContent {
  eyebrow: string;
  title: { text: string; emphasis?: boolean }[];
  intro: string;
  labels: {
    problem: string;
    solution: string;
    inPractice: string;
    showProblem: string;
    showSolution: string;
    view: string;
    next: string;
  };
  cases: [SolutionCase, SolutionCase, SolutionCase, SolutionCase];
}

const en: SolutionsContent = {
  eyebrow: "Business solutions",
  title: [{ text: "Real problems." }, { text: "Connected solutions.", emphasis: true }],
  intro:
    "Most businesses don't need more software. They need the pieces they already have to work together. Here is how we do it.",
  labels: {
    problem: "The problem",
    solution: "The solution",
    inPractice: "In practice",
    showProblem: "Problem",
    showSolution: "Solution",
    view: "Show this case",
    next: "How we get there",
  },
  cases: [
    {
      id: "disconnected-operations",
      title: "Disconnected operations",
      problem: "Different systems and spreadsheets create fragmented information.",
      solution: "Integrated management platforms and centralized data.",
      example: "Sales, finance and stock finally look at the same numbers.",
      modules: ["Spreadsheets", "Sales", "Finance", "Inventory"],
      hub: "Integrated platform",
      outcome: "One place to see the whole business",
      mockup: "dashboard",
    },
    {
      id: "manual-processes",
      title: "Manual processes",
      problem: "Repetitive tasks consume employee time.",
      solution: "Automated workflows and integrations.",
      example: "Invoices, approvals and reports move on their own — people handle only the exceptions.",
      modules: ["E-mails", "Copy & paste", "Approvals", "Reports"],
      hub: "Automated workflow",
      outcome: "Tasks that run by themselves",
      mockup: "workflow",
    },
    {
      id: "limited-digital-presence",
      title: "Limited digital presence",
      problem: "Businesses struggle to acquire and serve customers digitally.",
      solution: "Websites, digital products and customer portals.",
      example: "Customers find you, request a quote and follow their order without calling.",
      modules: ["Old website", "WhatsApp", "Phone calls", "Paper forms"],
      hub: "Digital front door",
      outcome: "Customers served any time, on any device",
      mockup: "portal",
    },
    {
      id: "scalability-challenges",
      title: "Scalability challenges",
      problem: "Existing systems cannot support business growth.",
      solution: "Modern architecture, cloud infrastructure and scalable applications.",
      example: "More customers, more branches, more data — and the system keeps up.",
      modules: ["Old server", "Slow system", "Manual backups", "Traffic peaks"],
      hub: "Cloud architecture",
      outcome: "A system that grows with the business",
      mockup: "architecture",
    },
  ],
};

const ptBR: SolutionsContent = {
  eyebrow: "Soluções para negócios",
  title: [{ text: "Problemas reais." }, { text: "Soluções conectadas.", emphasis: true }],
  intro:
    "A maioria das empresas não precisa de mais software. Precisa que as peças que já tem funcionem juntas. Veja como fazemos isso.",
  labels: {
    problem: "O problema",
    solution: "A solução",
    inPractice: "Na prática",
    showProblem: "Problema",
    showSolution: "Solução",
    view: "Ver este caso",
    next: "Como chegamos lá",
  },
  cases: [
    {
      id: "disconnected-operations",
      title: "Operações desconectadas",
      problem: "Sistemas diferentes e planilhas geram informação fragmentada.",
      solution: "Plataformas de gestão integradas e dados centralizados.",
      example: "Vendas, financeiro e estoque finalmente olham para os mesmos números.",
      modules: ["Planilhas", "Vendas", "Financeiro", "Estoque"],
      hub: "Plataforma integrada",
      outcome: "Um só lugar para ver a empresa inteira",
      mockup: "dashboard",
    },
    {
      id: "manual-processes",
      title: "Processos manuais",
      problem: "Tarefas repetitivas consomem o tempo da equipe.",
      solution: "Fluxos de trabalho automatizados e integrações.",
      example: "Notas, aprovações e relatórios andam sozinhos — a equipe cuida só das exceções.",
      modules: ["E-mails", "Copiar e colar", "Aprovações", "Relatórios"],
      hub: "Fluxo automatizado",
      outcome: "Tarefas que rodam sozinhas",
      mockup: "workflow",
    },
    {
      id: "limited-digital-presence",
      title: "Presença digital limitada",
      problem: "Empresas têm dificuldade para conquistar e atender clientes no digital.",
      solution: "Sites, produtos digitais e portais do cliente.",
      example: "O cliente encontra você, pede orçamento e acompanha o pedido sem precisar ligar.",
      modules: ["Site antigo", "WhatsApp", "Telefone", "Formulários em papel"],
      hub: "Porta de entrada digital",
      outcome: "Clientes atendidos a qualquer hora, em qualquer tela",
      mockup: "portal",
    },
    {
      id: "scalability-challenges",
      title: "Desafios de escala",
      problem: "Os sistemas atuais não acompanham o crescimento do negócio.",
      solution: "Arquitetura moderna, infraestrutura em nuvem e aplicações escaláveis.",
      example: "Mais clientes, mais filiais, mais dados — e o sistema acompanha.",
      modules: ["Servidor antigo", "Sistema lento", "Backups manuais", "Picos de acesso"],
      hub: "Arquitetura em nuvem",
      outcome: "Um sistema que cresce junto com a empresa",
      mockup: "architecture",
    },
  ],
};

const es: SolutionsContent = {
  eyebrow: "Soluciones para negocios",
  title: [{ text: "Problemas reales." }, { text: "Soluciones conectadas.", emphasis: true }],
  intro:
    "La mayoría de las empresas no necesita más software. Necesita que las piezas que ya tiene funcionen juntas. Así lo hacemos.",
  labels: {
    problem: "El problema",
    solution: "La solución",
    inPractice: "En la práctica",
    showProblem: "Problema",
    showSolution: "Solución",
    view: "Ver este caso",
    next: "Cómo llegamos",
  },
  cases: [
    {
      id: "disconnected-operations",
      title: "Operaciones desconectadas",
      problem: "Sistemas distintos y hojas de cálculo generan información fragmentada.",
      solution: "Plataformas de gestión integradas y datos centralizados.",
      example: "Ventas, finanzas e inventario por fin miran los mismos números.",
      modules: ["Hojas de cálculo", "Ventas", "Finanzas", "Inventario"],
      hub: "Plataforma integrada",
      outcome: "Un solo lugar para ver toda la empresa",
      mockup: "dashboard",
    },
    {
      id: "manual-processes",
      title: "Procesos manuales",
      problem: "Las tareas repetitivas consumen el tiempo del equipo.",
      solution: "Flujos de trabajo automatizados e integraciones.",
      example: "Facturas, aprobaciones e informes avanzan solos: el equipo solo atiende las excepciones.",
      modules: ["Correos", "Copiar y pegar", "Aprobaciones", "Informes"],
      hub: "Flujo automatizado",
      outcome: "Tareas que funcionan solas",
      mockup: "workflow",
    },
    {
      id: "limited-digital-presence",
      title: "Presencia digital limitada",
      problem: "A las empresas les cuesta captar y atender clientes en digital.",
      solution: "Sitios web, productos digitales y portales de clientes.",
      example: "El cliente te encuentra, pide un presupuesto y sigue su pedido sin llamar.",
      modules: ["Sitio antiguo", "WhatsApp", "Llamadas", "Formularios en papel"],
      hub: "Puerta de entrada digital",
      outcome: "Clientes atendidos a cualquier hora, en cualquier pantalla",
      mockup: "portal",
    },
    {
      id: "scalability-challenges",
      title: "Desafíos de escala",
      problem: "Los sistemas actuales no acompañan el crecimiento del negocio.",
      solution: "Arquitectura moderna, infraestructura en la nube y aplicaciones escalables.",
      example: "Más clientes, más sucursales, más datos, y el sistema acompaña.",
      modules: ["Servidor antiguo", "Sistema lento", "Copias manuales", "Picos de tráfico"],
      hub: "Arquitectura en la nube",
      outcome: "Un sistema que crece con la empresa",
      mockup: "architecture",
    },
  ],
};

export const solutionsContent: Record<Locale, SolutionsContent> = { en, "pt-BR": ptBR, es };

export function getSolutionsContent(locale: Locale = defaultLocale): SolutionsContent {
  return solutionsContent[locale];
}
