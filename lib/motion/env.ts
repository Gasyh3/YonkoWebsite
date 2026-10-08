export const MOBILE_MAX_WIDTH = 767;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`;

const matches = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

export const prefersReducedMotion = () => matches(REDUCED_QUERY);
export const isMobile = () => matches(MOBILE_QUERY);
export const isTouch = () => matches("(hover: none) and (pointer: coarse)");

// Abonnement aux changements de préférence de mouvement ; renvoie la fonction de désabonnement.
export function onReducedMotionChange(callback: (reduced: boolean) => void) {
  const mql = window.matchMedia(REDUCED_QUERY);
  const listener = (event: MediaQueryListEvent) => callback(event.matches);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}

export function debounce<T extends unknown[]>(fn: (...args: T) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
