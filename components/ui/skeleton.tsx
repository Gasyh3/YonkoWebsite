"use client";

import Image, { type ImageProps } from "next/image";
import type { HTMLAttributes, SyntheticEvent } from "react";

import { cn } from "@/lib/utils";

// Composant fantôme : bloc --surface traversé par un reflet argent très léger (voir .skeleton, globals.css).
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-md", className)} aria-hidden="true" {...props} />;
}

// Image posée dans un conteneur .skeleton : invisible jusqu'à son chargement, puis fondu ; le squelette s'arrête.
export function SkeletonImage({ onLoad, ...props }: ImageProps) {
  const loaded = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.closest(".skeleton")?.setAttribute("data-loaded", "");
    onLoad?.(event);
  };
  // eslint-disable-next-line jsx-a11y/alt-text -- alt fourni par l'appelant via props
  return <Image data-skeleton-media="" {...props} onLoad={loaded} />;
}
