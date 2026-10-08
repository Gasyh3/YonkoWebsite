// Scène Manifeste (C3) : « Être vu. Être trouvé. Être efficace. »
// - Les fibres A, B, C passent derrière leurs lignes (ancres data-fiber-axis="x", la ligne les laisse traverser).
// - Chaque ligne, d'abord argent à 25 %, s'allume lettre par lettre dans le sens de sa fibre quand l'impulsion
//   l'atteint (fiber:arrive) : dégradé or pour A et B, argent clair pour C.
// - Une fois les 3 lignes allumées, le paragraphe se révèle par lignes.
// - Pas de pin. Lecture garantie même en scroll rapide : passé 60 % de la section, tout est allumé.
// - Reduced motion : tout est allumé d'emblée, aucun mouvement.

import type { FiberArriveDetail } from "./fiber/fiber-system";
import { debounce, prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

type Line = {
  anchorId: string;
  lit: HTMLElement;
  chars: HTMLElement[];
  done: boolean;
};

export function createManifestoScene(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  const splits: SplitText[] = [];
  let onArrive: ((event: CustomEvent<FiberArriveDetail>) => void) | null = null;
  let onResize: (ReturnType<typeof debounce> & (() => void)) | null = null;
  let destroyed = false;

  return {
    init() {
      const lineEls = [...root.querySelectorAll<HTMLElement>("[data-manifesto-line]")];
      const paragraph = root.querySelector<HTMLElement>("[data-manifesto-paragraph]");

      if (prefersReducedMotion()) {
        root.classList.add("is-lit");
        return;
      }

      const t = tokens();
      // Découpe après chargement des polices (positions des lettres exactes).
      document.fonts.ready.then(() => {
        if (destroyed) return;
        ctx = gsap.context(() => build(), root);
      });

      const build = () => {
        // Découpe en lettres ; le dégradé est recalé lettre par lettre pour rester continu sur la ligne.
        const lines: Line[] = lineEls.map((el) => {
          const lit = el.querySelector<HTMLElement>("[data-manifesto-lit]")!;
          const split = SplitText.create(lit, { type: "chars", charsClass: "manifesto-char" });
          splits.push(split);
          const chars = split.chars as HTMLElement[];
          return { anchorId: el.dataset.manifestoLine ?? "", lit, chars, done: false };
        });
        const alignGradient = () => {
          lines.forEach(({ lit, chars }) => {
            const width = lit.offsetWidth;
            chars.forEach((char) => {
              char.style.backgroundSize = `${width}px 100%`;
              char.style.backgroundPosition = `${-char.offsetLeft}px 0`;
            });
          });
        };
        alignGradient();
        onResize = debounce(alignGradient, 150);
        window.addEventListener("resize", onResize);
        root.classList.add("is-split");
        lines.forEach((line) => gsap.set(line.chars, { opacity: 0 }));

        let paragraphShown = false;
        const showParagraph = () => {
          if (paragraphShown || !paragraph) return;
          paragraphShown = true;
          ctx?.add(() => {
            const split = SplitText.create(paragraph, { type: "lines", mask: "lines" });
            splits.push(split);
            gsap.set(paragraph, { visibility: "visible" });
            gsap.from(split.lines, { yPercent: 100, duration: t.dur.reveal, ease: t.ease.in, stagger: t.stagger, delay: 0.15 });
          });
        };
        if (paragraph) gsap.set(paragraph, { visibility: "hidden" });

        const light = (line: Line, direction: "ltr" | "rtl" = "ltr") => {
          if (line.done) return; // fiber:arrive peut revenir (respiration) : idempotent
          line.done = true;
          gsap.to(line.chars, {
            opacity: 1,
            duration: t.dur.reveal,
            ease: t.ease.in,
            stagger: { each: 0.02, from: direction === "rtl" ? "end" : "start" },
          });
          if (lines.every((l) => l.done)) showParagraph();
        };

        onArrive = (event: CustomEvent<FiberArriveDetail>) => {
          const line = lines.find((l) => l.anchorId === event.detail.anchorId);
          if (line) light(line, event.detail.direction);
        };
        window.addEventListener("fiber:arrive", onArrive);

        // Filet de lecture : passé 60 % de la section, tout s'allume (scroll rapide, fibres hors champ).
        const lightAll = () => lines.forEach((l) => light(l));
        const st = ScrollTrigger.create({ trigger: root, start: "60% bottom", onEnter: lightAll });
        if (st.scroll() > st.start) lightAll();
      };
    },

    destroy() {
      destroyed = true;
      if (onArrive) window.removeEventListener("fiber:arrive", onArrive);
      onArrive = null;
      if (onResize) {
        onResize.cancel();
        window.removeEventListener("resize", onResize);
      }
      onResize = null;
      splits.forEach((s) => s.revert());
      splits.length = 0;
      ctx?.revert();
      ctx = null;
      root.classList.remove("is-lit", "is-split");
    },
  };
}
