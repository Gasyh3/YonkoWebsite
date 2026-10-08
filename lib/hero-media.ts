// Médias de la vidéo hero (rendus HyperFrames depuis video/hero, exportés dans public/media).
// Tant que `ready` vaut false, le hero affiche un repère statique aligné sur les ports.
export const heroMedia = {
  ready: false,
  loopDuration: 8, // s : durée de la boucle V1
  glintAt: 3.5, // s : moment où la lumière descend vers les ports → reflet sur les mots or
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
