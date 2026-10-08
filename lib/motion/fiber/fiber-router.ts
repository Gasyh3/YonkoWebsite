// Calcul des tracés des 3 fibres (géométrie pure, sans DOM ni GSAP).
// Grammaire « cable management » : segments verticaux / horizontaux, 45° autorisé,
// coudes arrondis, fibres parallèles à écart constant quand elles voyagent ensemble.

export type FiberId = "A" | "B" | "C";
export const FIBERS: readonly FiberId[] = ["A", "B", "C"];

export type AnchorMode = "pass" | "plug" | "end";
export type AnchorAxis = "point" | "x" | "y";

export type Vec = { x: number; y: number };
export type Rect = { left: number; top: number; right: number; bottom: number };

export type AnchorSpec = {
  id: string;
  fibers: FiberId[];
  mode: AnchorMode;
  axis: AnchorAxis;
  rect: Rect;
};

export type RouteInput = {
  width: number;
  height: number;
  mobile: boolean;
  origins: Record<FiberId, Vec>;
  anchors: AnchorSpec[];
  obstacles: Rect[];
  splitRegions: Rect[];
};

// Point où une impulsion « arrive » à une ancre, sur le tracé qui la porte (carrier).
export type ArrivalMarker = {
  fiber: FiberId;
  carrier: FiberId;
  anchorId: string;
  mode: AnchorMode;
  point: Vec;
};

export type Collision = { fiber: FiberId; segment: [Vec, Vec]; obstacle: Rect };

export type RouteResult = {
  paths: Record<FiberId, string>;
  polylines: Record<FiberId, Vec[][]>;
  markers: ArrivalMarker[];
  collisions: Collision[];
};

export const ROUTING = {
  radius: 24, // rayon de coude de référence
  gap: 14, // écart entre fibres parallèles
  mobileX: 20, // fibre composite mobile : distance au bord gauche
  obstaclePadding: 10, // marge de sécurité autour des blocs de texte
  candidateStep: 8, // pas de recherche du niveau de croisement horizontal
} as const;

const OFFSET: Record<FiberId, number> = { A: -ROUTING.gap, B: 0, C: ROUTING.gap };
const DIAG_SHIFT = ROUTING.gap * (Math.SQRT2 - 1); // garde 14px perpendiculaires sur un 45°

// ---------------------------------------------------------------------------
// Vecteurs et collisions

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const cross = (a: Vec, b: Vec) => a.x * b.y - a.y * b.x;
const length = (a: Vec) => Math.hypot(a.x, a.y);
const normalize = (a: Vec): Vec => {
  const l = length(a);
  return l === 0 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l };
};
const same = (a: Vec, b: Vec, eps = 0.5) => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;

const inflate = (r: Rect, m: number): Rect => ({
  left: r.left - m,
  top: r.top - m,
  right: r.right + m,
  bottom: r.bottom + m,
});

// Liang–Barsky : le segment [p, q] coupe-t-il le rectangle ?
function segmentHitsRect(p: Vec, q: Vec, r: Rect) {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  let t0 = 0;
  let t1 = 1;
  const clip = (pp: number, qq: number) => {
    if (pp === 0) return qq >= 0;
    const t = qq / pp;
    if (pp < 0) {
      if (t > t1) return false;
      if (t > t0) t0 = t;
    } else {
      if (t < t0) return false;
      if (t < t1) t1 = t;
    }
    return true;
  };
  return (
    clip(-dx, p.x - r.left) &&
    clip(dx, r.right - p.x) &&
    clip(-dy, p.y - r.top) &&
    clip(dy, r.bottom - p.y) &&
    t0 <= t1
  );
}

function countHits(points: Vec[], obstacles: Rect[]) {
  let hits = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p = points[i];
    const q = points[i + 1];
    const top = Math.min(p.y, q.y);
    const bottom = Math.max(p.y, q.y);
    for (const o of obstacles) {
      if (o.bottom < top || o.top > bottom) continue;
      if (segmentHitsRect(p, q, o)) hits++;
    }
  }
  return hits;
}

// Distance verticale libre au-dessus / au-dessous d'un passage horizontal.
function clearance(y: number, x1: number, x2: number, obstacles: Rect[], cap = 160) {
  const left = Math.min(x1, x2);
  const right = Math.max(x1, x2);
  let best = cap;
  for (const o of obstacles) {
    if (o.right < left || o.left > right) continue;
    const d = y < o.top ? o.top - y : y > o.bottom ? y - o.bottom : 0;
    if (d < best) best = d;
  }
  return best;
}

