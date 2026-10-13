"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile : vérification anti-robot sans case à cocher dans la plupart des cas (« interaction-only » :
// le widget ne s'affiche que si Cloudflare a un doute). Actif seulement si NEXT_PUBLIC_TURNSTILE_SITE_KEY est défini
// (voir .env.example) ; la route /api/contact vérifie le jeton avec TURNSTILE_SECRET_KEY.

type TurnstileApi = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Props = {
  onToken: (token: string) => void; // "" quand le jeton expire ou en cas d'erreur
  resetKey: number; // incrémenté après chaque envoi : un jeton ne sert qu'une fois
};

export function Turnstile({ onToken, resetKey }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);

  useEffect(() => {
    const api = window.turnstile;
    if (!ready || !api || !box.current) return;
    const id = api.render(box.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "dark",
      language: "fr",
      appearance: "interaction-only",
      callback: (token: string) => callback.current(token),
      "expired-callback": () => callback.current(""),
      "error-callback": () => callback.current(""),
    });
    return () => {
      callback.current("");
      api.remove(id);
    };
  }, [ready, resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={box} className="turnstile" />
    </>
  );
}
