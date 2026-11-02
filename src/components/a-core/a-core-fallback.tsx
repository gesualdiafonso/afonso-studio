import { BrandSymbol } from "@/components/brand";
import { cn } from "@/lib/cn";

export interface ACoreFallbackProps {
  className?: string;
  /** Class applied to the floating symbol (animation owned by the caller). */
  floatClassName?: string;
  /** Class applied to the orbit layer (animation owned by the caller). */
  orbitClassName?: string;
}

/**
 * Static 2D A-CORE — shown on mobile, without WebGL, with reduced motion,
 * and as the instant placeholder while the 3D canvas loads.
 * Pure SVG + CSS: no JavaScript required.
 */
export function ACoreFallback({ className, floatClassName, orbitClassName }: ACoreFallbackProps) {
  return (
    <div className={cn("relative grid aspect-square w-full place-items-center", className)} aria-hidden>
      {/* Orbit + modules */}
      <svg viewBox="0 0 400 400" className={cn("absolute inset-0 size-full", orbitClassName)} fill="none">
        <ellipse cx="200" cy="200" rx="186" ry="186" stroke="var(--color-line)" strokeWidth="1" />
        <ellipse
          cx="200"
          cy="200"
          rx="168"
          ry="168"
          stroke="var(--color-accent-cyan)"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        {[
          { a: 20, s: 9, fill: "var(--color-fx-metal)" },
          { a: 112, s: 7, fill: "var(--color-accent-mint)" },
          { a: 205, s: 12, fill: "var(--color-fx-metal)" },
          { a: 300, s: 7, fill: "var(--color-accent-mint)" },
        ].map(({ a, s, fill }) => {
          const r = (a * Math.PI) / 180;
          const cx = 200 + Math.cos(r) * 168;
          const cy = 200 + Math.sin(r) * 168;
          const pts = Array.from({ length: 6 }, (_, i) => {
            const t = (Math.PI / 3) * i - Math.PI / 2;
            return `${(cx + s * Math.cos(t)).toFixed(1)},${(cy + s * Math.sin(t)).toFixed(1)}`;
          }).join(" ");
          return <polygon key={a} points={pts} fill={fill} stroke="var(--color-line-accent)" strokeWidth="1" />;
        })}
      </svg>

      {/* Ground shadow */}
      <span className="absolute bottom-[9%] h-[5%] w-[46%] rounded-pill bg-fx-shadow blur-xl" />

      <div className={cn("relative w-[76%] drop-shadow-[0_24px_40px_var(--color-fx-glow)]", floatClassName)}>
        <BrandSymbol size={400} className="h-auto w-full" />
      </div>
    </div>
  );
}