// ---------------------------------------------------------------------------
// Nœuds de passage par fibre (dans l'ordre de la page)

type Node = { point: Vec; key: string };

type Leg = { fiber: FiberId; from: Node; to: Node };

type FiberPlan = {
  nodes: Node[];
  runs: Map<string, Vec[]>; // trajet interne d'une ancre (entrée → sortie), par clé de nœud d'entrée
  ended: boolean;
};

const center = (r: Rect): Vec => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });

function planNodes(input: RouteInput) {
  const plans = {} as Record<FiberId, FiberPlan>;
  for (const f of FIBERS) {
    plans[f] = { nodes: [{ point: input.origins[f], key: "origin" }], runs: new Map(), ended: false };
  }
  const markers: ArrivalMarker[] = [];

  input.anchors.forEach((anchor, index) => {
    const fibers = anchor.fibers.filter((f) => !plans[f].ended);
    if (!fibers.length) return;
    const grouped = fibers.length > 1;
    const c = center(anchor.rect);
    const lastX = (f: FiberId) => plans[f].nodes[plans[f].nodes.length - 1].point.x;
    const meanPrevX = fibers.reduce((s, f) => s + lastX(f), 0) / fibers.length;
    const key = `anchor-${index}`;

    for (const f of fibers) {
      const o = grouped ? OFFSET[f] : 0;
      let entry: Vec;
      let exit: Vec | null = null;

      if (anchor.axis === "x") {
        // Passage horizontal sur toute la largeur de l'ancre, entré par le côté le plus proche.
        // Décalage x systématique : les fibres qui descendent ensemble gardent leur couloir de 14px.
        const rightward = meanPrevX <= c.x;
        const yo = rightward ? -o : o; // ordre des rails choisi pour qu'aucune fibre n'en croise une autre
        const xo = OFFSET[f];
        entry = { x: (rightward ? anchor.rect.left : anchor.rect.right) + xo, y: c.y + yo };
        exit = { x: (rightward ? anchor.rect.right : anchor.rect.left) + xo, y: c.y + yo };
      } else if (anchor.axis === "y") {
        entry = { x: c.x + o, y: anchor.rect.top };
        exit = { x: c.x + o, y: anchor.rect.bottom };
      } else {
        entry = { x: c.x + o, y: c.y };
      }

      const node: Node = { point: entry, key };
      plans[f].nodes.push(node);
      if (exit && !same(exit, entry)) {
        plans[f].runs.set(key, [entry, exit]);
        plans[f].nodes.push({ point: exit, key: `${key}-exit` });
      }
      markers.push({ fiber: f, carrier: f, anchorId: anchor.id, mode: anchor.mode, point: entry });
      if (anchor.mode === "end") plans[f].ended = true;
    }
  });

  // Sans terminus, une fibre poursuit sa descente jusqu'au bas de la scène (sections pas encore câblées).
  for (const f of FIBERS) {
    const plan = plans[f];
    const last = plan.nodes[plan.nodes.length - 1];
    if (!plan.ended && plan.nodes.length > 1 && last.point.y < input.height - 1) {
      plan.nodes.push({ point: { x: last.point.x, y: input.height - 1 }, key: "tail" });
    }
  }

  return { plans, markers };
}

// ---------------------------------------------------------------------------
// Routage d'un tronçon partagé par une ou plusieurs fibres

