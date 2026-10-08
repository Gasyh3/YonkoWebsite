# Pack de prompts motion — Yonko Tech Consulting

> Transcription texte de `docs/motion-prompts.pdf` (source de référence, @Loïc, 8 oct. 2026).
> En cas de doute sur la mise en forme, le PDF fait foi. Les prompts vidéo V0/V1 sont remplacés
> par une production HyperFrames (voir `CLAUDE.md`), mais leur timeline reste la référence.

```text
Yonko Tech Consulting — Pack de prompts motion

Yonko Tech Consulting — Pack de prompts
motion
​Oct 8, 2026

· ​@Loïc

Mode d'emploi et charte motion
Le site combine deux sources de motion : un seul clip vidéo IA (l'ordinateur du hero) et
tout le reste en code (fibres, scènes de section, micro-interactions). Les fibres doivent
sortir de la vidéo et continuer dans la page, c'est pourquoi elles ne sont jamais dans la
vidéo.
Comment utiliser ce pack
1. Les prompts vidéo sont en anglais : les modèles vidéo (Veo, Kling, Runway, Sora)
répondent nettement mieux en anglais.
2. Pour le code, colle d'abord le Prompt 0 (contexte projet) en début de session, puis un
seul prompt de section à la fois. Valide chaque scène avant de passer à la suivante.
3. Ne modifie jamais les valeurs de la charte dans un prompt isolé : si tu changes un token,
change-le ici et dans le Prompt 0.
Ordre de production conseillé
1. Clip vidéo du hero (V1), puis plans annexes (V2, V3)
2. Prompt 0, puis C1 (système global des fibres)
3. C2 (hero) et C6 (scène Google Maps) pour valider la DA
4. Les autres scènes dans l'ordre de la page
5. C11 (micro-interactions, transitions, reduced motion), puis la checklist qualité
Charte motion (à respecter partout)
Token

Valeur

Usage

Noir mat

#0B0B0C

Fond global, jamais #000

Surface

#141416

Cartes, panneaux

Grain

bruit 3 à 4 % d'opacité, statique

Overlay sur toute la page

Or (dégradé)

#8C6A2A → #E8C77A → #B8913E

Mots-clés, fibres or, CTA

Or reflet

#F6E3A8

Tête de l'impulsion lumineuse
uniquement

Token

Valeur

Usage

Argent

#A8ADB4 / clair #E3E6EA

Fibre logiciel, labels, chiffres

Texte courant

#EDEAE4 à 72 %

Paragraphes

Fibre éteinte

argent à 18 %, dots 2 px,
espacement 7 px

État par défaut des 3 fibres

Easing entrée

expo.out

Reveals de texte et d'éléments

Easing
transition

power3.inOut

Changements d'état, transitions
de page

Easing
respiration

sine.inOut

Boucles, pulsations, glow

Durées

0,3 s / 0,7 s / 1,2 s

Micro / reveal / transition majeure

Stagger

0,06 s

Mots, lignes, cartes

Typo titres

serif display fin (Canela, PP
Editorial New)

Titres

Typo texte

grotesque fine (Neue Montreal,
Inter Tight)

Texte, UI

Le sens des 3 fibres : l'ordinateur est la stratégie (la source). Fibre A or = Site vitrine et
SEO (être vu). Fibre B or = Google Maps et visibilité locale (être trouvé). Fibre C argent =
Logiciel sur mesure (être efficace).

Prompts vidéo IA
Trois livrables seulement : une image clé (V0), la boucle desktop (V1) et sa version mobile
(V1-M). La boucle parfaite s'obtient en donnant la même image V0 comme première et
dernière frame dans un outil qui accepte les keyframes de début et de fin.

V0 : image clé (Midjourney, Imagen, Flux…)
Cinematic product photograph of a minimalist premium computer: a slim matteblack monitor on a thin matte-black stand, centered, front view seen very
slightly from below. The screen is off: deep black glass with a faint soft
reflection. A thin brushed-silver bevel runs around the monitor and catches a
delicate rim light. At the foot of the stand, three tiny connection ports
aligned horizontally, unlit.
Background: seamless matte charcoal void, color #0B0B0C, no floor line, no
horizon, no walls. Subtle fine film grain.
Lighting: very low key. One soft cool-silver rim light from top-back. 90% of
the frame in deep shadow. No hard highlights.
Composition: the computer fills the central 40% of the frame, placed in the
upper-middle area. The lower third of the frame is completely empty and dark
(reserved for graphic lines added later).
Mood: luxury, silence, precision, high-end tech brand.
Style: photorealistic, 35mm lens, f/4, ultra clean, 16:9.
No text, no logo, no keyboard, no mouse, no desk, no people, no plants, no
lens flare, no smoke, no colored lights.

Génère plusieurs variantes, choisis celle où le noir du fond est le plus uniforme. Un fond
irrégulier rendra la jonction avec la page visible.

V1 : boucle hero desktop (Veo, Kling, Runway…)
Réglages : image-to-video, première frame = V0, dernière frame = V0, 8 secondes, 16:9,
sans audio.

Locked-off static camera, absolutely no camera movement, no zoom, no
parallax. A minimalist matte-black computer monitor in a pitch-dark matte
charcoal void (#0B0B0C). Seamless 8-second loop: the last frame is identical
to the first frame.
Timeline:
0.0–1.0s: stillness. The screen is off. Only a faint silver rim light
outlines the bevel.
1.0–2.5s: the screen slowly wakes up from its center with a soft warm golden
glow, like dawn behind black glass. The silver rim light on the bevel gently
intensifies.
2.5–3.5s: on the screen, three soft abstract horizontal light bars fade in
one after another (gold, gold, silver), blurred and elegant, no readable
interface.
3.5–5.0s: a single pulse of golden light travels down from the screen through
the stand. The three small ports at the base light up one after another
(gold, gold, silver) with a tiny soft bloom, then a short streak of light
leaves each port downward and exits the bottom of the frame.
5.0–6.5s: all light slowly breathes out and fades.
6.5–8.0s: return to the exact initial state: screen off, faint silver rim
light, total calm.
Motion: slow, smooth, weightless, eased in and out, no flicker. Luxury tech
commercial, ultra minimal, photorealistic.
Avoid: camera motion, shape morphing of the computer, text, logos, UI
details, particles, sparks, smoke, lens flares, color shifts, any color other
than black, gold and silver.

V1-M : boucle hero mobile
Même prompt que V1, en 9:16, avec ces deux lignes remplacées dans V0 et V1 :
Vertical 9:16 frame. The computer sits in the upper 40% of the frame; the
lower 60% is completely empty dark space.

Post-production (indispensable)
Étalonne le noir du fond exactement sur #0B0B0C . Sinon un rectangle légèrement
différent apparaît autour de la vidéo. En complément, ajoute en CSS un masque radial
qui fond les bords de la vidéo dans la page.
Si la jonction de boucle saute, coupe 4 à 6 frames et fais un fondu enchaîné sur la
boucle.

Relève la position exacte des 3 ports en pourcentage de l'image : ce sont les points de
départ des fibres en code (Prompt C1).
Exports : WebM (VP9) et MP4 (H.264), 1920×1080 et 1080×1920, sans audio, idéalement
moins de 3 Mo chacun, plus un poster JPG de la frame V0.

Prompt 0 : contexte projet (à coller en début de chaque session
code)
Ce prompt installe le rôle, la DA et les règles techniques une fois pour toutes. Les prompts
C1 à C11 s'appuient dessus et restent courts. Remplace [FRAMEWORK] par ta stack (Astro,
Next.js ou Vite vanilla).
<role>
Tu es un développeur frontend senior et motion designer, spécialiste de GSAP,
ScrollTrigger et SVG, habitué aux sites primés sur Awwwards. Ton code est
propre, modulaire, performant et accessible.
</role>
<context>
Nous construisons le site vitrine de Yonko Tech Consulting, agence web et
communication. Cible : PME, commerçants, artisans, professions libérales.
Services :
- Stratégie de communication (le pilier qui pilote tout)
- Site vitrine et SEO ("être vu")
- Indexation Google Maps et visibilité locale ("être trouvé")
- Logiciel interne sur mesure ("être efficace")
Concept motion : un ordinateur (vidéo en boucle dans le hero) représente la
stratégie, la source. Trois fibres optiques en pointillés en sortent et
parcourent toute la page en suivant un tracé ordonné de cable management
(angles à 90° ou 45°, coudes arrondis, fibres parallèles à écart constant).
Chaque section donne aux fibres un rôle différent.
- Fibre A, or : Site vitrine et SEO
- Fibre B, or : Google Maps
- Fibre C, argent : Logiciel sur mesure
Une fibre a deux états : éteinte (pointillés argent à 18 % d'opacité) et
parcourue par une impulsion lumineuse dorée (la donnée qui circule).
DA : luxe, sobriété, précision. Noir mat, or, argent.
</context>
<design_tokens>
--black: #0B0B0C; --surface: #141416;
--gold-1: #8C6A2A; --gold-2: #E8C77A; --gold-3: #B8913E; --gold-glint:

#F6E3A8;
--silver: #A8ADB4; --silver-light: #E3E6EA;
--text: rgba(237,234,228,.72);
--fiber-off: rgba(168,173,180,.18); dots 2px, espacement 7px;
Easings : entrée expo.out ; transition power3.inOut ; respiration sine.inOut.
Durées : 0.3s micro, 0.7s reveal, 1.2s transition majeure. Stagger : 0.06s.
Typo : serif display fin pour les titres, grotesque fine pour le texte.
Grain : bruit statique 3 à 4 % d'opacité sur toute la page.
</design_tokens>
<tech>
- [FRAMEWORK], GSAP 3 avec ScrollTrigger et SplitText, Lenis pour le smooth
scroll (synchronisé avec ScrollTrigger).
- Fibres en SVG inline. Les tracés sont calculés à partir d'éléments ancres
dans le DOM (attributs data-fiber-anchor), jamais codés en dur en pixels, et
recalculés au resize (debounce).
- Une animation = un module (fichier JS isolé) avec une fonction init() et
destroy().
- Toutes les valeurs de couleur, easing et durée viennent des tokens, jamais
en dur.
</tech>
<constraints>
- Animer uniquement transform, opacity et stroke-dashoffset. Pas de filter
animé, pas de box-shadow animé.
- Glow : un second tracé flouté statique sous le tracé principal, jamais un
drop-shadow animé.
- Un seul point focal en mouvement à la fois à l'écran.
- Aucun texte ne met plus d'une seconde à devenir lisible.
- Pas de scroll-jacking : le scroll reste libre, seules quelques sections
sont épinglées (pin).
- Pas de couleur hors palette, pas de particules, pas d'effet décoratif non
demandé.
- Mobile (< 768px) : version simplifiée prévue pour chaque animation.
- prefers-reduced-motion : chaque module fournit un état final statique et
lisible, sans mouvement.
</constraints>
<output_format>
Pour chaque demande : 1) une phrase sur l'approche ; 2) le code complet des
fichiers concernés, commenté sobrement ; 3) la liste des ancres DOM ou du
markup requis ; 4) comment tester. Pas de code partiel avec "...".
</output_format>
<verification>
Avant de répondre, vérifie : 60 fps tenable (seules les propriétés autorisées

sont animées) ; tokens respectés ; version mobile et reduced motion présentes
; destroy() nettoie tous les ScrollTriggers et listeners.
</verification>
Confirme simplement que tu as compris le contexte. J'enverrai ensuite les
demandes une par une.

C1 : système global des 3 fibres
C'est la fondation : toutes les scènes de section s'y branchent via des ancres et un
événement fiber:arrive . À faire et valider avant toute autre scène.
<task>
Crée le module FiberSystem qui gère les 3 fibres optiques sur toute la
hauteur de la page.
1. Structure : un SVG unique en position absolue, qui couvre toute la page,
en z-index sous le contenu. Trois groupes, un par fibre (A or, B or, C
argent). Chaque groupe contient :
- le tracé éteint : pointillés (dots ronds de 2px, espacement 7px, strokelinecap round), couleur --fiber-off ;
- un tracé de glow : même géométrie, statique, flouté (feGaussianBlur
appliqué une fois, jamais animé), opacité 0 par défaut ;
- l'impulsion : même géométrie, stroke-dasharray "120 <longueur totale>",
dégradé linéaire le long du trait de transparent vers --gold-glint (or) ou -silver-light (argent).
2. Routage : génère chaque tracé à partir des éléments [data-fiber-anchor] du
DOM, dans l'ordre de la page. Chaque ancre précise la fibre concernée (datafiber="A|B|C|all") et un mode : "pass" (la fibre passe par ce point), "plug"
(la fibre s'y branche puis repart), "end" (terminus). Entre deux ancres,
trace un chemin orthogonal (segments horizontaux et verticaux, 45° autorisé),
avec des coudes arrondis de rayon 24px. Quand les fibres voyagent ensemble,
elles restent parallèles avec un écart constant de 14px.
3. Révélation au scroll : la fibre éteinte se dessine progressivement avec le
scroll (ScrollTrigger scrub: 0.6), via un masque dont le stroke-dashoffset
avance (on ne peut pas animer le dashoffset des pointillés eux-mêmes). La
fibre est dessinée environ 30 % plus bas que le bas du viewport, pour que
l'on voie toujours où elle va.
4. Impulsion : la tête de l'impulsion suit la progression du scroll sur
chaque fibre. Quand l'utilisateur ne scrolle pas pendant plus de 2s, une
impulsion de respiration part du haut visible de la fibre et parcourt l'écran
en 2.4s (sine.inOut), puis s'éteint. Jamais plus d'une impulsion visible par

fibre.
5. Événements : quand la tête d'une impulsion atteint une ancre, émettre un
CustomEvent "fiber:arrive" sur window avec { fiber, anchorId, mode }. Les
scènes de section écoutent cet événement pour réagir (allumage, connexion…).
Exposer aussi une API : FiberSystem.setLit(fiber, true|false),
FiberSystem.pulse(fiber, fromAnchor, toAnchor, duration).
6. Départ : le point d'origine des 3 fibres est la position des 3 ports de la
vidéo hero, fournie en pourcentages de la vidéo : A [x%, y%], B [x%, y%], C
[x%, y%]. Convertir ces pourcentages en coordonnées page selon la taille
réelle de la vidéo (object-fit: cover pris en compte).
</task>
<constraints>
- Recalcul de tous les tracés au resize (debounce 150ms) et après chargement
des polices et images.
- Mobile (< 768px) : une seule fibre composite collée à 20px du bord gauche,
qui se divise en 3 uniquement dans la section Expertises et se rejoint
ensuite.
- prefers-reduced-motion : tracés entièrement dessinés dès le chargement,
aucune impulsion, les événements fiber:arrive sont émis à l'entrée de chaque
section dans le viewport.
- Le SVG ne doit jamais provoquer de scroll horizontal ni intercepter les
clics (pointer-events: none).
</constraints>
<output_format>
Fichiers : fiber-system.js, fiber-router.js (calcul des tracés), fiber.css.
Plus une page de démo avec 6 sections vides et des ancres, pour tester le
routage seul.
</output_format>
<verification>
Avant de répondre, vérifie : aucun tracé ne traverse un bloc de texte ; les
coudes sont tous arrondis au même rayon ; l'écart entre fibres parallèles est
constant ; le resize ne laisse aucun décalage.
</verification>

Prompts par section
Chaque prompt suppose que le Prompt 0 et le module C1 sont déjà en place. Un prompt
par session ou par message, dans cet ordre.

C2 : Hero
<task>
Crée la scène Hero.
1. Vidéo en boucle (WebM + MP4, poster JPG, muted, playsinline, autoplay),
object-fit: cover, avec un masque radial CSS qui fond ses bords dans le fond
--black. Version 9:16 sous 768px.
2. Titre : "Votre stratégie digitale, du premier clic au premier client." [à
adapter]. Au premier chargement seulement, les lignes se révèlent par masque
(translateY 100% vers 0, expo.out, 1.2s, stagger 0.06s). Les mots "stratégie"
et "client" en dégradé or.
3. Reflet synchronisé : à chaque boucle, quand la vidéo atteint 3.5s (moment
où la lumière descend vers les ports), un reflet doré traverse les mots or
une fois (déplacement de background-position, 1.2s, sine.inOut). Le titre ne
disparaît jamais.
4. Sortie au scroll (scrub, sur les 60 premiers % du viewport) : la vidéo
passe à scale 0.94 et opacity 0.35, le titre monte de 8vh et s'efface. En
même temps, FiberSystem part des 3 ports : les fibres "décrochent" et
descendent.
5. Indicateur de scroll discret : une ligne pointillée argent de 40px où un
point doré descend en boucle (sine.inOut, 2s), masqué dès le premier scroll.
</task>
<constraints>
Pas de preloader de plus de 800ms. La vidéo se met en pause hors viewport.
Reduced motion : poster fixe, titre visible directement.
</constraints>
<verification>
Vérifie que la jonction entre le bord de la vidéo et la page est invisible
sur fond --black.
</verification>

C3 : Manifeste
<task>
Crée la scène Manifeste : la phrase "Être vu. Être trouvé. Être efficace." en
très grand serif, sur 3 lignes centrées.
1. Les 3 fibres passent horizontalement derrière les 3 lignes (ancres datafiber-anchor mode "pass", une ligne par fibre : A derrière "Être vu", B
derrière "Être trouvé", C derrière "Être efficace").
2. Chaque ligne est d'abord en argent à 25 %. Quand l'événement fiber:arrive
de sa fibre est reçu, la ligne s'allume lettre par lettre dans le sens de la
fibre (SplitText chars, opacity et passage au dégradé or ou argent clair,
stagger 0.02s, expo.out).
3. Sous la phrase, un paragraphe court (2 lignes) se révèle par lignes une
fois les 3 lignes allumées.
</task>
<constraints>
Aucun pin. La lecture doit rester possible même si l'utilisateur scrolle vite
: au-delà de 60 % de la section, tout est allumé.
</constraints>

C4 : Stratégie
<task>
Crée la scène Stratégie : le pilier qui pilote tout.
1. Les 3 fibres voyagent ici parfaitement parallèles et horizontales, comme 3
rails d'un plan d'architecte.
2. Trois étapes de la méthode (Audit, Plan, Pilotage) sont posées sur les
rails, alignées à gauche. Chaque étape apparaît quand l'impulsion passe sous
elle : un petit nœud circulaire de 6px s'allume sur le rail, puis le titre et
le texte se révèlent (translateY 16px vers 0, opacity, 0.7s, expo.out).
3. Fond : une grille de points argent à 6 % d'opacité, statique, qui renforce
l'idée de plan.
</task>
<constraints>
Scène volontairement calme : c'est le moment de respiration avant le pic des
Expertises.
</constraints>

C5 : Expertises, conteneur épinglé et scène Site vitrine / SEO
<task>
Crée la section Expertises : un conteneur épinglé (pin) sur 300vh, divisé en
3 scènes de 100vh chacune (SEO, Maps, Logiciel). Une seule scène visible à la
fois, transition entre scènes en power3.inOut 1.2s. À gauche : titre et texte
de la scène en cours ; à droite : la visualisation. Indicateur 01 / 02 / 03
discret en argent.
À l'entrée du conteneur, les 3 fibres se séparent : chacune part vers sa
scène. Dans chaque scène, seule sa fibre est allumée, les deux autres restent
éteintes en arrière-plan.
Scène 1, Site vitrine et SEO (fibre A, or), progression liée au scroll :
1. 0–30 % : la fibre A dessine en pointillés le contour d'une fenêtre de
navigateur (coins arrondis 12px, 3 points en haut à gauche).
2. 30–55 % : dans la fenêtre, une barre de recherche puis 5 résultats de
recherche apparaissent en lignes argent stylisées (pas de vrai texte lisible,
sauf le résultat du client : "Votre entreprise").
3. 55–85 % : le résultat du client, en 4e position, remonte jusqu'à la 1re
(translateY, les autres descendent d'un cran, power3.inOut) et passe en
dégradé or avec un reflet.
4. 85–100 % : un petit label argent "Position 1" apparaît.
</task>
<constraints>
Mobile : pas de pin, les 3 scènes s'empilent verticalement avec une version
raccourcie de chaque animation déclenchée à l'entrée dans le viewport.
</constraints>

C6 : Scène Google Maps
<task>
Crée la scène 2 du conteneur Expertises : Google Maps et visibilité locale
(fibre B, or).
1. 0–40 % : la fibre B se démultiplie en un quadrillage urbain orthogonal
(rues de largeurs variées, 2 ou 3 axes principaux plus larges, coudes
arrondis cohérents avec C1) qui se dessine au scroll en pointillés argent.
2. 40–60 % : 6 à 8 épingles argent mates tombent sur la carte (translateY
-20px vers 0, opacity, stagger 0.06s, expo.out).
3. 60–85 % : une épingle supplémentaire, en or, tombe au centre avec un léger
rebond contrôlé (back.out(1.4) uniquement ici), puis 2 ondes concentriques
type radar s'en échappent (scale 0 vers 3, opacity 0.6 vers 0, 1.2s,
sine.inOut, en boucle tant que la scène est visible, max 2 ondes
simultanées). Les épingles argent baissent à 40 % d'opacité.
4. 85–100 % : une petite carte de fiche établissement s'ouvre à côté de
l'épingle or : nom "Votre entreprise", 5 étoiles or, "Ouvert".
</task>
<constraints>
Aucun fond de carte réel ni tuile Google : uniquement le quadrillage dessiné
par la fibre.
</constraints>

C7 : Scène Logiciel sur mesure
<task>
Crée la scène 3 du conteneur Expertises : Logiciel sur mesure (fibre C,
argent).
1. 0–35 % : la fibre C se ramifie en 4 branches orthogonales, comme un schéma
d'architecture.
2. 35–65 % : au bout de chaque branche, un module se branche (mode "plug") :
Planning, Clients, Facturation, Stock. Chaque module est une carte --surface
avec un fin contour argent, qui s'allume (contour argent clair, opacity)
quand l'impulsion de la fibre l'atteint.
3. 65–90 % : les 4 modules glissent et s'emboîtent en une grille 2×2 compacte
qui forme un dashboard (transform uniquement, power3.inOut, 1.2s). La fibre
se raccourcit pour rester connectée au dashboard.
4. 90–100 % : un reflet argent traverse le dashboard une fois. Label "Conçu
pour votre entreprise".
</task>
<constraints>
Cette scène reste en argent : l'or n'apparaît que sur le label final.
</constraints>

C8 : Résultats et projets
<task>
Crée la section Résultats et projets. Ici les fibres s'effacent pour laisser
parler le travail.
1. À l'entrée, les 3 fibres se rejoignent et passent à 50 % d'opacité, en
marge droite.
2. Trois chiffres clés en grand (ex. "+240 % d'appels", "Top 3 Google", "12 h
gagnées / semaine") [à remplacer par des vrais chiffres]. Le nombre compte de
0 à sa valeur (1.2s, expo.out) en argent, puis passe en dégradé or à la fin.
3. Grille de projets : chaque visuel se révèle par un wrapper en overflow
hidden dont l'image intérieure passe de translateY 12% et scale 1.08 à 0 et 1
(1.2s, expo.out).
4. Hover sur une carte projet : un contour pointillé or se dessine autour de
la carte (stroke-dashoffset, 0.7s), l'image passe à scale 1.03. Rien d'autre.
</task>
<constraints>
Pas de parallax, pas de curseur spécial sur cette section : la sobriété est
volontaire.
</constraints>

C9 : Process
<task>
Crée la section Process en 4 étapes (Échange, Stratégie, Création, Suivi).
1. Les 3 fibres fusionnent en une seule ligne verticale centrée (desktop) qui
devient la timeline.
2. Chaque étape est une jonction : un nœud circulaire de 10px qui s'allume en
or quand l'impulsion l'atteint (fiber:arrive), avec un anneau qui s'étend une
fois (scale 1 vers 2, opacity 0.5 vers 0, 0.7s).
3. Les étapes alternent gauche et droite ; leur contenu se révèle en glissant
depuis la ligne (translateX ±24px vers 0, opacity, 0.7s, expo.out).
</task>
<constraints>
Mobile : ligne à gauche, toutes les étapes à droite.
</constraints>

C10 : Contact et footer
<task>
Crée la section Contact, la conclusion du récit.
1. La ligne unique du Process se redivise en 3 fibres, qui convergent ensuite
toutes vers un seul point : le bouton "Démarrer un projet" (ancres mode
"end").
2. Quand les 3 impulsions arrivent (fiber:arrive pour A, B et C), le bouton
s'allume : contour or dessiné, fond qui passe de transparent à un dégradé or
très léger, texte en noir mat. Un unique flash doux (opacity d'un halo
statique, 0.7s, sine.inOut).
3. Titre au-dessus : "Connectons votre entreprise." révélé par lignes.
4. Footer : un bouton "Retour en haut". Au clic, Lenis remonte la page en
1.6s (power3.inOut) et une impulsion parcourt les fibres en sens inverse, du
bas vers l'ordinateur, synchronisée avec la remontée.
</task>
<verification>
Vérifie que le bouton est cliquable et lisible avant même que l'animation de
convergence soit terminée.
</verification>

C11 : micro-interactions, transitions et reduced motion
La couche de finition, à faire en dernier. C'est elle qui donne la sensation de « craft ».
<task>
Crée la couche de finition globale du site, en 4 modules.
1. Smooth scroll : Lenis (lerp 0.09, wheelMultiplier 1), synchronisé avec le
ticker GSAP et ScrollTrigger. Désactivé sur appareils tactiles (scroll
natif).
2. Micro-interactions :
- Liens texte : un soulignement pointillé argent qui se dessine de gauche
à droite au survol (0.3s, expo.out) et s'efface vers la droite à la sortie.
- Boutons principaux : effet magnétique léger (déplacement max 6px vers le
curseur, retour en 0.7s expo.out) et reflet or qui traverse le bouton une
fois au survol.
- Curseur : curseur natif conservé. Uniquement sur desktop, un petit point
or de 6px qui suit le curseur avec un léger retard (lerp 0.18) et grossit à
32px en anneau argent au survol d'un élément cliquable. Masqué sur tactile.
3. Transitions de page (View Transitions API, fallback fondu simple) :
- Clic sur un projet : l'image de la carte s'agrandit jusqu'à devenir le
visuel d'en-tête de la page projet (morph shared element, 1.2s,

power3.inOut).
- Autres navigations : une impulsion or traverse l'écran de haut en bas le
long d'une fibre (0.7s), la page sortante passe à opacity 0, la page entrante
se révèle par lignes.
4. Reduced motion : un module global qui détecte prefers-reduced-motion,
désactive Lenis, le curseur et les transitions de page, et appelle l'état
final statique de chaque module de scène. Le site reste entièrement lisible
et la DA intacte (fibres dessinées, mots or affichés).
</task>
<constraints>
- Aucune micro-interaction ne dépasse 0.7s.
- Le grain est un overlay CSS statique (image de bruit en background,
pointer-events none), jamais un canvas animé.
- Focus clavier visible sur tous les éléments interactifs : contour or de
2px, offset 3px.
</constraints>
<verification>
Vérifie que la navigation au clavier fonctionne sur tout le site et qu'aucune
animation ne bloque un clic.
</verification>

Checklist qualité finale
À passer avant la mise en ligne. Le dernier point est le plus important : retirer environ 20 %
des animations rend presque toujours le site plus élégant.
La boucle vidéo du hero ne montre aucun saut au point de boucle
La jonction entre la vidéo et la page est invisible (noir identique, bords fondus)
Les fibres partent exactement des 3 ports de l'ordinateur, sur desktop et mobile
Aucun tracé de fibre ne traverse un texte, après resize compris
Un seul point focal en mouvement à la fois, dans chaque section
Aucun texte ne met plus d'une seconde à être lisible
60 fps tenus sur un Android milieu de gamme (onglet Performance de Chrome)
Aucune couleur hors palette noir, or, argent
La version mobile de chaque scène est testée sur un vrai téléphone
prefers-reduced-motion activé : site lisible, DA intacte, aucun mouvement
Navigation clavier complète, focus visible partout
Vidéos de moins de 3 Mo, poster présent, LCP sous 2,5 s

Pass de retrait : environ 20 % des animations supprimées ou simplifiées
```
