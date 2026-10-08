import { Instrument_Serif, Inter_Tight } from "next/font/google";

// Seul endroit où les polices sont déclarées : pour en changer, modifier uniquement ce fichier.
// Titres : serif display fin (alternative libre à Canela / PP Editorial New).
export const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Texte et UI : grotesque fine (alternative libre à Neue Montreal).
export const fontSans = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});
