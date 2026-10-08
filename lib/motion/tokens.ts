// Lecture des tokens motion depuis les variables CSS de app/globals.css (source unique).
// Les valeurs de repli ne servent qu'avant le chargement du CSS ou côté serveur.

export type MotionTokens = {
  ease: { in: string; transition: string; breath: string };
  dur: { micro: number; reveal: number; major: number };
  stagger: number;
};

const FALLBACK: MotionTokens = {
  ease: { in: "expo.out", transition: "power3.inOut", breath: "sine.inOut" },
  dur: { micro: 0.3, reveal: 0.7, major: 1.2 },
  stagger: 0.06,
};

let cache: MotionTokens | null = null;

const readVar = (style: CSSStyleDeclaration, name: string) =>
  style.getPropertyValue(name).trim();

const seconds = (raw: string, fallback: number) => {
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  return raw.endsWith("ms") ? value / 1000 : value;
};

export function tokens(): MotionTokens {
  if (cache) return cache;
  if (typeof window === "undefined") return FALLBACK;

  const style = getComputedStyle(document.documentElement);
  const ease = (name: string, fallback: string) => readVar(style, name) || fallback;

  cache = {
    ease: {
      in: ease("--ease-in", FALLBACK.ease.in),
      transition: ease("--ease-transition", FALLBACK.ease.transition),
      breath: ease("--ease-breath", FALLBACK.ease.breath),
    },
    dur: {
      micro: seconds(readVar(style, "--dur-micro"), FALLBACK.dur.micro),
      reveal: seconds(readVar(style, "--dur-reveal"), FALLBACK.dur.reveal),
      major: seconds(readVar(style, "--dur-major"), FALLBACK.dur.major),
    },
    stagger: seconds(readVar(style, "--stagger"), FALLBACK.stagger),
  };
  return cache;
}
