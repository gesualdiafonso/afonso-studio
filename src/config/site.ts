/**
 * SITE CONFIGURATION — brand information, logo paths, contact and social.
 * Every component reads from here; nothing is hard-coded in components.
 *
 * ⚠️  Values marked PLACEHOLDER must be replaced with the client's real data
 *     before launch (`npm run validate:tokens` lists them as warnings).
 */

export type SocialNetwork = "linkedin" | "github" | "instagram" | "behance" | "x";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  href: string;
  placeholder?: boolean;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  legalName: string;
  url: string;
  logo: {
    /** Vector symbol traced from the official logo (src/components/brand/symbol-geometry.ts). */
    provisional: boolean;
    /** Official artwork. Drop files in /public/brand and set the paths. */
    official: {
      full: string | null; // horizontal logo, e.g. "/brand/logo-full.svg"
      symbol: string | null; // symbol only, e.g. "/brand/logo-symbol.svg"
      fullInverse: string | null; // for Deep Navy sections
      width: number;
      height: number;
    };
    favicon: string;
  };
  contact: {
    email: string;
    phone: string | null;
    location: string | null;
    /** WhatsApp number in international format, digits only (e.g. "5511912345678"). null hides it. */
    whatsapp: string | null;
    placeholder?: boolean;
  };
  /** Year shown in the footer copyright (static: avoids reading the clock at render). */
  copyrightYear: number;
  social: SocialLink[];
}

export const siteConfig = {
  name: "Afonso Studio", // PLACEHOLDER — confirm final company name
  shortName: "Afonso",
  legalName: "Afonso Studio", // PLACEHOLDER
  url: "https://example.com", // PLACEHOLDER — production domain
  logo: {
    provisional: false, // vector traced from /brand/logo-original.png
    official: {
      full: null,
      symbol: null,
      fullInverse: null,
      width: 180,
      height: 40,
    },
    favicon: "/favicon.ico",
  },
  contact: {
    email: "gesualdiafonsoarr@gmail.com", // PLACEHOLDER
    phone: null,
    location: null,
    whatsapp: "5491121799242", // PLACEHOLDER — real WhatsApp Business number, digits only
    placeholder: true,
  },
  copyrightYear: 2026,
  social: [
    { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/afonso-gesualdi-aaa9bb244/", placeholder: true },
    { network: "github", label: "GitHub", href: "https://github.com/gesualdiafonso", placeholder: true },
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/gesualdi.design/", placeholder: true },
  ],
} satisfies SiteConfig;
