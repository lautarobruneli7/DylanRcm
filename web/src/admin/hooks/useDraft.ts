import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { SiteContent } from "@/types/content";

export type SaveStatus = "saved" | "dirty" | "saving" | "error";
const AUTOSAVE_MS = 700;

/**
 * Estado del borrador del panel. Cada cambio se guarda solo (con debounce) en el servidor;
 * "Publicar" es el único paso que lo hace visible para los visitantes.
 */
export function useDraft() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [hasChanges, setHasChanges] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [loadError, setLoadError] = useState("");

  const latest = useRef<SiteContent | null>(null);
  const timer = useRef<number>(0);
  const inFlight = useRef(false);
  const queued = useRef(false);

  useEffect(() => {
    api.getDraft()
      .then((s) => { latest.current = s.draft; setContent(s.draft); setHasChanges(s.hasChanges); setPublishedAt(s.publishedAt); })
      .catch((e) => setLoadError(e.message));
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) { queued.current = true; return true; }
    inFlight.current = true;
    setStatus("saving");
    try {
      const s = await api.saveDraft(latest.current!);
      setHasChanges(s.hasChanges);
      setStatus(queued.current ? "saving" : "saved");
      return true;
    } catch (e) {
      setStatus("error");
      toast(`No se pudo guardar: ${(e as Error).message}`, "error");
      return false;
    } finally {
      inFlight.current = false;
      if (queued.current) { queued.current = false; void save(); }
    }
  }, []);

  const update = useCallback((recipe: (draft: SiteContent) => SiteContent) => {
    if (!latest.current) return;
    latest.current = recipe(latest.current);
    setContent(latest.current);
    setStatus("dirty");
    setHasChanges(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void save(), AUTOSAVE_MS);
  }, [save]);

  const publish = useCallback(async () => {
    window.clearTimeout(timer.current);
    if (!(await save())) return;
    try {
      const s = await api.publish();
      setHasChanges(s.hasChanges); setPublishedAt(s.publishedAt);
      toast("¡Cambios publicados! Ya se ven en la web.");
    } catch (e) { toast((e as Error).message, "error"); }
  }, [save]);

  const discard = useCallback(async () => {
    window.clearTimeout(timer.current);
    try {
      const s = await api.discard();
      latest.current = s.draft; setContent(s.draft); setHasChanges(false); setStatus("saved");
      toast("Cambios descartados. Volviste a la versión publicada.", "info");
    } catch (e) { toast((e as Error).message, "error"); }
  }, []);

  // Avisa si se intenta cerrar la pestaña con cambios sin guardar en el servidor.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => { if (status === "dirty" || status === "saving") e.preventDefault(); };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [status]);

  return { content, status, hasChanges, publishedAt, loadError, update, publish, discard };
}
