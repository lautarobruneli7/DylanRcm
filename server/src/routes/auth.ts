import { Router, json } from "express";
import {
  clearLoginAttempts, endSession, isAuthenticated, isPasswordConfigured,
  loginRateLimit, requireAuth, setPassword, startSession, verifyPassword,
} from "../auth.js";

export const authRouter = Router();
authRouter.use(json({ limit: "10kb" }));

const MIN_PASSWORD = 8;
const validPassword = (p: unknown): p is string => typeof p === "string" && p.length >= MIN_PASSWORD && p.length <= 200;

authRouter.get("/status", (req, res) => {
  res.json({ configured: isPasswordConfigured(), authenticated: isAuthenticated(req) });
});

// Primera vez: crea la contraseña. Después de configurada, este endpoint queda bloqueado.
authRouter.post("/setup", loginRateLimit, (req, res) => {
  if (isPasswordConfigured()) return void res.status(409).json({ error: "La contraseña ya fue creada" });
  if (!validPassword(req.body?.password)) return void res.status(400).json({ error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres` });
  setPassword(req.body.password);
  startSession(req, res);
  res.json({ ok: true });
});

authRouter.post("/login", loginRateLimit, (req, res) => {
  if (!verifyPassword(String(req.body?.password ?? ""))) return void res.status(401).json({ error: "Contraseña incorrecta" });
  clearLoginAttempts(req);
  startSession(req, res);
  res.json({ ok: true });
});

authRouter.post("/logout", (_req, res) => {
  endSession(res);
  res.json({ ok: true });
});

authRouter.post("/password", requireAuth, (req, res) => {
  if (!verifyPassword(String(req.body?.current ?? ""))) return void res.status(401).json({ error: "La contraseña actual no coincide" });
  if (!validPassword(req.body?.next)) return void res.status(400).json({ error: `La nueva contraseña debe tener al menos ${MIN_PASSWORD} caracteres` });
  setPassword(req.body.next);
  startSession(req, res);
  res.json({ ok: true });
});
