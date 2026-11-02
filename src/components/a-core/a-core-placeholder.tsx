"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  HEX,
  LOGO_CENTER,
  frameSegmentPolygon,
  frameSegments,
  innerRadius,
  monogram,
  perimeterPoint,
  traces,
  type LogoTone,
  type Point,
} from "@/components/brand/symbol-geometry";

/**
 * A-CORE — the official logo in 3D (assembled state).
 * ---------------------------------------------------------------------------
 * Extruded procedurally from symbol-geometry.ts — the SAME data as the 2D
 * <BrandSymbol />, so the mark and the 3D protagonist always match.
 *   • segmented hexagonal frame  → glossy extrusions with the logo gradients
 *   • "A" + crossbar             → thicker extrusion in front (cyan→white→mint)
 *   • circuit traces + nodes     → tubes, rings (torus) and dots (spheres)
 *   • glass membrane + orbit     → A-CORE material direction
 * Task 06 can swap this for an optimised GLB; the props stay the same.
 */

export interface ACoreColors {
  metal: string;
  metalDark: string;
  blue: string;
  cyan: string;
  glass: string;
  emissive: string;
}

export interface ACorePlaceholderProps {
  colors: ACoreColors;
  /** Idle floating / orbit motion (off for reduced motion). */
  animate?: boolean;
  /** Normalised pointer (-1…1), read every frame for a subtle tilt. */
  pointer?: React.RefObject<{ x: number; y: number }>;
  /**
   * 0 = assembled. Reserved for ScrollTrigger: values > 0 separate the
   * modules (Services section). Read every frame, never re-renders.
   */
  explode?: React.RefObject<number>;
  /** Travel progress between page anchors (0 = hero, 1 = philosophy…). */
  travel?: React.RefObject<number>;
  /** Index of the frame module to highlight (frameSegments order), -1 = none. */
  focus?: React.RefObject<number>;
  /**
   * Process assembly, read every frame. -1 = off (fully assembled).
   * 0…5 = the five process stages: each stage snaps one group into place
   * (see ASSEMBLY_START). Pieces not yet assembled float outward, tilted.
   */
  assembly?: React.RefObject<number>;
}

/** Stage (0-based) at which each group assembles during the Process section. */
const ASSEMBLY_START = {
  core: 0, // 01 Discovery — the core idea
  "top-left": 1, // 02 Strategy & Architecture — the structure
  "top-right": 1,
  "bottom-right": 2, // 03 Design & Engineering — the build
  "bottom-left": 2,
  circuits: 3, // 04 Testing & Integration — everything connected
  orbit: 4, // 05 Delivery & Evolution — running and evolving
} as const;

const smoothstep = (v: number) => {
  const x = Math.min(Math.max(v, 0), 1);
  return x * x * (3 - 2 * x);
};

// ── Logo pixel space → world units (hexagon radius = 1) ──────────────────
const UNIT = 1 / HEX.radius;
const wx = (x: number) => (x - LOGO_CENTER[0]) * UNIT;
const wy = (y: number) => (LOGO_CENTER[1] - y) * UNIT;
const toVec = ([x, y]: Point, z = 0) => new THREE.Vector3(wx(x), wy(y), z);

const DEPTH = {
  frame: 0.15,
  monogram: 0.2,
  bevel: 0.008,
};

function shapeFrom(points: readonly Point[]): THREE.Shape {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? shape.moveTo(wx(x), wy(y)) : shape.lineTo(wx(x), wy(y))));
  shape.closePath();
  return shape;
}

function extrude(points: readonly Point[], depth: number, z: number): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shapeFrom(points), {
    depth,
    bevelEnabled: true,
    bevelThickness: DEPTH.bevel,
    bevelSize: DEPTH.bevel,
    bevelSegments: 2,
    curveSegments: 1,
  });
  geo.translate(0, 0, z);
  return geo;
}

