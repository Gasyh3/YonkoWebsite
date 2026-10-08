// Exporte les rendus HyperFrames vers le site : MP4 (H.264, faststart), WebM (VP9) et poster JPG, sans audio.
// Posters : l'ordinateur sur l'image de relais (signature, d'où repart la boucle sur le site),
// l'intro sur sa première image.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const renders = resolve(here, "../renders");
const out = resolve(here, "../../../public/media");
mkdirSync(out, { recursive: true });

const ffmpeg = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });

const { timing } = JSON.parse(readFileSync(resolve(here, "../../../lib/motion/hero-ports.json"), "utf8"));
const posterAt = { "hero-computer": timing.handoff, "hero-intro": 0 };

for (const name of ["hero-computer", "hero-intro"]) {
  const src = resolve(renders, `${name}.mp4`);
  ffmpeg(["-i", src, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", resolve(out, `${name}.mp4`)]);
  ffmpeg(["-i", src, "-an", "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p", resolve(out, `${name}.webm`)]);
  ffmpeg(["-ss", String(posterAt[name]), "-i", src, "-frames:v", "1", "-q:v", "3", resolve(out, `${name}.jpg`)]);
  for (const ext of ["mp4", "webm", "jpg"]) {
    const size = statSync(resolve(out, `${name}.${ext}`)).size;
    console.log(`${name}.${ext}  ${(size / 1024).toFixed(0)} Ko`);
  }
}
