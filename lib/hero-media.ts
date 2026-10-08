import heroVideo from "./motion/hero-ports.json";

// Médias du hero : rendus HyperFrames (video/hero) exportés par `npm run export` dans public/media.
//   computer : l'ordinateur seul (cadre 6:5), boucle de 12s, placé dans la colonne droite du hero
//   intro    : la bande démo en plein écran (16:9), jouée à la 1re visite puis « rentrée » dans l'écran
export const heroMedia = {
  loopDuration: heroVideo.timing.loop,
  glintAt: heroVideo.timing.glint, // la signature apparaît, les 3 ports respirent → reflet sur les mots or
  handoffAt: heroVideo.timing.handoff, // image commune à la fin de l'intro et à l'écran de l'ordinateur
  screen: heroVideo.screen, // position de l'écran dans le cadre de l'ordinateur (%)
  computer: {
    webm: "/media/hero-computer.webm",
    mp4: "/media/hero-computer.mp4",
    poster: "/media/hero-computer.jpg",
  },
  intro: {
    webm: "/media/hero-intro.webm",
    mp4: "/media/hero-intro.mp4",
    poster: "/media/hero-intro.jpg",
  },
} as const;
