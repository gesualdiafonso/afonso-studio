import { defaultLocale, type Locale } from "@/i18n/config";
import type { ContactErrorCode, ProjectType } from "@/lib/contact-form";

/**
 * CONTACT CONTENT — every piece of text in Section 09 and the site footer.
 * Contact data (e-mail, WhatsApp, social links) lives in src/config/site.ts.
 */

export interface ContactContent {
  eyebrow: string;
  headline: { text: string; emphasis?: boolean }[];
  text: string;
  cta: string;
  form: {
    title: string;
    intro: string;
    required: string;
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string; hint: string; personal: string };
      company: { label: string; placeholder: string };
      projectType: { label: string; placeholder: string };
      description: { label: string; placeholder: string; hint: string };
    };
    projectTypes: Record<ProjectType, string>;
    errors: Record<ContactErrorCode, string>;
    errorSummary: string;
    submit: string;
    sending: string;
    privacy: string;
    status: {
      success: { title: string; text: string; again: string };
      notConfigured: string;
      rateLimited: string;
      failed: string;
    };
    pending: { badge: string; text: string; submit: string };
  };
  channels: {
    title: string;
    email: string;
    whatsapp: string;
    whatsappMessage: string;
    social: string;
    response: string;
  };
  footer: {
    tagline: string;
    navigation: string;
    contact: string;
    social: string;
    language: string;
    rights: string;
    backToTop: string;
    newTab: string;
  };
}

const en: ContactContent = {
  eyebrow: "Contact",
  headline: [{ text: "Have a challenge?" }, { text: "Let's engineer the solution.", emphasis: true }],
  text: "Tell us what your business needs. We'll help you turn complexity into a practical digital solution.",
  cta: "Start a project",
  form: {
    title: "Tell us about your project",
    intro: "A few details are enough to start. We reply personally.",
    required: "Required",
    fields: {
      name: { label: "Name", placeholder: "Your full name" },
      email: {
        label: "Business email",
        placeholder: "you@company.com",
        hint: "We'll only use it to reply to you.",
        personal: "Tip: a company e-mail helps us understand your business — but this one works too.",
      },
      company: { label: "Company", placeholder: "Company name" },
      projectType: { label: "Project type", placeholder: "Choose one" },
      description: {
        label: "Project description",
        placeholder: "What do you need to solve? Current systems, goals, deadlines…",
        hint: "At least 20 characters.",
      },
    },
    projectTypes: {
      software: "Software engineering",
      automation: "Business automation",
      "digital-product": "Digital product / website",
      infrastructure: "Systems & infrastructure",
      "not-sure": "Not sure yet",
    },
    errors: {
      required: "This field is required.",
      email: "Enter a valid e-mail address.",
      tooShort: "Please tell us a little more (at least 20 characters).",
      tooLong: "This text is too long.",
      invalid: "Choose one of the options.",
    },
    errorSummary: "Please check the highlighted fields.",
    submit: "Send message",
    sending: "Sending…",
    privacy: "Your details are used only to answer this message.",
    status: {
      success: {
        title: "Message received.",
        text: "Thank you — we'll get back to you shortly at the e-mail you provided.",
        again: "Send another message",
      },
      notConfigured:
        "The form isn't connected yet, so your message was NOT sent. Please reach us by e-mail or WhatsApp.",
      rateLimited: "Too many messages in a short time. Please try again in a few minutes.",
      failed: "Something went wrong and your message was not sent. Please try again or use e-mail / WhatsApp.",
    },
    pending: {
      badge: "Integration pending",
      text: "This form is not connected to our inbox yet. The button below opens your e-mail app with your message ready to send.",
      submit: "Open in my e-mail app",
    },
  },
  channels: {
    title: "Prefer a direct channel?",
    email: "E-mail",
    whatsapp: "WhatsApp",
    whatsappMessage: "Hello! I'd like to talk about a project.",
    social: "Follow the studio",
    response: "We usually reply within one business day.",
  },
  footer: {
    tagline: "Software engineering & digital solutions for businesses that want to evolve.",
    navigation: "Navigation",
    contact: "Contact",
    social: "Social",
    language: "Language",
    rights: "All rights reserved.",
    backToTop: "Back to top",
    newTab: "(opens in a new tab)",
  },
};

