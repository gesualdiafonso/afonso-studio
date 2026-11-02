/**
 * OFFICIAL BRAND SYMBOL — VECTOR GEOMETRY
 * ---------------------------------------------------------------------------
 * Traced from the client's logo (public/brand/logo-original.png, 356 × 357 px).
 * All coordinates are in that image's pixel space (y grows downward).
 *
 * SINGLE SOURCE OF TRUTH for the mark:
 *  - <BrandSymbol />  renders it as SVG (header, fallbacks, mobile hero)
 *  - <ACorePlaceholder /> extrudes the SAME data into 3D (desktop hero)
 * Edit the logo here once and both versions update.
 */

export type Point = readonly [number, number];
export type LogoTone = "blue" | "cyan" | "mint" | "white";

export const LOGO_VIEWBOX = { x: 0, y: 0, width: 356, height: 357 } as const;
export const LOGO_CENTER: Point = [180, 190];

/** Pointy-top hexagon frame. */
export const HEX = {
  radius: 140, // centre → outer vertex
  band: 19, // perpendicular thickness of the frame
  gap: 0.012, // cut between frame segments (fraction of a side)
} as const;

/**
 * Frame segments along the perimeter. `from` / `to` are perimeter positions:
 * 0 = top vertex, 1 = upper-right, 2 = lower-right, 3 = bottom,
 * 4 = lower-left, 5 = upper-left, 6 = top again. Gradient stops run from→to.
 */
export const frameSegments: ReadonlyArray<{ id: string; from: number; to: number; stops: LogoTone[] }> = [
  { id: "top-right", from: 0, to: 1.5, stops: ["cyan", "blue", "blue"] },
  { id: "bottom-right", from: 1.5, to: 3, stops: ["cyan", "blue", "blue"] },
  { id: "bottom-left", from: 3, to: 4.5, stops: ["cyan", "mint", "white"] },
  { id: "top-left", from: 4.5, to: 6, stops: ["white", "blue", "blue"] },
];

/** The "A": one polygon (outer apex, right foot, inner apex, left foot). */
export const monogram = {
  outline: [
    [178, 88],
    [284, 268],
    [266, 279],
    [178, 131],
    [91, 279],
    [73, 268],
  ] as readonly Point[],
  /** Vertical gradient top → bottom. */
  stops: ["cyan", "white", "mint"] as LogoTone[],
  crossbar: [
    [137, 200],
    [219, 200],
    [229, 218],
    [127, 218],
  ] as readonly Point[],
  /** Horizontal gradient left → right. */
  crossbarStops: ["cyan", "white"] as LogoTone[],
};

export type Terminal = { kind: "ring" | "dot"; at: Point; r: number };

export interface Trace {
  id: string;
  points: readonly Point[];
  tone: LogoTone;
  width: number;
  terminal?: Terminal;
  /** inner = inside the hexagon (behind the A); outer = radiating outside. */
  layer: "inner" | "outer";
}

