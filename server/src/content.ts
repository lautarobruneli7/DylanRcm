// ==================== VALIDACIÓN DE CONTENIDO ====================
// Sanea el JSON que llega desde el panel: forma básica + URLs seguras (sin javascript:, data:, etc.).

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
const URL_KEY = /(url|image|avatar|banner|thumbnail)$/i;
const REQUIRED_ARRAYS = ["news", "videos", "contacts"] as const;
const REQUIRED_OBJECTS = ["settings", "general", "sections"] as const;

function cleanUrls(value: unknown, key = ""): unknown {
  if (Array.isArray(value)) return value.map((v) => cleanUrls(v, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cleanUrls(v, k)]));
  }
  if (typeof value === "string" && URL_KEY.test(key)) {
    const trimmed = value.trim();
    return trimmed === "" || SAFE_URL.test(trimmed) ? trimmed : "";
  }
  return value;
}

export function validateContent(input: unknown): { ok: true; content: Record<string, unknown> } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "Contenido inválido" };
  const obj = input as Record<string, unknown>;
  for (const k of REQUIRED_OBJECTS) {
    if (!obj[k] || typeof obj[k] !== "object" || Array.isArray(obj[k])) return { ok: false, error: `Falta la sección "${k}"` };
  }
  for (const k of REQUIRED_ARRAYS) {
    if (!Array.isArray(obj[k])) return { ok: false, error: `Falta la lista "${k}"` };
  }
  return { ok: true, content: cleanUrls(obj) as Record<string, unknown> };
}
