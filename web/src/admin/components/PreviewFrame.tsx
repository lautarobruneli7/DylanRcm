import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/types/content";
import { PREVIEW_MESSAGE } from "@/landing/useContent";

/** Landing real dentro de un iframe; recibe el borrador por postMessage, así que se actualiza mientras se escribe. */
export function PreviewFrame({ content, onClose }: { content: SiteContent; onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onReady = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "dylan:preview-ready") setReady(true);
    };
    window.addEventListener("message", onReady);
    return () => window.removeEventListener("message", onReady);
  }, []);

  useEffect(() => {
    if (ready) frame.current?.contentWindow?.postMessage({ type: PREVIEW_MESSAGE, content }, window.location.origin);
  }, [content, ready]);

  return (
    <aside className="fixed inset-0 z-50 flex flex-col bg-ink xl:sticky xl:top-[var(--admin-header)] xl:z-auto xl:h-[calc(100vh-var(--admin-header))] xl:border-l xl:border-line" aria-label="Vista previa">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="font-display text-lg uppercase tracking-wide">Vista previa <span className="ml-1 text-xs font-sans font-semibold normal-case text-muted">(borrador, aún no publicado)</span></p>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-line p-0.5 text-xs font-bold">
            <button type="button" onClick={() => setMobile(false)} className={`rounded-md px-3 py-1.5 ${!mobile ? "bg-white text-black" : "text-muted"}`}>Escritorio</button>
            <button type="button" onClick={() => setMobile(true)} className={`rounded-md px-3 py-1.5 ${mobile ? "bg-white text-black" : "text-muted"}`}>Celular</button>
          </div>
          <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={onClose} aria-label="Cerrar vista previa">✕</button>
        </div>
      </div>
      <div className="flex flex-1 justify-center overflow-auto bg-surface-2 p-0 sm:p-3">
        <iframe
          ref={frame} src="/?preview=1" title="Vista previa de la landing"
          className={`h-full bg-ink ${mobile ? "w-[390px] max-w-full rounded-xl border border-line" : "w-full"}`}
        />
      </div>
    </aside>
  );
}
