import Link from "next/link";
import type { ComponentProps } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";
import { cn } from "@/lib/utils";

type LinkProps = ComponentProps<typeof Link>;

// Action principale : dégradé or, texte noir mat, effet magnétique et reflet (micro-interactions C11).
export function PrimaryButton({ className, children, ...props }: LinkProps) {
  return (
    <Link
      data-magnetic=""
      className={cn("btn-primary relative inline-flex h-12 items-center rounded-full px-6 text-sm font-medium", className)}
      {...props}
    >
      <ButtonGlint />
      <span className="relative">{children}</span>
    </Link>
  );
}

// Action secondaire : contour argent.
export function GhostButton({ className, children, ...props }: LinkProps) {
  return (
    <Link
      data-magnetic=""
      className={cn(
        "relative inline-flex h-12 items-center rounded-full border border-silver px-6 text-sm text-silver-light",
        className,
      )}
      {...props}
    >
      <ButtonGlint />
      <span className="relative">{children}</span>
    </Link>
  );
}