const ptBR: ContactContent = {
  eyebrow: "Contato",
  headline: [{ text: "Tem um desafio?" }, { text: "Vamos projetar a solução.", emphasis: true }],
  text: "Conte o que o seu negócio precisa. Ajudamos a transformar complexidade em uma solução digital prática.",
  cta: "Iniciar um projeto",
  form: {
    title: "Conte sobre o seu projeto",
    intro: "Poucos detalhes bastam para começar. Respondemos pessoalmente.",
    required: "Obrigatório",
    fields: {
      name: { label: "Nome", placeholder: "Seu nome completo" },
      email: {
        label: "E-mail corporativo",
        placeholder: "voce@empresa.com.br",
        hint: "Usaremos apenas para responder.",
        personal: "Dica: um e-mail da empresa nos ajuda a entender o seu negócio — mas este também funciona.",
      },
      company: { label: "Empresa", placeholder: "Nome da empresa" },
      projectType: { label: "Tipo de projeto", placeholder: "Escolha uma opção" },
      description: {
        label: "Descrição do projeto",
        placeholder: "O que você precisa resolver? Sistemas atuais, objetivos, prazos…",
        hint: "Pelo menos 20 caracteres.",
      },
    },
    projectTypes: {
      software: "Engenharia de software",
      automation: "Automação de processos",
      "digital-product": "Produto digital / site",
      infrastructure: "Sistemas e infraestrutura",
      "not-sure": "Ainda não sei",
    },
    errors: {
      required: "Este campo é obrigatório.",
      email: "Informe um e-mail válido.",
      tooShort: "Conte um pouco mais (pelo menos 20 caracteres).",
      tooLong: "Este texto está longo demais.",
      invalid: "Escolha uma das opções.",
    },
    errorSummary: "Confira os campos destacados.",
    submit: "Enviar mensagem",
    sending: "Enviando…",
    privacy: "Seus dados são usados apenas para responder esta mensagem.",
    status: {
      success: {
        title: "Mensagem recebida.",
        text: "Obrigado — responderemos em breve no e-mail informado.",
        again: "Enviar outra mensagem",
      },
      notConfigured:
        "O formulário ainda não está conectado, então sua mensagem NÃO foi enviada. Fale conosco por e-mail ou WhatsApp.",
      rateLimited: "Muitas mensagens em pouco tempo. Tente novamente em alguns minutos.",
      failed: "Algo deu errado e sua mensagem não foi enviada. Tente de novo ou use e-mail / WhatsApp.",
    },
    pending: {
      badge: "Integração pendente",
      text: "Este formulário ainda não está conectado à nossa caixa de entrada. O botão abaixo abre o seu app de e-mail com a mensagem pronta para enviar.",
      submit: "Abrir no meu app de e-mail",
    },
  },
  channels: {
    title: "Prefere um canal direto?",
    email: "E-mail",
    whatsapp: "WhatsApp",
    whatsappMessage: "Olá! Gostaria de conversar sobre um projeto.",
    social: "Acompanhe o estúdio",
    response: "Normalmente respondemos em até um dia útil.",
  },
  footer: {
    tagline: "Engenharia de software e soluções digitais para empresas que querem evoluir.",
    navigation: "Navegação",
    contact: "Contato",
    social: "Redes",
    language: "Idioma",
    rights: "Todos os direitos reservados.",
    backToTop: "Voltar ao topo",
    newTab: "(abre em nova aba)",
  },
};

const es: ContactContent = {
  eyebrow: "Contacto",
  headline: [{ text: "¿Tienes un desafío?" }, { text: "Diseñemos la solución.", emphasis: true }],
  text: "Cuéntanos qué necesita tu negocio. Te ayudamos a convertir la complejidad en una solución digital práctica.",
  cta: "Iniciar un proyecto",
  form: {
    title: "Cuéntanos sobre tu proyecto",
    intro: "Con pocos detalles basta para empezar. Respondemos personalmente.",
    required: "Obligatorio",
    fields: {
      name: { label: "Nombre", placeholder: "Tu nombre completo" },
      email: {
        label: "Correo corporativo",
        placeholder: "tu@empresa.com",
        hint: "Solo lo usaremos para responderte.",
        personal: "Consejo: un correo de la empresa nos ayuda a entender tu negocio, pero este también sirve.",
      },
      company: { label: "Empresa", placeholder: "Nombre de la empresa" },
      projectType: { label: "Tipo de proyecto", placeholder: "Elige una opción" },
      description: {
        label: "Descripción del proyecto",
        placeholder: "¿Qué necesitas resolver? Sistemas actuales, objetivos, plazos…",
        hint: "Al menos 20 caracteres.",
      },
    },
    projectTypes: {
      software: "Ingeniería de software",
      automation: "Automatización de procesos",
      "digital-product": "Producto digital / sitio web",
      infrastructure: "Sistemas e infraestructura",
      "not-sure": "Aún no lo sé",
    },
    errors: {
      required: "Este campo es obligatorio.",
      email: "Introduce un correo válido.",
      tooShort: "Cuéntanos un poco más (al menos 20 caracteres).",
      tooLong: "Este texto es demasiado largo.",
      invalid: "Elige una de las opciones.",
    },
    errorSummary: "Revisa los campos marcados.",
    submit: "Enviar mensaje",
    sending: "Enviando…",
    privacy: "Tus datos solo se usan para responder este mensaje.",
    status: {
      success: {
        title: "Mensaje recibido.",
        text: "Gracias: te responderemos pronto en el correo indicado.",
        again: "Enviar otro mensaje",
      },
      notConfigured:
        "El formulario aún no está conectado, así que tu mensaje NO se envió. Escríbenos por correo o WhatsApp.",
      rateLimited: "Demasiados mensajes en poco tiempo. Inténtalo de nuevo en unos minutos.",
      failed: "Algo salió mal y tu mensaje no se envió. Inténtalo de nuevo o usa correo / WhatsApp.",
    },
    pending: {
      badge: "Integración pendiente",
      text: "Este formulario aún no está conectado a nuestra bandeja de entrada. El botón de abajo abre tu app de correo con el mensaje listo para enviar.",
      submit: "Abrir en mi app de correo",
    },
  },
  channels: {
    title: "¿Prefieres un canal directo?",
    email: "Correo",
    whatsapp: "WhatsApp",
    whatsappMessage: "¡Hola! Me gustaría hablar sobre un proyecto.",
    social: "Sigue al estudio",
    response: "Normalmente respondemos en un día hábil.",
  },
  footer: {
    tagline: "Ingeniería de software y soluciones digitales para empresas que quieren evolucionar.",
    navigation: "Navegación",
    contact: "Contacto",
    social: "Redes",
    language: "Idioma",
    rights: "Todos los derechos reservados.",
    backToTop: "Volver arriba",
    newTab: "(se abre en una pestaña nueva)",
  },
};

export const contactContent: Record<Locale, ContactContent> = { en, "pt-BR": ptBR, es };

export function getContactContent(locale: Locale = defaultLocale): ContactContent {
  return contactContent[locale];
}
