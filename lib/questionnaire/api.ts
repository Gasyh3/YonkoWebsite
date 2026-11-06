import "server-only";

import { NextResponse } from "next/server";

// Réponses des routes du questionnaire : { ok: true, … } ou { ok: false, message, errors? }.
export type ApiResult = { ok: true; [key: string]: unknown } | { ok: false; message: string; errors?: Record<string, string> };

export const json = (body: ApiResult, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const unavailable = () =>
  json({ ok: false, message: "Le questionnaire est momentanément indisponible. Réessayez un peu plus tard." }, 503);