// prefer "clear" : passage le plus dégagé ; "early" : premier passage sans collision.
function routeGroup(legs: Leg[], obstacles: Rect[], prefer: "clear" | "early" = "clear"): Map<FiberId, Vec[]> {
  const { radius, gap, candidateStep } = ROUTING;
  const result = new Map<FiberId, Vec[]>();

  const movers = legs.filter((l) => Math.abs(l.to.point.x - l.from.point.x) >= 1);
  for (const l of legs) {
    if (!movers.includes(l)) result.set(l.fiber, [l.from.point, { x: l.from.point.x, y: l.to.point.y }]);
  }
  if (!movers.length) return result;

  // Rang d'imbrication : vers la droite, la fibre la plus à droite tourne la première (plus haut) ; inversement.
  const right = movers.filter((l) => l.to.point.x > l.from.point.x).sort((a, b) => b.to.point.x - a.to.point.x);
  const left = movers.filter((l) => l.to.point.x < l.from.point.x).sort((a, b) => a.to.point.x - b.to.point.x);
  const rank = new Map<Leg, number>();
  right.forEach((l, i) => rank.set(l, i));
  left.forEach((l, i) => rank.set(l, i));

  const sideCount = (l: Leg) => (right.includes(l) ? right.length : left.length);
  const isDiag = (l: Leg) =>
    Math.abs(l.to.point.x - l.from.point.x) < 2 * radius + gap * (sideCount(l) - 1) + 4;
  const shiftOf = (l: Leg) => (rank.get(l) ?? 0) * (isDiag(l) ? DIAG_SHIFT : gap);

  const build = (base: number) =>
    movers.map((l) => {
      const P = l.from.point;
      const Q = l.to.point;
      const j = base + shiftOf(l);
      const pts = isDiag(l)
        ? [P, { x: P.x, y: j }, { x: Q.x, y: j + Math.abs(Q.x - P.x) }, Q]
        : [P, { x: P.x, y: j }, { x: Q.x, y: j }, Q];
      return { leg: l, pts, j };
    });

  const maxShift = Math.max(...movers.map(shiftOf));
  const maxDiag = Math.max(0, ...movers.filter(isDiag).map((l) => Math.abs(l.to.point.x - l.from.point.x)));
  const lo = Math.max(...movers.map((l) => l.from.point.y)) + radius;
  const hi = Math.min(...movers.map((l) => l.to.point.y)) - radius - maxShift - maxDiag;

  let bestBase = lo;
  if (hi <= lo) {
    bestBase = (lo + hi) / 2;
  } else {
    const mid = (lo + hi) / 2;
    const step = Math.max(candidateStep, (hi - lo) / 400);
    let bestScore = Infinity;
    for (let base = lo; base <= hi + 0.01; base += step) {
      const built = build(base);
      let hits = 0;
      let clear = Infinity;
      for (const b of built) {
        hits += countHits(b.pts, obstacles);
        const yProbe = isDiag(b.leg) ? b.j + Math.abs(b.leg.to.point.x - b.leg.from.point.x) / 2 : b.j;
        clear = Math.min(clear, clearance(yProbe, b.leg.from.point.x, b.leg.to.point.x, obstacles));
      }
      const score =
        prefer === "early" ? hits * 1e5 + (base - lo) * 0.01 : hits * 1e5 - clear + Math.abs(base - mid) * 0.01;
      if (score < bestScore) {
        bestScore = score;
        bestBase = base;
      }
    }
  }

  for (const b of build(bestBase)) result.set(b.leg.fiber, b.pts);
  return result;
}

// ---------------------------------------------------------------------------
// Coudes arrondis (rayon concentrique quand des fibres parallèles tournent ensemble)

type Corner = { fiber: FiberId; at: Vec; inDir: Vec; outDir: Vec };

function cleanPolyline(points: Vec[]) {
  const out: Vec[] = [];
  for (const p of points) {
    if (out.length && same(out[out.length - 1], p)) continue;
    out.push(p);
  }
  // Supprime les points intermédiaires alignés.
  for (let i = out.length - 2; i >= 1; i--) {
    const u = normalize(sub(out[i], out[i - 1]));
    const v = normalize(sub(out[i + 1], out[i]));
    if (Math.abs(cross(u, v)) < 1e-3 && dot(u, v) > 0) out.splice(i, 1);
  }
  return out;
}

function cornerRadii(polylines: Record<FiberId, Vec[][]>) {
  const corners: Corner[] = [];
  for (const f of FIBERS) {
    for (const line of polylines[f]) {
      for (let i = 1; i < line.length - 1; i++) {
        corners.push({
          fiber: f,
          at: line[i],
          inDir: normalize(sub(line[i], line[i - 1])),
          outDir: normalize(sub(line[i + 1], line[i])),
        });
      }
    }
  }
  const radii = new Map<Vec, number>();
  const reach = ROUTING.gap * 2 * Math.SQRT2 + 4;
  for (const c of corners) {
    const inner = normalize(sub(c.outDir, c.inDir));
    let k = 0;
    for (const o of corners) {
      if (o.fiber === c.fiber) continue;
      if (dot(o.inDir, c.inDir) < 0.99 || dot(o.outDir, c.outDir) < 0.99) continue;
      const d = sub(o.at, c.at);
      if (length(d) > reach) continue;
      if (dot(d, inner) > 1) k++;
    }
    radii.set(c.at, ROUTING.radius + ROUTING.gap * k);
  }
  return radii;
}