/** Paints a linear gradient (logo pixel space a→b) into vertex colours. */
function paintGradient(geo: THREE.BufferGeometry, a: Point, b: Point, stops: THREE.Color[]) {
  const pos = geo.getAttribute("position");
  const colors = new Float32Array(pos.count * 3);
  const ax = wx(a[0]), ay = wy(a[1]);
  const dx = wx(b[0]) - ax, dy = wy(b[1]) - ay;
  const len2 = dx * dx + dy * dy || 1;
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(((pos.getX(i) - ax) * dx + (pos.getY(i) - ay) * dy) / len2, 0, 1);
    const f = t * (stops.length - 1);
    const k = Math.min(Math.floor(f), stops.length - 2);
    c.copy(stops[k]).lerp(stops[k + 1], f - k);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

function tubeFrom(points: readonly Point[], radius: number, z: number): THREE.TubeGeometry {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < points.length - 1; i++) {
    path.add(new THREE.LineCurve3(toVec(points[i], z), toVec(points[i + 1], z)));
  }
  return new THREE.TubeGeometry(path, Math.max(2, (points.length - 1) * 2), radius, 8, false);
}

export function ACorePlaceholder({ colors, animate = true, pointer, explode, travel, focus, assembly }: ACorePlaceholderProps) {
  const root = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const frame = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const circuits = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Mesh>(null);

  // Tone → colour. "white" stays a pale silver so it reads on light backgrounds.
  const tone = useMemo<Record<LogoTone, THREE.Color>>(
    () => ({
      blue: new THREE.Color(colors.blue),
      cyan: new THREE.Color(colors.cyan),
      mint: new THREE.Color(colors.emissive),
      white: new THREE.Color("#f2f8ff"),
    }),
    [colors],
  );

  const built = useMemo(() => {
    // Segmented frame with per-segment gradients
    const frameParts = frameSegments.map((seg) => {
      const geo = extrude(frameSegmentPolygon(seg.from, seg.to), DEPTH.frame, -DEPTH.frame / 2);
      paintGradient(geo, perimeterPoint(HEX.radius, seg.from), perimeterPoint(HEX.radius, seg.to), seg.stops.map((s) => tone[s]));
      const mid = perimeterPoint(HEX.radius, (seg.from + seg.to) / 2);
      const dir = new THREE.Vector3(wx(mid[0]), wy(mid[1]), 0).normalize();
      return { id: seg.id, geo, dir };
    });

    // "A" monogram + crossbar, in front of the frame
    const aGeo = extrude(monogram.outline, DEPTH.monogram, 0.03);
    paintGradient(aGeo, [178, 88], [178, 279], monogram.stops.map((s) => tone[s]));
    const barGeo = extrude(monogram.crossbar, DEPTH.monogram * 0.8, 0.05);
    paintGradient(barGeo, [127, 209], [229, 209], monogram.crossbarStops.map((s) => tone[s]));

    // Glass membrane inside the hexagon
    const glassShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const [x, y] = perimeterPoint(innerRadius, i);
      if (i === 0) glassShape.moveTo(wx(x), wy(y));
      else glassShape.lineTo(wx(x), wy(y));
    }
    glassShape.closePath();
    const glassGeo = new THREE.ShapeGeometry(glassShape);

    // Circuit traces → tubes + terminals
    const traceParts = traces.map((t) => {
      const z = t.layer === "inner" ? -0.01 : 0;
      const radius = Math.max(t.width * 0.5 * UNIT, 0.009);
      const parts: Array<{ geo: THREE.BufferGeometry; position?: THREE.Vector3 }> = [
        { geo: tubeFrom(t.points, radius, z) },
      ];
      if (t.terminal) {
        const r = t.terminal.r * UNIT;
        parts.push({
          geo:
            t.terminal.kind === "ring"
              ? new THREE.TorusGeometry(r, 0.016, 10, 32)
              : new THREE.SphereGeometry(r, 20, 20),
          position: toVec(t.terminal.at, z),
        });
      }
      return { id: t.id, tone: t.tone, layer: t.layer, parts };
    });

    const moduleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 6);
    moduleGeo.rotateX(Math.PI / 2);

    return { frameParts, aGeo, barGeo, glassGeo, traceParts, moduleGeo };
  }, [tone]);

  const materials = useMemo(
    () => ({
      gradient: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        metalness: 0.3,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: 0.45,
      }),
      monogram: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        metalness: 0.15,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        emissive: new THREE.Color(colors.cyan),
        emissiveIntensity: 0.05,
        envMapIntensity: 0.4,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: colors.cyan,
        metalness: 0,
        roughness: 0.08,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      trace: Object.fromEntries(
        (Object.keys(tone) as LogoTone[]).map((key) => [
          key,
          new THREE.MeshStandardMaterial({
            // White traces → silver-slate so they stay visible on ice-white.
            color: key === "white" ? new THREE.Color("#9aabbd") : tone[key],
            metalness: key === "white" ? 0.6 : 0.25,
            roughness: 0.3,
            emissive: key === "mint" ? tone.mint : new THREE.Color(0x000000),
            emissiveIntensity: key === "mint" ? 0.35 : 0,
          }),
        ]),
      ) as Record<LogoTone, THREE.MeshStandardMaterial>,
      orbitLine: new THREE.MeshBasicMaterial({ color: colors.cyan, transparent: true, opacity: 0.45 }),
      module: new THREE.MeshPhysicalMaterial({ color: colors.metal, metalness: 0.9, roughness: 0.3 }),
    }),
    [colors, tone],
  );

  // One material per frame module so each can glow on its own (service focus).
  const segmentMaterials = useMemo(
    () =>
      built.frameParts.map(() => {
        const m = materials.gradient.clone();
        m.emissive = new THREE.Color(colors.cyan);
        m.emissiveIntensity = 0;
        return m;
      }),
    [built, materials, colors.cyan],
  );
  const highlight = useRef<number[]>([0, 0, 0, 0]);

  useEffect(() => () => segmentMaterials.forEach((m) => m.dispose()), [segmentMaterials]);

  // Free GPU memory when unmounted.
  useEffect(
    () => () => {
      built.frameParts.forEach((p) => p.geo.dispose());
      built.traceParts.forEach((t) => t.parts.forEach((p) => p.geo.dispose()));
      [built.aGeo, built.barGeo, built.glassGeo, built.moduleGeo].forEach((g) => g.dispose());
      Object.values(materials).forEach((m) =>
        m instanceof THREE.Material ? m.dispose() : Object.values(m).forEach((x) => x.dispose()),
      );
    },
    [built, materials],
  );

  const orbitals = useMemo(
    () =>
      [0.3, 1.6, 2.7, 4.0, 5.3].map((angle, i) => ({
        position: new THREE.Vector3(Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, i % 2 ? 0.1 : -0.1),
        scale: i === 2 ? 1.4 : 1,
      })),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = pointer?.current ?? { x: 0, y: 0 };
    const e = explode?.current ?? 0;
    const tr = travel?.current ?? 0;
    const f = focus?.current ?? -1;
    const a = assembly?.current ?? -1;
    /** 0 = still floating apart, 1 = in place. Always 1 when assembly is off. */
    const placed = (start: number) => (a < 0 ? 1 : smoothstep(a - start));

    if (root.current) {
      // While travelling between anchors the core swings round (peak mid-way)
      // and settles at a slightly turned pose at the destination.
      const leg = tr - Math.floor(tr); // progress inside the current anchor → anchor leg
      const turn = Math.sin(leg * Math.PI) * 0.9;
      // While separated, face the camera so the four modules read clearly.
      const idle = (animate ? Math.sin(t * 0.35) * 0.22 + p.x * 0.28 : -0.18) * (1 - e * 0.6);
      const targetY = idle + (turn - Math.min(tr, 1) * 0.35) * (1 - e);
      const targetX = (animate ? Math.sin(t * 0.27) * 0.06 - p.y * 0.14 : 0.08) + Math.sin(leg * Math.PI) * 0.25;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetY, 3, delta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetX, 3, delta);
      root.current.position.y = animate ? Math.sin(t * 0.8) * 0.05 : 0;
    }
    if (orbit.current && animate) orbit.current.rotation.z += delta * 0.1;

    // Scroll-driven separation (explode ref, 0 → 1) + service focus glow
    if (frame.current) {
      frame.current.children.forEach((child, i) => {
        const dir = built.frameParts[i]?.dir;
        if (!dir) return;
        const h = THREE.MathUtils.damp(highlight.current[i] ?? 0, f === i ? 1 : 0, 6, delta);
        highlight.current[i] = h;
        const id = built.frameParts[i].id as keyof typeof ASSEMBLY_START;
        const loose = 1 - placed(ASSEMBLY_START[id] ?? 0);
        const out = e * 0.5 + h * (0.08 + e * 0.2) + loose * 0.85;
        child.position.set(dir.x * out, dir.y * out, -e * 0.25 + h * 0.18 - loose * 0.5);
        // Modules tilt open like panels as they separate / before assembly.
        const tilt = e * 0.35 + loose * 0.9;
        child.rotation.set(-dir.y * tilt, dir.x * tilt, loose * 0.4);
        const mat = segmentMaterials[i];
        if (mat) mat.emissiveIntensity = h * 0.9;
      });
    }
    const coreLoose = 1 - placed(ASSEMBLY_START.core);
    if (core.current) {
      core.current.position.z = e * 0.6 + coreLoose * 0.9;
      core.current.scale.setScalar(1 - coreLoose * 0.35);
      core.current.rotation.z = coreLoose * -0.5;
    }
    if (glass.current) glass.current.scale.setScalar(0.4 + 0.6 * placed(ASSEMBLY_START["top-left"]));
    if (circuits.current) {
      const c = placed(ASSEMBLY_START.circuits);
      circuits.current.scale.setScalar((1 + e * 0.25) * (0.35 + 0.65 * c));
      circuits.current.visible = c > 0.02;
    }
    if (orbit.current) {
      const o = placed(ASSEMBLY_START.orbit);
      orbit.current.scale.setScalar(0.6 + 0.4 * o);
      orbit.current.visible = o > 0.02;
    }
  });

  return (
    <group ref={root} dispose={null}>
      <mesh ref={glass} geometry={built.glassGeo} material={materials.glass} position={[0, 0, -0.09]} />

      {/* Segmented hexagonal frame */}
      <group ref={frame}>
        {built.frameParts.map((part, i) => (
          <group key={part.id}>
            <mesh geometry={part.geo} material={segmentMaterials[i]} />
          </group>
        ))}
      </group>

      {/* Circuit traces, rings and nodes */}
      <group ref={circuits}>
        {built.traceParts.map((t) =>
          t.parts.map((part, i) => (
            <mesh key={`${t.id}-${i}`} geometry={part.geo} material={materials.trace[t.tone]} position={part.position} />
          )),
        )}
      </group>

      {/* "A" monogram + crossbar */}
      <group ref={core}>
        <mesh geometry={built.aGeo} material={materials.monogram} />
        <mesh geometry={built.barGeo} material={materials.monogram} />
      </group>

      {/* Orbital modules */}
      <group ref={orbit} rotation={[0.4, 0, 0]}>
        <mesh material={materials.orbitLine}>
          <torusGeometry args={[1.45, 0.003, 6, 180]} />
        </mesh>
        {orbitals.map((o, i) => (
          <mesh key={i} geometry={built.moduleGeo} material={materials.module} position={o.position} scale={o.scale} />
        ))}
      </group>
    </group>
  );
}
