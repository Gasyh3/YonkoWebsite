// Les tracés se calculent sur la mise en page au repos : les transformations posées par les animations
// (sortie du hero au scroll, révélations…) sont neutralisées le temps de la mesure, synchrone, donc invisible.
export function measureAtRest<T>(scope: HTMLElement, measure: () => T): T {
  const moved = [...scope.querySelectorAll<HTMLElement | SVGElement>("[style*='transform']")].filter(
    (el) => !el.closest(".fiber-layer"),
  );
  const saved = moved.map((el) => el.style.transform);
  moved.forEach((el) => {
    el.style.transform = "none";
  });
  try {
    return measure();
  } finally {
    moved.forEach((el, i) => {
      el.style.transform = saved[i];
    });
  }
}
