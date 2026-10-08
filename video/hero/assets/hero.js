// Vidéo hero Yonko Tech — deux mises en page d'une même mini-bande démo, timeline GSAP unique,
// en pause et déterministe (aucune horloge, aucun aléatoire). #root[data-layout] :
//   computer : l'ordinateur seul (cadre 6:5), boucle de 12s ; l'écran joue la bande démo, les ports s'allument
//   intro    : la bande démo en plein cadre 16:9, de l'allumage à la signature (image de relais = timing.handoff)
// Géométrie et instants clés : window.HERO_PORTS (copie de lib/motion/hero-ports.json, partagée avec le site).
// Usage : window.__timelines["<id>"] = window.buildHeroTimeline(); (enregistrement en ligne dans le HTML).
window.buildHeroTimeline = function () {
  const root = document.getElementById("root");
  const layoutName = root.dataset.layout;
  const isComputer = layoutName === "computer";
  const W = Number(root.dataset.width);
  const H = Number(root.dataset.height);
  const DURATION = Number(root.dataset.duration);
  const cfg = window.HERO_PORTS;
  const LOOP = cfg.timing.loop;

  // Repère de construction de l'ordinateur (mis à l'échelle du cadre par une transformation statique).
  const D = cfg.design;
  const k = W / D.width;
  const ports = {};
  for (const id of ["A", "B", "C"]) {
    ports[id] = { x: (cfg.ports[id][0] / 100) * D.width, y: (cfg.ports[id][1] / 100) * D.height };
  }
  const screen = {
    x: (cfg.screen.x / 100) * D.width,
    y: (cfg.screen.y / 100) * D.height,
    w: (cfg.screen.w / 100) * D.width,
  };
  const L = { footW: 250, footH: 30 };
  const frame = 14; // liseré (2px) + cadre (12px) autour de l'écran
  const screenH = screen.w * (9 / 16);
  const outerW = screen.w + frame * 2;
  const outerH = screenH + frame * 2;
  const monitorLeft = screen.x - frame;
  const monitorTop = screen.y - frame;
  const cx = ports.B.x;
  const monitorBottom = monitorTop + outerH;
  const footTop = ports.B.y - L.footH / 2;
  const contentScale = isComputer ? screen.w / 640 : W / 640;

  const px = (n) => `${Math.round(n * 100) / 100}px`;
  const el = (cls, style = "", inner = "") => `<div class="${cls}" style="${style}">${inner}</div>`;

  // ------------------------------------------------------------------ Contenu de l'écran (640 × 360)

  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const r1 = 12;
    const r2 = i % 2 ? 50 : 62;
    return `<line x1="${(Math.cos(a) * r1).toFixed(2)}" y1="${(Math.sin(a) * r1).toFixed(2)}" x2="${(Math.cos(a) * r2).toFixed(2)}" y2="${(Math.sin(a) * r2).toFixed(2)}" />`;
  }).join("");

  const emblemSvg = (id, withRing) => `
    <svg viewBox="-120 -120 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="${id}-gold" x1="-60" y1="-60" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" style="stop-color: var(--gold-1)" />
          <stop offset="0.52" style="stop-color: var(--gold-2)" />
          <stop offset="1" style="stop-color: var(--gold-3)" />
        </linearGradient>
        <path id="${id}-ring-path" d="M 0,-86 a 86,86 0 1,1 0,172 a 86,86 0 1,1 0,-172" />
      </defs>
      ${
        withRing
          ? `<circle class="${id}-orbit" r="104" fill="none" style="stroke: var(--fiber-off)" stroke-width="1" />
             <g class="${id}-ring"><text class="emblem__ring-text"><textPath href="#${id}-ring-path" textLength="532" lengthAdjust="spacing">YONKO · STRATÉGIE · ÊTRE VU · ÊTRE TROUVÉ · ÊTRE EFFICACE ·</textPath></text></g>`
          : ""
      }
      <g class="${id}-rays" stroke="url(#${id}-gold)" stroke-width="4" stroke-linecap="round">${rays}</g>
      <circle r="5" fill="url(#${id}-gold)" />
    </svg>`;

  const rows = [
    { w: 400, s: 260 },
    { w: 340, s: 220 },
    { w: 420, s: 300 },
    { client: true },
    { w: 300, s: 200 },
  ];
  const ROW_Y = 124;
  const ROW_STEP = 38;
  const resultsHtml = rows
    .map((r, i) => {
      const style = `top:${ROW_Y + i * ROW_STEP}px`;
      if (r.client) {
        return el(
          "result result--client",
          style,
          `<span class="result__index result__index--old">04</span><span class="result__index result__index--new">01</span><span class="result__name gold-text">Votre entreprise</span>` +
            el("result__sub", "width:240px;top:18px") +
            `<span class="result__tag">Position 1</span>`,
        );
      }
      // Rang avant / après la remontée du client (les 3 premiers descendent d'un cran).
      const after = i < 3 ? i + 2 : i + 1;
      return el(
        "result",
        style,
        `<span class="result__index result__index--old">0${i + 1}</span><span class="result__index result__index--new">0${after}</span>` +
          el("result__bar", `width:${r.w}px`) +
          el("result__sub", `width:${r.s}px`),
      );
    })
    .join("");

  const silverPins = [
    [150, 196],
    [478, 178],
    [226, 284],
    [548, 262],
    [96, 258],
    [404, 300],
  ];
  const GOLD_PIN = [324, 236];
  const pinsHtml =
    silverPins.map(([x, y]) => el("pin pin--silver", `left:${x}px;top:${y}px`, el("pin__stem") + el("pin__head"))).join("") +
    el(
      "pin pin--gold",
      `left:${GOLD_PIN[0]}px;top:${GOLD_PIN[1]}px`,
      el("radar radar--1") + el("radar radar--2") + el("pin__stem") + el("pin__head"),
    );

  const HUB = [320, 206];
  const modules = [
    { label: "Planning", far: [52, 92], grid: [184, 112], bars: [10, 16, 12, 20] },
    { label: "Clients", far: [456, 92], grid: [324, 112], bars: [14, 9, 18, 13] },
    { label: "Facturation", far: [52, 252], grid: [184, 184], bars: [8, 14, 20, 16] },
    { label: "Stock", far: [456, 252], grid: [324, 184], bars: [18, 12, 15, 9] },
  ];
  const MOD_W = 132;
  const MOD_H = 64;
  // Branches orthogonales hub → module : un segment horizontal puis un vertical.
  const branchesHtml = modules
    .map((m) => {
      const tx = m.far[0] + (m.far[0] < HUB[0] ? MOD_W : 0);
      const ty = m.far[1] + (m.far[1] < HUB[1] ? MOD_H : 0);
      const left = Math.min(HUB[0], tx);
      const hW = Math.abs(tx - HUB[0]);
      const top = Math.min(HUB[1], ty);
      const vH = Math.abs(ty - HUB[1]);
      const hOrigin = tx < HUB[0] ? "100% 50%" : "0% 50%";
      const vOrigin = ty < HUB[1] ? "50% 100%" : "50% 0%";
      return (
        el("branch branch--h", `left:${left}px;top:${HUB[1]}px;width:${hW}px;height:1px;transform-origin:${hOrigin}`) +
        el("branch branch--v", `left:${tx}px;top:${top}px;width:1px;height:${vH}px;transform-origin:${vOrigin}`)
      );
    })
    .join("");
  const modulesHtml = modules
    .map((m, i) =>
      el(
        `module module--${i}`,
        `left:${m.far[0]}px;top:${m.far[1]}px`,
        el("module__label", "", m.label) +
          el("module__bars", "", m.bars.map((h) => el("module__bar", `height:${h}px`)).join("")) +
          el("module__line"),
      ),
    )
    .join("");

  const labels = ["01 — Identité", "02 — Être vu", "03 — Être trouvé", "04 — Être efficace", "05 — Stratégie"];

  const screenContent = `
    <div class="scene scene--1">
      <div class="emblem">${emblemSvg("e1", true)}</div>
    </div>
    <div class="scene scene--2">
      <p class="scene__title">Être vu.</p>
      <div class="search">${el("search__icon")}${el("search__line")}</div>
      ${resultsHtml}
    </div>
    <div class="scene scene--3">
      <p class="scene__title">Être trouvé.</p>
      <div class="map"><div class="map__plane" data-layout-allow-overflow></div></div>
      ${pinsHtml}
      <div class="place-card" style="left:356px;top:134px">
        <p class="place-card__name">Votre entreprise</p>
        <p class="place-card__stars gold-text">★★★★★</p>
        <p class="place-card__open">Ouvert</p>
      </div>
    </div>
    <div class="scene scene--4">
      <p class="scene__title">Être efficace.</p>
      <div class="hub">${el("hub__node")}</div>
      ${branchesHtml}
      ${modulesHtml}
      <div class="dash-clip" style="position:absolute;left:184px;top:112px;width:272px;height:136px;overflow:hidden"><div class="sweep" data-layout-allow-overflow></div></div>
      <p class="dash-label gold-text" style="left:184px;top:262px;width:272px;text-align:center">Conçu pour votre entreprise</p>
    </div>
    <div class="scene scene--5">
      <div class="lockup">
        <div class="emblem emblem--lockup" style="left:184px;top:160px;transform:scale(0.42)">${emblemSvg("e5", false)}</div>
        <p class="lockup__word gold-text" style="left:240px">Yonko Tech</p>
        <p class="lockup__sub" style="left:244px">consulting</p>
        ${el("lockup__rule")}
        <div class="lockup__services"><span>Stratégie</span><span>Site vitrine &amp; SEO</span><span>Google Maps</span><span>Logiciel sur mesure</span></div>
      </div>
    </div>
    <div class="hud">
      ${el("hud__corner hud__corner--tl")}${el("hud__corner hud__corner--tr")}
      ${el("hud__corner hud__corner--bl")}${el("hud__corner hud__corner--br")}
      <span class="hud__brand">Yonko Tech · Stratégie · 2026</span>
      <div class="hud__labels">${labels.map((t, i) => `<span class="hud__label hud__label--${i}">${t}</span>`).join("")}</div>
      <span class="hud__time">00:00:00:00</span>
      <div class="hud__meta"><span>30 fps</span><div class="hud__bars">${labels
        .map((_, i) => el("hud__bar", "", el(`hud__bar-fill hud__bar-fill--${i}`)))
        .join("")}</div></div>
    </div>`;

  // ------------------------------------------------------------------ Ordinateur

  const portsHtml = ["A", "B", "C"]
    .map((id) =>
      el(
        `layer port port--${id}`,
        `left:${px(ports[id].x)};top:${px(ports[id].y)}`,
        el("port__bloom") + `<div class="port__streak" data-layout-allow-overflow></div>` + el("port__socket") + el("port__lit"),
      ),
    )
    .join("");

  const stage = document.createElement("div");
  stage.className = "clip stage";
  stage.dataset.start = "0";
  stage.dataset.duration = String(DURATION);
  if (isComputer) {
    stage.style.cssText = `position:absolute;left:0;top:0;width:${D.width}px;height:${D.height}px;transform:scale(${k});transform-origin:0 0`;
    stage.innerHTML = `
    ${el("layer neck", `left:${px(cx - 9)};top:${px(monitorBottom - 2)};width:18px;height:${px(footTop - monitorBottom + 4)}`)}
    ${el("layer foot", `left:${px(cx - L.footW / 2)};top:${px(footTop)};width:${L.footW}px;height:${L.footH}px`, el("foot__body"))}
    <div class="layer monitor" style="left:${px(monitorLeft)};top:${px(monitorTop)};width:${px(outerW)};height:${px(outerH)}">
      <div class="monitor__body">
        <div class="screen">
          ${el("screen__glow")}
          <div class="screen__content" style="transform:scale(${contentScale})">${screenContent}</div>
          ${el("screen__glass")}
        </div>
      </div>
      ${el("monitor__rim")}
    </div>
    ${portsHtml}
    ${el("layer pulse pulse--gold", `left:${px(cx)};top:${px(monitorBottom)}`)}
    ${el("layer pulse pulse--silver", `left:${px(cx)};top:${px(monitorBottom)}`)}`;
  } else {
    // Intro : l'écran occupe tout le cadre (même contenu, même timeline, à l'échelle du plein écran).
    stage.style.cssText = "position:absolute;inset:0";
    stage.innerHTML = `
    <div class="screen screen--full">
      ${el("screen__glow")}
      <div class="screen__content" style="transform:scale(${contentScale})">${screenContent}</div>
    </div>`;
  }
  root.appendChild(stage);

  // ------------------------------------------------------------------ Timeline

  const q = (s) => stage.querySelector(s);
  const qa = (s) => stage.querySelectorAll(s);
  const tl = gsap.timeline({ paused: true });
  // Reprise d'une propriété déjà animée : état de départ explicite, sans rendu immédiat (seek-safe).
  const then = (target, from, to, at) => tl.fromTo(target, from, { ...to, immediateRender: false }, at);

  // Timecode HUD : proxy seek-safe.
  const time = q(".hud__time");
  const clock = { t: 0 };
  tl.fromTo(
    clock,
    { t: 0 },
    {
      t: LOOP,
      duration: LOOP,
      ease: "none",
      onUpdate: () => {
        const frames = Math.floor(clock.t * 30 + 1e-6);
        const ss = String(Math.floor(frames / 30)).padStart(2, "0");
        const ff = String(frames % 30).padStart(2, "0");
        time.textContent = `00:00:${ss}:${ff}`;
      },
    },
    0,
  );

  // Réveil de l'écran et lumière de contour (1 → 1.8s), extinction (10.9 → 11.9s).
  tl.fromTo(q(".screen__glow"), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "sine.inOut" }, 1.0)
    .fromTo(q(".hud"), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.inOut" }, 1.0);
  then(q(".screen__glow"), { opacity: 1 }, { opacity: 0, duration: 1.0, ease: "sine.inOut" }, 10.9);
  then(q(".hud"), { opacity: 1 }, { opacity: 0, duration: 0.8, ease: "sine.inOut" }, 10.9);
  if (isComputer) {
    tl.fromTo(q(".monitor__rim"), { opacity: 0.25 }, { opacity: 0.7, duration: 0.8, ease: "sine.inOut" }, 1.0);
    then(q(".monitor__rim"), { opacity: 0.7 }, { opacity: 0.25, duration: 1.0, ease: "sine.inOut" }, 10.9);
  }

  // Scènes : apparition / disparition et libellé HUD correspondant.
  const SCENES = [
    [1.1, 3.0],
    [3.0, 5.0],
    [5.0, 7.0],
    [7.0, 9.0],
    [9.0, 10.95],
  ];
  SCENES.forEach(([start, end], i) => {
    const scene = q(`.scene--${i + 1}`);
    const label = q(`.hud__label--${i}`);
    const bar = q(`.hud__bar-fill--${i}`);
    // La signature reste entière jusqu'après l'image de relais (timing.handoff), puis s'éteint.
    const last = i === SCENES.length - 1;
    const fadeOut = last ? 0.5 : 0.25;
    tl.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "sine.inOut" }, start);
    then(scene, { opacity: 1 }, { opacity: 0, duration: fadeOut, ease: "sine.inOut" }, last ? 10.45 : end - fadeOut + 0.05);
    tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, start);
    then(label, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: "none" }, end - 0.15);
    tl.fromTo(bar, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, start);
    then(bar, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: "none" }, end - 0.15);
  });

  // 01 — Identité : l'emblème éclot, l'anneau de texte tourne.
  tl.fromTo(q(".e1-rays"), { scale: 0, rotation: -60, transformOrigin: "50% 50%" }, { scale: 1, rotation: 0, duration: 1.1, ease: "expo.out" }, 1.2)
    .fromTo(q(".e1-ring"), { rotation: 0, opacity: 0, transformOrigin: "50% 50%" }, { rotation: 50, opacity: 1, duration: 1.9, ease: "none" }, 1.15)
    .fromTo(q(".e1-orbit"), { scale: 0.8, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" }, 1.3);

  // 02 — Être vu : « Votre entreprise » remonte de la 4e à la 1re position.
  tl.fromTo(q(".scene--2 .scene__title"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 3.05)
    .fromTo(q(".search"), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "sine.inOut" }, 3.1)
    .fromTo(qa(".scene--2 .result"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.06 }, 3.15);
  const results = qa(".scene--2 .result");
  results.forEach((row, i) => {
    if (i === 3) return;
    if (i < 3) then(row, { y: 0 }, { y: ROW_STEP, duration: 0.65, ease: "power3.inOut" }, 3.8);
  });
  then(results[3], { y: 0 }, { y: -3 * ROW_STEP, duration: 0.65, ease: "power3.inOut" }, 3.8);
  tl.fromTo(qa(".result__index--old"), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: "none" }, 4.3)
    .fromTo(qa(".result__index--new"), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 4.35);
  tl.fromTo(q(".result__tag"), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }, 4.45);

  // 03 — Être trouvé : plan en perspective, épingles argent, épingle or et ondes.
  tl.fromTo(q(".scene--3 .scene__title"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 5.05)
    .fromTo(q(".map__plane"), { rotationX: 62, y: 0 }, { rotationX: 62, y: -66, duration: 2.0, ease: "none" }, 5.0)
    .fromTo(q(".map"), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "sine.inOut" }, 5.0)
    .fromTo(qa(".pin--silver"), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.06 }, 5.35)
    .fromTo(qa(".pin--silver"), { opacity: 1 }, { opacity: 0.4, duration: 0.4, ease: "sine.inOut", immediateRender: false }, 6.0)
    .fromTo(q(".pin--gold"), { y: -46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 5.75)
    .fromTo(q(".radar--1"), { scale: 0, opacity: 0.6 }, { scale: 3, opacity: 0, duration: 1.2, ease: "sine.inOut" }, 6.15)
    .fromTo(q(".radar--2"), { scale: 0, opacity: 0.6 }, { scale: 3, opacity: 0, duration: 1.2, ease: "sine.inOut" }, 6.55)
    .fromTo(q(".place-card"), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "expo.out" }, 6.25);

  // 04 — Être efficace : branches orthogonales, modules branchés, puis dashboard 2×2.
  tl.fromTo(q(".scene--4 .scene__title"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 7.05)
    .fromTo(q(".hub__node"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "expo.out" }, 7.1)
    .fromTo(qa(".branch--h"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.in" }, 7.2)
    .fromTo(qa(".branch--v"), { scaleY: 0 }, { scaleY: 1, duration: 0.25, ease: "power2.out" }, 7.5);
  qa(".module").forEach((mod, i) => {
    const m = modules[i];
    tl.fromTo(mod, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.35, ease: "expo.out" }, 7.7 + i * 0.06);
    then(mod, { x: 0, y: 0 }, { x: m.grid[0] - m.far[0], y: m.grid[1] - m.far[1], duration: 0.7, ease: "power3.inOut" }, 8.05);
  });
  tl.fromTo(qa(".branch, .hub__node"), { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "sine.inOut" }, 8.0)
    .fromTo(q(".sweep"), { x: -80, opacity: 1 }, { x: 290, opacity: 1, duration: 0.6, ease: "sine.inOut" }, 8.65)
    .fromTo(q(".dash-label"), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.35, ease: "expo.out" }, 8.6);

  // 05 — Signature.
  tl.fromTo(q(".e5-rays"), { scale: 0, rotation: -60, transformOrigin: "50% 50%" }, { scale: 1, rotation: 0, duration: 0.9, ease: "expo.out" }, 9.05)
    .fromTo(q(".lockup__word"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 9.15)
    .fromTo(q(".lockup__sub"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" }, 9.3)
    .fromTo(q(".lockup__rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 9.4)
    .fromTo(q(".lockup__services"), { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "sine.inOut" }, 9.55);

  // Ports : une impulsion descend le pied puis allume le port de la scène qui s'achève.
  const pulseTo = (id, at) => {
    const pulse = q(id === "C" ? ".pulse--silver" : ".pulse--gold");
    const port = q(`.port--${id}`);
    const dropY = footTop + L.footH / 2 - monitorBottom;
    const dx = ports[id].x - cx;
    const lit = port.querySelector(".port__lit");
    const bloom = port.querySelector(".port__bloom");
    const streak = port.querySelector(".port__streak");
    // Une seule impulsion visible à la fois : x, y et opacité repartent de zéro à chaque passage.
    then(pulse, { x: 0, y: 0, opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none" }, at - 0.55);
    then(pulse, { y: 0 }, { y: dropY, duration: 0.38, ease: "power2.in" }, at - 0.55);
    then(pulse, { x: 0 }, { x: dx, duration: 0.14, ease: "power1.out" }, at - 0.17);
    then(pulse, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: "none" }, at - 0.03);
    tl.fromTo(lit, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "sine.inOut" }, at);
    tl.fromTo(bloom, { opacity: 0 }, { opacity: 0.9, duration: 0.25, ease: "sine.inOut" }, at);
    then(bloom, { opacity: 0.9 }, { opacity: 0.35, duration: 0.8, ease: "sine.inOut" }, at + 0.3);
    tl.fromTo(streak, { y: 0 }, { y: 150, duration: 0.8, ease: "power1.in" }, at);
    tl.fromTo(streak, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, at);
    then(streak, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "sine.inOut" }, at + 0.2);
  };
  if (isComputer) {
    pulseTo("A", 4.95);
    pulseTo("B", 6.95);
    pulseTo("C", 8.95);

    // Signature : les 3 ports respirent ensemble, puis tout revient à l'état initial.
    then(qa(".port__bloom"), { opacity: 0.35 }, { opacity: 0.75, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 1 }, 9.3);
    then(qa(".port__lit"), { opacity: 1 }, { opacity: 0, duration: 1.0, ease: "sine.inOut" }, 10.9);
    then(qa(".port__bloom"), { opacity: 0.35 }, { opacity: 0, duration: 1.0, ease: "sine.inOut" }, 10.9);
    return tl;
  }

  // Intro : de l'allumage de l'écran (1s) à l'image de relais, un peu plus vif que la boucle,
  // puis tenue sur l'image de relais jusqu'à la fin du cadre.
  const master = gsap.timeline({ paused: true });
  master.add(tl.tweenFromTo(1.0, cfg.timing.handoff, { duration: DURATION - 0.1, ease: "none" }), 0);
  return master;
};
