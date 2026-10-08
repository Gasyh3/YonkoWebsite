---
workflow: general-video
flow: automation
storyboard: no
message: "La stratégie est la source : elle rend l'entreprise visible, trouvable et efficace."
destination: website-hero
aspect: 6:5 (ordinateur) + 16:9 (intro)
language: fr
audience: PME, commerçants, artisans, professions libérales
length: 12s (boucle parfaite) + intro 7,4s
---

# Boucle vidéo du hero — Yonko Tech Consulting

## Intent

Adaptation de la bande démo motion design fournie en référence (cadre HUD aux crochets d'angle,
libellés mono, timecode, emblème en étoile avec anneau de texte, scènes courtes enchaînées, signature
finale) à la DA du site : noir mat, or en dégradé, argent, sobriété.

Concept : l'ordinateur du hero est la stratégie. Son écran joue une mini-bande démo en 5 temps ;
à la fin de chaque scène de service, une impulsion descend le pied et allume le port correspondant.
Les fibres optiques ne sont pas dans la vidéo : elles partent de ces ports en SVG sur le site.

| Temps | Scène écran | Port |
| --- | --- | --- |
| 0 – 1s | écran éteint, liseré argent | — |
| 1 – 3s | 01 — Identité : emblème en étoile or + anneau de texte | — |
| 3 – 5s | 02 — Être vu : résultats de recherche, « Votre entreprise » monte en position 1 | A (or) |
| 5 – 7s | 03 — Être trouvé : plan en perspective, épingle or + ondes | B (or) |
| 7 – 9s | 04 — Être efficace : 4 modules qui forment un dashboard (argent) | C (argent) |
| 9 – 11s | 05 — Stratégie : signature Yonko Tech + ligne de services | A, B, C respirent |
| 11 – 12s | retour exact à l'état initial | — |

## Notes

- Fond #0B0B0C partout (jonction invisible avec la page, `mix-blend-mode: lighten` côté site).
- Positions des ports : `lib/motion/hero-ports.json` (copié par `npm run sync-ports`).
- Polices embarquées : Instrument Serif, Inter Tight (assets/fonts), JetBrains Mono (bundle HyperFrames).
- Deux sorties, pas d'audio :
  - `index.html` (1200×1000) : l'ordinateur seul, boucle de 12s, placé dans la colonne droite du hero ;
  - `compositions/intro.html` (1920×1080) : la bande démo en plein écran, de l'allumage (1s) à la
    signature (10,2s), un peu accélérée ; elle se termine sur l'image de relais (`timing.handoff`),
    identique à l'écran de l'ordinateur au même instant : le site la fait rentrer dans l'écran puis
    lance l'ordinateur à 10,2s.
- Le reflet or des mots du titre du site est synchronisé sur 9,2s (apparition de la signature).
- Révision (retour client) : ordinateur +10 %, aligné sur le texte du hero ; bande démo en intro.