const fmt = (n: number) => Math.round(n * 100) / 100;

function toPath(line: Vec[], radii: Map<Vec, number>, fallbackRadius: number = ROUTING.radius) {
  if (line.length < 2) return "";
  let d = `M${fmt(line[0].x)} ${fmt(line[0].y)}`;
  for (let i = 1; i < line.length - 1; i++) {
    const prev = line[i - 1];
    const c = line[i];
    const next = line[i + 1];
    const u = normalize(sub(c, prev));
    const v = normalize(sub(next, c));
    const theta = Math.acos(Math.max(-1, Math.min(1, dot(u, v))));
    if (theta < 1e-3) continue;
    const tanHalf = Math.tan(theta / 2);
    const lenIn = length(sub(c, prev)) * (i - 1 === 0 ? 1 : 0.5);
    const lenOut = length(sub(next, c)) * (i + 1 === line.length - 1 ? 1 : 0.5);
    const t = Math.min((radii.get(c) ?? fallbackRadius) * tanHalf, lenIn, lenOut);
    const r = t / tanHalf;
    const a = sub(c, scale(u, t));
    const b = add(c, scale(v, t));
    const sweep = cross(u, v) > 0 ? 1 : 0;
    d += `L${fmt(a.x)} ${fmt(a.y)}A${fmt(r)} ${fmt(r)} 0 0 ${sweep} ${fmt(b.x)} ${fmt(b.y)}`;
  }
  const last = line[line.length - 1];
  return `${d}L${fmt(last.x)} ${fmt(last.y)}`;
}

function collectCollisions(polylines: Record<FiberId, Vec[][]>, obstacles: Rect[]) {
  const collisions: Collision[] = [];
  for (const f of FIBERS) {
    for (const line of polylines[f]) {
      for (let i = 0; i < line.length - 1; i++) {
        for (const o of obstacles) {
          if (segmentHitsRect(line[i], line[i + 1], o)) {
            collisions.push({ fiber: f, segment: [line[i], line[i + 1]], obstacle: o });
          }
        }
      }
    }
  }
  return collisions;
}

function finish(polylines: Record<FiberId, Vec[][]>, markers: ArrivalMarker[], obstacles: Rect[]): RouteResult {
  for (const f of FIBERS) polylines[f] = polylines[f].map(cleanPolyline).filter((l) => l.length > 1);
  const radii = cornerRadii(polylines);
  const paths = {} as Record<FiberId, string>;
  for (const f of FIBERS) paths[f] = polylines[f].map((l) => toPath(l, radii)).join("");
  return { paths, polylines, markers, collisions: collectCollisions(polylines, obstacles) };
}

// ---------------------------------------------------------------------------
// Desktop : 3 fibres routées d'ancre en ancre

function routeDesktop(input: RouteInput, obstacles: Rect[]): RouteResult {
  const { plans, markers } = planNodes(input);

  // Tronçons routés ensemble quand ils partent d'une même ancre (embranchement)
  // ou arrivent à une même ancre (convergence) : l'imbrication évite tout croisement.
  const legs: Leg[] = [];
  for (const f of FIBERS) {
    const nodes = plans[f].nodes;
    for (let i = 0; i < nodes.length - 1; i++) {
      if (plans[f].runs.has(nodes[i].key)) continue; // trajet interne d'une ancre, pas de routage
      legs.push({ fiber: f, from: nodes[i], to: nodes[i + 1] });
    }
  }
  const parent = legs.map((_, i) => i);
  const findRoot = (i: number): number => (parent[i] === i ? i : (parent[i] = findRoot(parent[i])));
  const byKey = new Map<string, number>();
  legs.forEach((leg, i) => {
    for (const key of [`from:${leg.from.key}`, `to:${leg.to.key}`]) {
      const j = byKey.get(key);
      if (j === undefined) byKey.set(key, i);
      else parent[findRoot(i)] = findRoot(j);
    }
  });
  const groups = new Map<number, Leg[]>();
  legs.forEach((leg, i) => groups.set(findRoot(i), [...(groups.get(findRoot(i)) ?? []), leg]));

  const routed = new Map<string, Vec[]>(); // `${fiber}:${fromKey}` → points
  for (const legs of groups.values()) {
    const res = routeGroup(legs, obstacles);
    for (const leg of legs) routed.set(`${leg.fiber}:${leg.from.key}`, res.get(leg.fiber) ?? []);
  }

  const polylines = {} as Record<FiberId, Vec[][]>;
  for (const f of FIBERS) {
    const nodes = plans[f].nodes;
    const line: Vec[] = [nodes[0].point];
    for (let i = 0; i < nodes.length - 1; i++) {
      const run = plans[f].runs.get(nodes[i].key);
      line.push(...(run ?? routed.get(`${f}:${nodes[i].key}`) ?? []), nodes[i + 1].point);
    }
    polylines[f] = [line];
  }

  return finish(polylines, markers, obstacles);
}

