import type { Metadata } from "next";
import { BrandLogo, BrandSymbol } from "@/components/brand";
import {
  AutomationIcon,
  CircuitNodeIcon,
  CodeIcon,
  IconContainer,
  InfrastructureIcon,
  MotionContainer,
  PrimaryButton,
  ProductIcon,
  ProjectCard,
  SecondaryButton,
  SectionEyebrow,
  SectionHeading,
  ServiceCard,
} from "@/components/ui";
import { typography, type TypographyRole } from "@/config/design";

/**
 * Internal design-system specimen (not indexed). Used to validate tokens,
 * contrast, fonts and components on light and Deep Navy surfaces.
 */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const swatchGroups: Array<{ title: string; tokens: Array<{ name: string; note?: string }> }> = [
  {
    title: "Brand",
    tokens: [
      { name: "--color-brand-blue", note: "graphics · large display" },
      { name: "--color-brand-cyan", note: "accent · never text on light" },
      { name: "--color-brand-mint", note: "accent · never text on light" },
      { name: "--color-brand-graphite", note: "typography" },
    ],
  },
  {
    title: "Blue scale",
    tokens: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((s) => ({
      name: `--color-blue-${s}`,
    })),
  },
  {
    title: "Interface",
    tokens: [
      { name: "--color-background" },
      { name: "--color-surface" },
      { name: "--color-surface-muted" },
      { name: "--color-border" },
      { name: "--color-text-secondary" },
      { name: "--color-dark-surface" },
    ],
  },
  {
    title: "Semantic",
    tokens: [
      { name: "--color-action-primary" },
      { name: "--color-action-primary-hover" },
      { name: "--color-action-primary-active" },
      { name: "--color-state-active" },
      { name: "--color-focus" },
      { name: "--color-line-strong" },
    ],
  },
  {
    title: "3D / FX",
    tokens: [
      { name: "--color-fx-metal" },
      { name: "--color-fx-metal-dark" },
      { name: "--color-fx-glass" },
      { name: "--color-fx-glass-edge" },
      { name: "--color-fx-emissive" },
      { name: "--color-fx-glow" },
    ],
  },
];

const typeSpecimens: Array<{ role: TypographyRole; sample: string }> = [
  { role: "display", sample: "We engineer what's next." },
  { role: "h1", sample: "Technology that solves something" },
  { role: "h2", sample: "Systems built to evolve" },
  { role: "h3", sample: "Business automation" },
  { role: "h4", sample: "Strategy & architecture" },
  { role: "bodyLarge", sample: "We design, build and integrate digital solutions that help businesses evolve." },
  { role: "body", sample: "Ação, integração, solução — engenharia, diseño y evolución. The quick brown fox jumps over 0123456789." },
  { role: "bodySmall", sample: "Supporting copy, captions and metadata use the small body size." },
  { role: "label", sample: "03 · Services" },
  { role: "nav", sample: "01 Intro  02 Philosophy  03 Services" },
];

const exampleProject = {
  slug: "example",
  title: "Example project composition",
  category: "Digital product",
  year: "2026",
  summary: "Layout specimen only — real case studies will be supplied by the client. No results or metrics are shown.",
  tags: ["Next.js", "Integration", "Design system"],
  href: "/design-system#projects",
};

function Swatch({ name, note }: { name: string; note?: string }) {
  return (
    <li className="flex flex-col gap-2">
      <span
        className="block aspect-landscape w-full rounded-md border border-line shadow-xs"
        style={{ background: `var(${name})` }}
      />
      <code className="font-mono text-[0.75rem] text-ink">{name.replace("--color-", "")}</code>
      {note ? <span className="type-body-sm text-ink-secondary">{note}</span> : null}
    </li>
  );
}