export const traces: readonly Trace[] = [
  // ── Inside the hexagon ──────────────────────────────────────────────
  { id: "in-left", layer: "inner", tone: "blue", width: 4, points: [[137, 121], [93, 152], [93, 240]], terminal: { kind: "ring", at: [137, 121], r: 7 } },
  { id: "in-right-cyan", layer: "inner", tone: "cyan", width: 4, points: [[216, 123], [265, 152], [265, 242]], terminal: { kind: "ring", at: [216, 123], r: 7 } },
  { id: "in-right-mint", layer: "inner", tone: "mint", width: 3.5, points: [[228, 114], [276, 145], [276, 250]] },
  { id: "in-right-white", layer: "inner", tone: "white", width: 3, points: [[212, 145], [248, 166], [248, 214]] },
  { id: "in-center", layer: "inner", tone: "blue", width: 3, points: [[178, 158], [178, 310]], terminal: { kind: "ring", at: [178, 158], r: 7 } },
  { id: "in-left-white", layer: "inner", tone: "white", width: 3, points: [[109, 168], [109, 205]], terminal: { kind: "ring", at: [109, 168], r: 7 } },
  { id: "in-low-right-1", layer: "inner", tone: "blue", width: 3, points: [[235, 225], [197, 250], [197, 300]] },
  { id: "in-low-right-2", layer: "inner", tone: "blue", width: 3, points: [[243, 238], [210, 258], [210, 295]] },
  { id: "in-low-bar", layer: "inner", tone: "cyan", width: 3.5, points: [[120, 245], [188, 245]] },
  { id: "in-low-ring", layer: "inner", tone: "white", width: 2.5, points: [[100, 258], [148, 258]], terminal: { kind: "ring", at: [153, 258], r: 7 } },

  // ── Radiating outside ───────────────────────────────────────────────
  { id: "out-top-mint", layer: "outer", tone: "mint", width: 4, points: [[212, 70], [212, 13]], terminal: { kind: "ring", at: [212, 7], r: 7.5 } },
  { id: "out-top-blue-1", layer: "outer", tone: "blue", width: 3, points: [[200, 61], [200, 30]] },
  { id: "out-top-blue-2", layer: "outer", tone: "blue", width: 3, points: [[229, 78], [229, 34]] },
  { id: "out-top-white", layer: "outer", tone: "white", width: 3, points: [[130, 79], [130, 56]], terminal: { kind: "dot", at: [130, 51], r: 7 } },
  { id: "out-left-blue", layer: "outer", tone: "blue", width: 3, points: [[59, 167], [2, 167]] },
  { id: "out-left-white", layer: "outer", tone: "white", width: 3, points: [[59, 210], [21, 210], [12, 192]], terminal: { kind: "ring", at: [9, 186], r: 7.5 } },
  { id: "out-left-dot", layer: "outer", tone: "blue", width: 3, points: [[59, 229], [24, 229]], terminal: { kind: "dot", at: [20, 229], r: 7 } },
  { id: "out-left-ring", layer: "outer", tone: "blue", width: 3, points: [[59, 259], [23, 259]], terminal: { kind: "ring", at: [16, 259], r: 7.5 } },
  { id: "out-right-mint", layer: "outer", tone: "mint", width: 3, points: [[292, 114], [354, 114]] },
  { id: "out-right-cyan", layer: "outer", tone: "cyan", width: 5, points: [[302, 127], [354, 127]] },
  { id: "out-right-blue", layer: "outer", tone: "blue", width: 5, points: [[302, 175], [339, 175]], terminal: { kind: "ring", at: [345, 175], r: 7.5 } },
  { id: "out-right-mint-low", layer: "outer", tone: "mint", width: 3, points: [[302, 256], [340, 256]] },
  { id: "out-bottom-white", layer: "outer", tone: "white", width: 3, points: [[87, 276], [87, 326]] },
  { id: "out-bottom-mint", layer: "outer", tone: "mint", width: 3.5, points: [[101, 280], [101, 342]], terminal: { kind: "ring", at: [101, 348], r: 7.5 } },
  { id: "out-bottom-mint-2", layer: "outer", tone: "mint", width: 3, points: [[116, 292], [116, 330]] },
];

// ── Geometry helpers ────────────────────────────────────────────────────

/** Vertex i (0 = top, clockwise) of a pointy-top hexagon of radius r. */
export function hexVertex(r: number, i: number): Point {
  const a = (Math.PI / 180) * (60 * i - 90);
  return [LOGO_CENTER[0] + r * Math.cos(a), LOGO_CENTER[1] + r * Math.sin(a)];
}

/** Point at perimeter position p (0…6) on a hexagon of radius r. */
export function perimeterPoint(r: number, p: number): Point {
  const i = Math.floor(p) % 6;
  const t = p - Math.floor(p);
  const [ax, ay] = hexVertex(r, i);
  const [bx, by] = hexVertex(r, i + 1);
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}

/** Inner radius so the band has the requested perpendicular thickness. */
export const innerRadius = HEX.radius - HEX.band / Math.cos(Math.PI / 6);

/** Closed polygon (outer edge forward, inner edge back) for one frame segment. */
export function frameSegmentPolygon(from: number, to: number): Point[] {
  const a = from + HEX.gap;
  const b = to - HEX.gap;
  const stops = [a, ...[1, 2, 3, 4, 5, 6].filter((v) => v > a && v < b), b];
  const outer = stops.map((p) => perimeterPoint(HEX.radius, p));
  const inner = stops.map((p) => perimeterPoint(innerRadius, p)).reverse();
  return [...outer, ...inner];
}

export const toPath = (points: readonly Point[], close = false): string =>
  points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x)} ${round(y)}`).join(" ") + (close ? " Z" : "");

const round = (n: number) => Math.round(n * 100) / 100;
