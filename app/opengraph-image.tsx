import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

// Image de partage (réseaux sociaux, messageries) commune à tout le site, générée au build dans la DA :
// noir mat, trois fibres pointillées argent dont une parcourue d'or jusqu'à un nœud.
export const alt = `${SITE.name} : être vu, être trouvé, être efficace`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Valeurs des tokens de app/globals.css (le rendu de l'image n'a pas accès aux variables CSS).
const BLACK = "#0B0B0C";
const GOLD = ["#8C6A2A", "#E8C77A", "#B8913E"];
const SILVER = "#A8ADB4";
const SILVER_LIGHT = "#E3E6EA";
const FIBER_OFF = "rgba(168, 173, 180, .18)";

export default async function OpengraphImage() {
  // Polices du site (Instrument Serif, Inter Tight ; licence OFL) embarquées : le rendu ne dépend pas du réseau.
  const [icon, serif, sans] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/images/icon.png")),
    readFile(join(process.cwd(), "lib/og/InstrumentSerif-Regular.ttf")),
    readFile(join(process.cwd(), "lib/og/InterTight-Regular.ttf")),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BLACK,
          padding: "72px 80px",
          color: SILVER_LIGHT,
          fontFamily: "Inter Tight",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={iconSrc} width={56} height={56} alt="" style={{ borderRadius: 12 }} />
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: SILVER, textTransform: "uppercase" }}>
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 26, fontFamily: "Instrument Serif", fontSize: 86, lineHeight: 1.2, whiteSpace: "nowrap" }}>
            <span>Être vu.</span>
            <span
              style={{
                backgroundImage: `linear-gradient(90deg, ${GOLD[0]}, ${GOLD[1]} 50%, ${GOLD[2]})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Être trouvé.
            </span>
            <span>Être efficace.</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: SILVER, maxWidth: 1000 }}>
            Agence web à Madagascar, pour PME, commerçants et artisans.
          </div>
        </div>

        <svg width="1040" height="64" viewBox="0 0 1040 64">
          <defs>
            <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="4" y1="0" x2="642" y2="0">
              <stop offset="0" stopColor={GOLD[0]} />
              <stop offset="0.5" stopColor={GOLD[1]} />
              <stop offset="1" stopColor={GOLD[2]} />
            </linearGradient>
          </defs>
          {[8, 32, 56].map((y) => (
            <line key={y} x1="4" y1={y} x2="1036" y2={y} stroke={FIBER_OFF} strokeWidth="4" strokeLinecap="round" strokeDasharray="0 14" />
          ))}
          <line x1="4" y1="32" x2="620" y2="32" stroke="url(#gold)" strokeWidth="4" strokeLinecap="round" strokeDasharray="0 14" />
          <circle cx="634" cy="32" r="8" fill="url(#gold)" />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Tight", data: sans, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
      ],
    },
  );
}
