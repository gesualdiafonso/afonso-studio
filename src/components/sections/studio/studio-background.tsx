import { BrandSymbol } from "@/components/brand";

/**
 * Subtle moving background: a very large outline of the symbol drifting with
 * the scroll, a soft light that slides across, and a blueprint grid.
 * Decorative only (positioned, z auto → behind the A-CORE stage and content).
 */
export function StudioBackground() {
  return (
    <div aria-hidden className="studio-bg pointer-events-none absolute inset-0 overflow-hidden">
      <div className="studio-grid absolute inset-0" />
      <div data-studio-glow className="studio-glow absolute top-[18%] left-[-10%] size-[60rem] rounded-full" />
      <div data-studio-drift className="studio-drift absolute top-[4%] right-[-14%] w-[min(70rem,110vw)] opacity-[0.045]">
        <BrandSymbol variant="mono" size={1000} outerTraces className="h-auto w-full" />
      </div>
      <div className="studio-fade absolute inset-x-0 bottom-0 h-[40rem]" />
    </div>
  );
}
