import "server-only";

import { SITE } from "@/lib/site";

// Gabarits des e-mails : HTML à styles en ligne (seule forme fiable dans les messageries) + version texte.
// Couleurs de la charte ; l'or est en dégradé avec une couleur de repli pour les messageries qui l'ignorent.

const C = { black: "#0B0B0C", surface: "#141416", text: "#E3E6EA", muted: "#A8ADB4", gold: "#B8913E" };
const GOLD_GRADIENT = "linear-gradient(90deg,#8C6A2A,#E8C77A 50%,#B8913E)";

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

type Block = { kind: "p"; text: string } | { kind: "button"; label: string; href: string } | { kind: "list"; items: [string, string][] } | { kind: "small"; text: string };

export function renderMail({ preheader, title, blocks }: { preheader: string; title: string; blocks: Block[] }) {
  const body = blocks
    .map((b) => {
      if (b.kind === "p") return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.text}">${escapeHtml(b.text)}</p>`;
      if (b.kind === "small") return `<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:${C.muted}">${escapeHtml(b.text)}</p>`;
      if (b.kind === "button")
        return `<p style="margin:28px 0"><a href="${escapeHtml(b.href)}" style="display:inline-block;padding:14px 26px;border-radius:999px;background:${C.gold};background-image:${GOLD_GRADIENT};color:${C.black};font-size:14px;font-weight:600;text-decoration:none">${escapeHtml(b.label)}</a></p>`;
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border-collapse:collapse">${b.items
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;font-size:13px;color:${C.muted};width:40%">${escapeHtml(k)}</td><td style="padding:8px 0;vertical-align:top;font-size:13px;color:${C.text};white-space:pre-line">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`;
    })
    .join("");

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${C.black}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.black}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.surface};border-radius:14px"><tr><td style="padding:36px 32px;font-family:Helvetica,Arial,sans-serif">
<p style="margin:0 0 28px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.muted}">${escapeHtml(SITE.name)}</p>
<h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;line-height:1.2;color:${C.text}">${escapeHtml(title)}</h1>
${body}
</td></tr></table>
<p style="margin:20px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${C.muted}">${escapeHtml(SITE.name)} · ${escapeHtml(new URL(SITE.url).hostname)}</p>
</td></tr></table></body></html>`;

  const text = [
    title,
    "",
    ...blocks.map((b) =>
      b.kind === "button" ? `${b.label} : ${b.href}` : b.kind === "list" ? b.items.map(([k, v]) => `${k} : ${v}`).join("\n") : b.text,
    ),
    "",
    `— ${SITE.name}`,
  ].join("\n\n");

  return { html, text };
}
