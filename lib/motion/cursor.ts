// Curseur (C11) : le curseur natif est conservé. Sur desktop uniquement (pointeur fin), un point or de 6px le
// suit avec un léger retard (lerp 0.18) et devient un anneau argent de 32px au survol d'un élément cliquable.
// Masqué sur tactile et en reduced motion. Transform et opacité uniquement.

import { prefersReducedMotion } from "./env";
import { gsap } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const LERP = 0.18;
const CLICKABLE = "a[href], button, [role='button'], input, select, textarea, summary, label[for]";
const RING_FROM = 6 / 32; // l'anneau naît à la taille du point

export function createCursor(): MotionModule {
  let el: HTMLElement | null = null;
  const cleanups: (() => void)[] = [];

  return {
    init() {
      if (prefersReducedMotion() || !window.matchMedia(HOVER_QUERY).matches) return;
      const t = tokens();
      el = document.createElement("div");
      el.className = "cursor";
      el.setAttribute("aria-hidden", "true");
      const dot = document.createElement("span");
      dot.className = "cursor__dot";
      const ring = document.createElement("span");
      ring.className = "cursor__ring";
      el.append(dot, ring);
      document.body.append(el);
      gsap.set(ring, { scale: RING_FROM });

      const cursor = el;
      const target = { x: -100, y: -100 };
      const pos = { x: -100, y: -100 };
      let visible = false;
      let hovering = false;

      // Lerp indépendant de la cadence d'affichage (0.18 par image à 60 fps).
      const tick = (_time: number, delta: number) => {
        const k = 1 - Math.pow(1 - LERP, delta / (1000 / 60));
        pos.x += (target.x - pos.x) * k;
        pos.y += (target.y - pos.y) * k;
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      };
      gsap.ticker.add(tick);

      const setHover = (value: boolean) => {
        if (value === hovering) return;
        hovering = value;
        gsap.to(dot, { opacity: value ? 0 : 1, duration: t.dur.micro, ease: t.ease.in, overwrite: true });
        gsap.to(ring, { opacity: value ? 1 : 0, scale: value ? 1 : RING_FROM, duration: t.dur.micro, ease: t.ease.in, overwrite: true });
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        target.x = e.clientX;
        target.y = e.clientY;
        if (!visible) {
          visible = true;
          pos.x = target.x;
          pos.y = target.y;
          gsap.to(cursor, { opacity: 1, duration: t.dur.micro, ease: t.ease.in });
        }
        setHover(e.target instanceof Element && !!e.target.closest(CLICKABLE));
      };
      const onLeave = () => {
        visible = false;
        gsap.to(cursor, { opacity: 0, duration: t.dur.micro, ease: t.ease.in });
      };
      document.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        document.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf([cursor, dot, ring]);
      });
    },

    destroy() {
      cleanups.splice(0).forEach((fn) => fn());
      el?.remove();
      el = null;
    },
  };
}
