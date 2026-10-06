import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SiteContent } from "@/types/content";

/** Mensaje que el panel envía al iframe de vista previa con el borrador actual. */
export const PREVIEW_MESSAGE = "dylan:preview-content";

/**
 * Normal: carga el contenido publicado.
 * Modo vista previa (?preview=1, dentro del panel): espera el borrador por postMessage y se actualiza en vivo.
 */
export function useContent(preview: boolean) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (preview) {
      const onMessage = (e: MessageEvent) => {
        if (e.origin === window.location.origin && e.data?.type === PREVIEW_MESSAGE) setContent(e.data.content);
      };
      window.addEventListener("message", onMessage);
      window.parent.postMessage({ type: "dylan:preview-ready" }, window.location.origin);
      return () => window.removeEventListener("message", onMessage);
    }
    api.getContent().then(setContent).catch(() => setError(true));
  }, [preview]);

  return { content, error };
}