// ---------------------------------------------------------------------------
// Mobile : une fibre composite à 20px du bord, divisée en 3 dans les zones [data-fiber-split]

function routeMobile(input: RouteInput, obstacles: Rect[]): RouteResult {
  const { gap, mobileX } = ROUTING;
  const { A, B, C } = input.origins;

  // Les 3 ports convergent en entonnoir à 45° sous le port central.
  const spread = Math.max(Math.abs(A.x - B.x), Math.abs(C.x - B.x));
  const merge: Vec = { x: B.x, y: Math.max(A.y, B.y, C.y) + spread + 12 };
  const funnel = (p: Vec): Vec[] => [p, { x: p.x, y: merge.y - Math.abs(p.x - merge.x) }, merge];

  const ends = input.anchors.filter((a) => a.mode === "end");
  const end = ends[ends.length - 1]; // terminus le plus bas : la composite traverse toute la page
  const regions = [...input.splitRegions].sort((a, b) => a.top - b.top);
  const firstStop = Math.min(
    regions[0]?.top ?? Infinity,
    end ? center(end.rect).y : Infinity,
    input.height - 40,
  );

  // Descente vers le couloir gauche : on choisit le niveau de croisement le plus dégagé.
  const leg: Leg = {
    fiber: "A",
    from: { point: merge, key: "merge" },
    to: { point: { x: mobileX, y: firstStop }, key: "rail" },
  };
  const descent = routeGroup([leg], obstacles, "early").get("A") ?? [merge, leg.to.point];

  const composite: Vec[] = [...funnel(A), ...descent];
  const terminus = end ? { x: end.rect.left, y: center(end.rect).y } : { x: mobileX, y: input.height - 40 };
  composite.push({ x: mobileX, y: terminus.y }, terminus);

  const polylines: Record<FiberId, Vec[][]> = { A: [composite], B: [[B, merge]], C: [funnel(C)] };

  // Dédoublement à 45° dans chaque zone Expertises, puis retour sur la composite.
  for (const r of regions) {
    (["B", "C"] as const).forEach((f, i) => {
      const dx = gap * (i + 1);
      polylines[f].push([
        { x: mobileX, y: r.top },
        { x: mobileX + dx, y: r.top + dx },
        { x: mobileX + dx, y: r.bottom - dx },
        { x: mobileX, y: r.bottom },
      ]);
    });
  }

  // Les impulsions mobiles voyagent sur la composite, sauf B / C dans leur zone dédoublée.
  const markers: ArrivalMarker[] = [];
  for (const anchor of input.anchors) {
    const c = center(anchor.rect);
    for (const f of anchor.fibers) {
      const regionIndex = regions.findIndex((r) => c.y >= r.top && c.y <= r.bottom);
      const own = f !== "A" && regionIndex >= 0;
      const x = own ? mobileX + gap * (f === "B" ? 1 : 2) : mobileX;
      const y = anchor === end ? terminus.y : c.y;
      markers.push({
        fiber: f,
        carrier: own ? f : "A",
        anchorId: anchor.id,
        mode: anchor.mode,
        point: anchor === end ? terminus : { x, y },
      });
    }
  }

  return finish(polylines, markers, obstacles);
}

// Polyligne → chemin SVG aux coudes arrondis (même grammaire que les fibres), pour les scènes
// qui dessinent leurs propres tracés (ex. le quadrillage de rues de la scène Maps).
export function roundedPath(points: Vec[], radius: number = ROUTING.radius) {
  return toPath(cleanPolyline(points), new Map(), radius);
}

export function routeFibers(input: RouteInput): RouteResult {
  const obstacles = input.obstacles.map((o) => inflate(o, ROUTING.obstaclePadding));
  return input.mobile ? routeMobile(input, obstacles) : routeDesktop(input, obstacles);
}
