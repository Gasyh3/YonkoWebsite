"use client";

import { useEffect, useState } from "react";

import { type FiberArriveDetail, type FiberId, FiberSystem } from "@/lib/motion/fiber/fiber-system";

const FIBER_IDS: FiberId[] = ["A", "B", "C"];

// Panneau de test du FiberSystem : journal des "fiber:arrive" et appels d'API.
export function FiberLabHud() {
  const [events, setEvents] = useState<(FiberArriveDetail & { t: number })[]>([]);
  const [lit, setLit] = useState<Record<FiberId, boolean>>({ A: false, B: false, C: false });
  const [collisions, setCollisions] = useState<number | null>(null);

  useEffect(() => {
    const onArrive = (event: CustomEvent<FiberArriveDetail>) =>
      setEvents((list) => [{ ...event.detail, t: Date.now() }, ...list].slice(0, 6));
    window.addEventListener("fiber:arrive", onArrive);
    const timer = setInterval(() => setCollisions(FiberSystem.debug().collisions.length), 1000);
    return () => {
      window.removeEventListener("fiber:arrive", onArrive);
      clearInterval(timer);
    };
  }, []);

  const toggle = (fiber: FiberId) => {
    const next = !lit[fiber];
    FiberSystem.setLit(fiber, next);
    setLit({ ...lit, [fiber]: next });
  };

  return (
    <aside className="fixed bottom-4 left-4 z-50 w-72 rounded-lg border border-border bg-surface p-4 text-xs text-text">
      <p className="mb-2 font-medium text-silver-light">
        FiberSystem · {collisions === null ? "…" : `${collisions} collision(s) texte`}
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {FIBER_IDS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toggle(f)}
            className="rounded border border-border px-2 py-1 hover:border-silver"
            aria-pressed={lit[f]}
          >
            {lit[f] ? "Éteindre" : "Allumer"} {f}
          </button>
        ))}
        <button
          type="button"
          onClick={() => FiberSystem.pulse("A", "hero-out", "contact-cta", 2.4)}
          className="rounded border border-border px-2 py-1 hover:border-silver"
        >
          Impulsion A → contact
        </button>
      </div>
      <ol className="space-y-1">
        {events.length === 0 ? <li>Scrollez : les arrivées s&apos;affichent ici.</li> : null}
        {events.map((e) => (
          <li key={`${e.t}-${e.fiber}-${e.anchorId}`}>
            <span className="text-silver-light">{e.fiber}</span> → {e.anchorId}{" "}
            <span className="text-silver">({e.mode})</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
