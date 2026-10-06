// ==================== AUTENTICACIÓN ====================
// Una sola cuenta de administrador. La contraseña se crea la primera vez que se entra a /admin.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { getRaw, getSessionSecret, setRaw } from "./db.js";

const COOKIE = "dylan_session";

export const isPasswordConfigured = () => Boolean(getRaw("password_hash"));

export function setPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  setRaw("password_hash", `${salt}:${hash}`);
  // Rotar el secreto invalida las sesiones abiertas anteriores.
  setRaw("session_secret", randomBytes(32).toString("hex"));
}

export function verifyPassword(password: string): boolean {
  const stored = getRaw("password_hash")?.value;
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

const sign = (payload: string) => createHmac("sha256", getSessionSecret()).update(payload).digest("hex");

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function isAuthenticated(req: Request): boolean {
  const token = readCookie(req, COOKIE);
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = sign(expires);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function startSession(req: Request, res: Response) {
  const maxAgeMs = config.sessionDays * 24 * 60 * 60 * 1000;
  const expires = String(Date.now() + maxAgeMs);
  const secure = req.secure || req.headers["x-forwarded-proto"] === "https";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${expires}.${sign(expires)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(maxAgeMs / 1000)}${secure ? "; Secure" : ""}`,
  );
}

export function endSession(res: Response) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) return void res.status(401).json({ error: "No autorizado" });
  next();
}

// Limita intentos de login por IP: 10 cada 15 minutos.
const attempts = new Map<string, { count: number; resetAt: number }>();
export function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
  else if (++entry.count > 10) return void res.status(429).json({ error: "Demasiados intentos. Probá en unos minutos." });
  next();
}
export const clearLoginAttempts = (req: Request) => attempts.delete(req.ip ?? "unknown");
