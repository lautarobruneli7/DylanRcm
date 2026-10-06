// ==================== SERVIDOR ====================
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { config, uploadsDir } from "./config.js";
import { getJson, seedIfEmpty } from "./db.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";

seedIfEmpty();

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// API pública: solo contenido publicado.
app.get("/api/content", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.json(getJson("published")!.data);
});
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", (_req, res) => void res.status(404).json({ error: "No encontrado" }));

app.use("/uploads", express.static(uploadsDir, { maxAge: "365d", immutable: true }));

// Front compilado (npm run build en /web). En desarrollo lo sirve Vite.
const indexPath = path.join(config.webDistDir, "index.html");
if (fs.existsSync(indexPath)) {
  app.use(express.static(config.webDistDir, { index: false, maxAge: "1h" }));
  const escape = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

  // Inyecta título/descripción/Open Graph del contenido publicado (SEO sin depender de JS).
  app.get(/.*/, (req, res) => {
    const settings = (getJson<{ settings: Record<string, string> }>("published")!.data.settings ?? {}) as Record<string, string>;
    const origin = `${req.protocol}://${req.get("host")}`;
    const image = settings.shareImage ? new URL(settings.shareImage, origin).href : "";
    // Se lee en cada pedido para tomar siempre el build más reciente (archivo chico, sin costo real).
    const html = fs.readFileSync(indexPath, "utf8")
      .replaceAll("__TITLE__", escape(settings.siteTitle))
      .replaceAll("__DESCRIPTION__", escape(settings.metaDescription))
      .replaceAll("__OG_IMAGE__", escape(image))
      .replaceAll("__ACCENT__", escape(settings.accent || "#e3241d"));
    res.setHeader("Cache-Control", "no-cache");
    res.type("html").send(html);
  });
} else {
  app.get("/", (_req, res) => void res.type("text").send("Front no compilado. Ejecutá `npm run build` en /web o usá `npm run dev`."));
}

app.listen(config.port, () => console.log(`Servidor en http://localhost:${config.port}  (admin: /admin)`));
