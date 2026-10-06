import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { optimizeImage } from "@/lib/image";
import { toast } from "@/lib/toast";

interface Props { label: string; value: string; onChange: (url: string) => void; hint?: string; aspect?: "video" | "square" }

/** Sube la imagen (optimizada en el navegador) y guarda solo la URL resultante. */
export function ImageField({ label, value, onChange, hint, aspect = "video" }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return void toast("Elegí un archivo de imagen", "error");
    setBusy(true);
    try {
      const { url } = await api.upload(await optimizeImage(file));
      onChange(url);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-white/90">{label}</span>
      <div className="flex items-center gap-4">
        <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/20 bg-surface-2 ${aspect === "square" ? "h-20 w-20" : "h-20 w-36"}`}>
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="px-2 text-center text-xs text-muted">Sin imagen</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost !min-h-10" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Subiendo…" : value ? "Cambiar" : "Subir imagen"}
          </button>
          {value && !busy && <button type="button" className="btn-ghost !min-h-10" onClick={() => onChange("")}>Quitar</button>}
        </div>
        <input ref={input} type="file" accept="image/*" className="sr-only" onChange={(e) => void handleFile(e.target.files?.[0])} aria-label={`Elegir archivo para ${label}`} />
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
