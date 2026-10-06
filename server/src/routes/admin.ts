// ==================== API DEL PANEL ====================
// Modelo borrador/publicado: el panel edita "draft"; "Publicar" lo copia a "published".
import { Router, json, raw } from "express";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { requireAuth } from "../auth.js";
import { config, uploadsDir } from "../config.js";
import { validateContent } from "../content.js";
import { getJson, getRaw, setJson } from "../db.js";

export const adminRouter = Router();
adminRouter.use(requireAuth);

const state = () => {
  const draft = getJson<Record<string, unknown>>("draft")!;
  const published = getJson<Record<string, unknown>>("published")!;
  return {
    draft: draft.data,
    draftSavedAt: draft.updatedAt,
    publishedAt: published.updatedAt,
    hasChanges: getRaw("draft")!.value !== getRaw("published")!.value,
  };
};

adminRouter.get("/draft", (_req, res) => res.json(state()));

adminRouter.put("/draft", json({ limit: "2mb" }), (req, res) => {
  const result = validateContent(req.body);
  if (!result.ok) return void res.status(400).json({ error: result.error });
  setJson("draft", result.content);
  res.json(state());
});

adminRouter.post("/publish", (_req, res) => {
  setJson("published", getJson("draft")!.data);
  res.json(state());
});

adminRouter.post("/discard", (_req, res) => {
  setJson("draft", getJson("published")!.data);
  res.json(state());
});

// ---------- Subida de imágenes (el navegador ya las optimiza antes de enviarlas) ----------
const IMAGE_SIGNATURES: { ext: string; test: (b: Buffer) => boolean }[] = [
  { ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 },
  { ext: "png", test: (b) => b.subarray(0, 4).toString("hex") === "89504e47" },
  { ext: "webp", test: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
  { ext: "gif", test: (b) => b.subarray(0, 3).toString() === "GIF" },
];

adminRouter.post("/upload", raw({ type: "image/*", limit: config.maxUploadBytes }), (req, res) => {
  const body = req.body as Buffer;
  if (!Buffer.isBuffer(body) || body.length === 0) return void res.status(400).json({ error: "Archivo de imagen inválido" });
  const kind = IMAGE_SIGNATURES.find((s) => s.test(body));
  if (!kind) return void res.status(400).json({ error: "Formato no soportado (usá JPG, PNG, WebP o GIF)" });
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${kind.ext}`;
  fs.writeFileSync(path.join(uploadsDir, name), body);
  res.json({ url: `/uploads/${name}` });
});

// ---------- Datos de YouTube para autocompletar el título ----------
adminRouter.get("/youtube-info", async (req, res) => {
  const id = String(req.query.id ?? "");
  if (!/^[\w-]{11}$/.test(id)) return void res.status(400).json({ error: "ID de video inválido" });
  try {
    const target = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    const response = await fetch(target, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return void res.status(404).json({ error: "No se encontró el video (¿es privado?)" });
    const data = (await response.json()) as { title?: string; author_name?: string };
    res.json({ title: data.title ?? "", author: data.author_name ?? "" });
  } catch {
    res.status(502).json({ error: "No se pudo consultar YouTube; completá el título a mano" });
  }
});
