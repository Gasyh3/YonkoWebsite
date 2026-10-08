// Version 9:16 pour tout écran en portrait (téléphones, tablettes debout), 16:9 sinon.
// Partagée par la vidéo, son poster, les styles et le FiberSystem (choix des ports).
export const HERO_PORTRAIT_QUERY = "(max-width: 767px), (orientation: portrait)";

// Médias de la vidéo hero : rendus HyperFrames (video/hero) exportés par `npm run export` dans public/media.
export const heroMedia = {
  loopDuration: 12, // s : durée de la boucle (video/hero, data-duration)
  glintAt: 9.2, // s : apparition de la signature, les 3 ports respirent → reflet sur les mots or
  desktop: {
    webm: "/media/hero-desktop.webm",
    mp4: "/media/hero-desktop.mp4",
    poster: "/media/hero-desktop.jpg",
  },
  mobile: {
    webm: "/media/hero-mobile.webm",
    mp4: "/media/hero-mobile.mp4",
    poster: "/media/hero-mobile.jpg",
  },
} as const;
