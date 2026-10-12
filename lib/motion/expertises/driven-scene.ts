import type { MotionModule } from "../use-motion-module";

// Scène Expertises pilotable par le conteneur épinglé (C5) : progression 0 → 1 liée au scroll,
// visibilité (la scène n'anime ses boucles que lorsqu'elle est affichée).
export type DrivenScene = MotionModule & {
  setProgress: (progress: number) => void;
  setVisible: (visible: boolean) => void;
};

export type DrivenSceneFactory = (root: HTMLElement, options?: { driven?: boolean }) => DrivenScene;
