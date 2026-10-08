"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { AmbientNetwork } from "@/lib/motion/fiber/ambient-network";
import { FiberSystem } from "@/lib/motion/fiber/fiber-system";
import "@/lib/motion/fiber/fiber.css";

type Props = {
  children: ReactNode;
  className?: string;
  // Affiche obstacles, ancres et collisions (page de démo).
  debug?: boolean;
};

// Scène des fibres : enveloppe la page, porte le calque SVG sous le contenu.
// Les sections posent leurs ancres [data-fiber-anchor] et écoutent "fiber:arrive".
// Les sections [data-ambient] reçoivent en plus le réseau secondaire des marges (AmbientNetwork).
export function FiberStage({ children, className, debug = false }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;
    FiberSystem.init(stage, layer);
    AmbientNetwork.init(stage, layer);
    return () => {
      AmbientNetwork.destroy();
      FiberSystem.destroy();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={className ? `fiber-stage ${className}` : "fiber-stage"}
      data-fiber-stage=""
      data-fiber-debug={debug ? "" : undefined}
    >
      <div ref={layerRef} className="fiber-layer" aria-hidden="true" />
      <div className="fiber-stage__content">{children}</div>
    </div>
  );
}
