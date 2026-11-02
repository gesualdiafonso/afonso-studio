"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { designTokens } from "@/config/design";
import { readToken } from "@/lib/tokens";
import { ACorePlaceholder, type ACoreColors } from "./a-core-placeholder";

export interface ACoreCanvasProps {
  /** Idle animation. False → renders on demand only (reduced motion). */
  animate?: boolean;
  /** False pauses rendering (e.g. the stage is off screen). */
  active?: boolean;
  /** 0…n travel progress between anchors, read every frame (no re-render). */
  travel?: React.RefObject<number>;
  /** 0…1 module separation, read every frame. */
  explode?: React.RefObject<number>;
  /** Highlighted module index, read every frame. */
  focus?: React.RefObject<number>;
  /** Process assembly (-1 off, 0…5 stages), read every frame. */
  assembly?: React.RefObject<number>;
  onReady?: () => void;
  className?: string;
}

/**
 * Local canvas for the A-CORE placeholder.
 * - Renders only while on screen (frameloop "never" when off screen).
 * - Procedural studio lighting (no HDR download).
 * - Capped DPR for performance.
 * Loaded with next/dynamic (ssr: false) — never part of the initial bundle.
 */
export default function ACoreCanvas({
  animate = true,
  active = true,
  travel,
  explode,
  focus,
  assembly,
  onReady,
  className,
}: ACoreCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  const colors = useMemo<ACoreColors & { canvas: string }>(
    () => ({
      metal: readToken(designTokens.fx.metal) || "#c7d2dd",
      metalDark: readToken(designTokens.fx.metalDark) || "#3a4652",
      blue: readToken(designTokens.brand.blue) || "#007bff",
      cyan: readToken(designTokens.brand.cyan) || "#00ccff",
      glass: readToken(designTokens.fx.glass) || "#00ccff1f",
      emissive: readToken(designTokens.fx.emissive) || "#00ff99",
      canvas: readToken(designTokens.surface.panelMuted) || "#e9eff4",
    }),
    [],
  );

  // Pause the render loop when the hero leaves the viewport.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Subtle pointer tilt (desktop pointer only).
  useEffect(() => {
    if (!animate || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  return (
    <div ref={container} className={className}>
      <Canvas
        frameloop={!visible || !active ? "never" : animate ? "always" : "demand"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.1], fov: 32 }}
        flat
        // The stage scales this canvas with a CSS transform: measure the
        // layout size (offsetWidth), not the transformed rect, and skip
        // scroll re-measuring (the stage moves it every scroll frame).
        resize={{ offsetSize: true, scroll: false }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => onReady?.()}
        aria-hidden
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, 2]} intensity={0.5} color={colors.cyan} />

        <ACorePlaceholder
          colors={colors}
          animate={animate}
          pointer={pointer}
          travel={travel}
          explode={explode}
          focus={focus}
          assembly={assembly}
        />

        <Environment resolution={256} frames={1}>
          {/* Light studio backdrop so satin metal reflects the ice-white interface */}
          <color attach="background" args={[colors.canvas]} />
          <Lightformer form="rect" intensity={3} position={[0, 3, 3]} scale={[6, 1.2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2.2} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} color={colors.blue} />
          <Lightformer form="rect" intensity={1.6} position={[4, -1, 2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} color={colors.cyan} />
          <Lightformer form="ring" intensity={0.8} position={[0, -3, -2]} scale={2} color={colors.emissive} />
        </Environment>
      </Canvas>
    </div>
  );
}
