// Copie lib/motion/hero-ports.json (source unique, partagée avec le FiberSystem du site)
// en assets/ports.js, chargé par les compositions sans requête réseau au rendu.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../../lib/motion/hero-ports.json");
const target = resolve(here, "../assets/ports.js");
const ports = JSON.parse(readFileSync(source, "utf8"));
delete ports.$comment;
writeFileSync(
  target,
  `// Généré par scripts/sync-ports.mjs depuis lib/motion/hero-ports.json — ne pas modifier à la main.\nwindow.HERO_PORTS = ${JSON.stringify(ports, null, 2)};\n`,
);
console.log(`ports synchronisés → ${target}`);
