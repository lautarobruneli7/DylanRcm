// ==================== BASE DE DATOS ====================
// SQLite embebido (node:sqlite). Tabla clave/valor: draft, published, password_hash, session_secret.
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { config, uploadsDir } from "./config.js";
import { seedContent } from "./seed.js";

fs.mkdirSync(uploadsDir, { recursive: true });
const db = new DatabaseSync(path.join(config.dataDir, "dylan.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)");

const getStmt = db.prepare("SELECT value, updated_at FROM kv WHERE key = ?");
const setStmt = db.prepare(
  "INSERT INTO kv (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
);

export function getRaw(key: string): { value: string; updatedAt: string } | null {
  const row = getStmt.get(key) as { value: string; updated_at: string } | undefined;
  return row ? { value: row.value, updatedAt: row.updated_at } : null;
}

export function setRaw(key: string, value: string) {
  setStmt.run(key, value, new Date().toISOString());
}

export function getJson<T>(key: string): { data: T; updatedAt: string } | null {
  const raw = getRaw(key);
  return raw ? { data: JSON.parse(raw.value) as T, updatedAt: raw.updatedAt } : null;
}

export function setJson(key: string, data: unknown) {
  setRaw(key, JSON.stringify(data));
}

/** Secreto para firmar sesiones; se genera una sola vez. */
export function getSessionSecret(): string {
  let secret = getRaw("session_secret")?.value;
  if (!secret) {
    secret = randomBytes(32).toString("hex");
    setRaw("session_secret", secret);
  }
  return secret;
}

/** Primera ejecución: carga el contenido inicial y copia las imágenes de ejemplo. */
export function seedIfEmpty() {
  if (getRaw("published")) return;
  for (const file of fs.readdirSync(config.seedAssetsDir)) {
    const target = path.join(uploadsDir, file);
    if (!fs.existsSync(target)) fs.copyFileSync(path.join(config.seedAssetsDir, file), target);
  }
  setJson("published", seedContent);
  setJson("draft", seedContent);
}