function ComponentRow({ surface }: { surface: "light" | "dark" }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-6">
        <BrandLogo tone={surface} size="lg" href={null} />
        <BrandSymbol size={64} variant={surface === "dark" ? "inverse" : "color"} />
        <span className="text-ink">
          <BrandSymbol size={40} variant="mono" />
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <PrimaryButton>Primary action</PrimaryButton>
        <SecondaryButton>Secondary action</SecondaryButton>
        <PrimaryButton size="lg" icon={null}>
          Large, no icon
        </PrimaryButton>
        <SecondaryButton disabled>Disabled</SecondaryButton>
      </div>
      <p className="type-body">
        Inline <a href="#colors" className="text-link underline underline-offset-4 hover:text-link-hover">link style</a>{" "}
        and <span className="text-ink-secondary">secondary text</span> on this surface.
      </p>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main id="main" className="clear-dock">
      <header className="container-site flex flex-col gap-10 pt-10 pb-(--spacing-section-sm)">
        <BrandLogo />
        <SectionHeading
          level={1}
          size="h1"
          eyebrow={{ index: "00", label: "Design system" }}
          title="Brand identity, typography & tokens"
          description="Specimen of every token and brand component. Values come from src/styles/tokens.css; this page is not indexed."
        />
      </header>

      {/* COLORS */}
      <section id="colors" aria-labelledby="colors-title" className="section-block-sm border-t border-line">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading level={2} id="colors-title" eyebrow={{ index: "01", label: "Color" }} title="Color tokens" />
          {swatchGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-5">
              <h3 className="type-h4 text-ink">{group.title}</h3>
              <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {group.tokens.map((t) => (
                  <Swatch key={t.name} {...t} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section aria-labelledby="type-title" className="section-block-sm border-t border-line bg-panel">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading
            level={2}
            id="type-title"
            eyebrow={{ index: "02", label: "Typography" }}
            title="Space Grotesk + Inter"
            description="Fluid sizes interpolate with clamp() between 360px and 1440px viewports."
          />
          <ul className="flex flex-col">
            {typeSpecimens.map(({ role, sample }) => (
              <li key={role} className="grid-site items-baseline border-t border-line py-6">
                <code className="col-span-4 font-mono text-[0.75rem] text-ink-secondary md:col-span-2">
                  {typography[role]}
                </code>
                <p className={`${typography[role]} col-span-4 text-ink md:col-span-6 lg:col-span-10`}>{sample}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMPONENTS — LIGHT */}
      <section aria-labelledby="components-title" className="section-block-sm border-t border-line">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading
            level={2}
            id="components-title"
            eyebrow={{ index: "03", label: "Components" }}
            title="Brand components on light"
          />
          <ComponentRow surface="light" />
          <div className="flex flex-wrap items-center gap-4">
            <IconContainer tone="brand" shape="hex" size="lg"><CodeIcon /></IconContainer>
            <IconContainer tone="neutral" size="md"><AutomationIcon /></IconContainer>
            <IconContainer tone="inverse" shape="hex" size="md"><ProductIcon /></IconContainer>
            <IconContainer tone="accent" size="sm"><CircuitNodeIcon /></IconContainer>
            <SectionEyebrow index="04">Section eyebrow</SectionEyebrow>
          </div>
        </div>
      </section>

      {/* COMPONENTS — DARK */}
      <section data-surface="dark" aria-labelledby="dark-title" className="section-block-sm">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading
            level={2}
            id="dark-title"
            eyebrow={{ index: "05", label: "Deep Navy surface" }}
            title="Same components, remapped tokens"
            description="data-surface=&quot;dark&quot; remaps text, lines, links and focus — components need no dark variants."
          />
          <ComponentRow surface="dark" />
        </div>
      </section>

      {/* CARDS */}
      <section id="projects" aria-labelledby="cards-title" className="section-block-sm">
        <div className="container-site flex flex-col gap-12">
          <SectionHeading level={2} id="cards-title" eyebrow={{ index: "06", label: "Cards" }} title="Service & project cards" />
          <MotionContainer as="ul" stagger={0.08} className="grid gap-(--spacing-grid-gap) md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Software Engineering", icon: <CodeIcon />, caps: ["Web platforms", "APIs & integrations"] },
              { title: "Business Automation", icon: <AutomationIcon />, caps: ["Workflow automation", "Data pipelines"] },
              { title: "Digital Products", icon: <ProductIcon />, caps: ["Product design", "MVP to scale"] },
              { title: "Systems & Infrastructure", icon: <InfrastructureIcon />, caps: ["Cloud architecture", "Observability"] },
            ].map((s, i) => (
              <MotionContainer key={s.title} as="li" inherit>
                <ServiceCard
                  index={String(i + 1).padStart(2, "0")}
                  title={s.title}
                  description="Specimen copy for layout validation. Final service copy is written in Task 07."
                  icon={s.icon}
                  capabilities={s.caps}
                />
              </MotionContainer>
            ))}
          </MotionContainer>
          <ProjectCard project={exampleProject} layout="feature" ctaLabel="View case study" />
        </div>
      </section>
    </main>
  );
}
