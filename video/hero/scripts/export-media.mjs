// Exporte les rendus HyperFrames vers le site : MP4 (H.264, faststart), WebM (VP9) et poster JPG
// de la frame 0 (écran éteint = état de départ de la boucle), sans audio.
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const renders = resolve(here, "../renders");
const out = resolve(here, "../../../public/media");
mkdirSync(out, { recursive: true });

const ffmpeg = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });

for (const name of ["hero-desktop", "hero-mobile"]) {
  const src = resolve(renders, `${name}.mp4`);
  ffmpeg(["-i", src, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", resolve(out, `${name}.mp4`)]);
  ffmpeg(["-i", src, "-an", "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p", resolve(out, `${name}.webm`)]);
  ffmpeg(["-i", src, "-frames:v", "1", "-q:v", "3", resolve(out, `${name}.jpg`)]);
  for (const ext of ["mp4", "webm", "jpg"]) {
    const size = statSync(resolve(out, `${name}.${ext}`)).size;
    console.log(`${name}.${ext}  ${(size / 1024).toFixed(0)} Ko`);
  }
}
