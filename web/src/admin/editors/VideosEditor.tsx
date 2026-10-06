import { useRef, useState } from "react";
import type { SectionMeta, VideoItem } from "@/types/content";
import { api } from "@/lib/api";
import { newId } from "@/lib/ids";
import { toast } from "@/lib/toast";
import { parseYouTubeId, youtubeThumb } from "@/lib/youtube";
import { ImageField } from "../components/ImageField";
import { ListEditor } from "../components/ListEditor";
import { SectionTexts } from "../components/SectionTexts";
import { Checkbox, TextArea, TextInput } from "../components/ui";

interface Props { items: VideoItem[]; meta: SectionMeta; onItems: (i: VideoItem[]) => void; onMeta: (m: SectionMeta) => void }

export function VideosEditor({ items, meta, onItems, onMeta }: Props) {
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const latest = useRef(items);
  latest.current = items;

  /** Pegar el link alcanza: se extrae el ID y se intenta traer el título desde YouTube. */
  async function addFromLink() {
    const youtubeId = parseYouTubeId(link);
    if (!youtubeId) return void toast("Ese link no parece ser de YouTube. Probá copiarlo de nuevo.", "error");
    if (latest.current.some((v) => v.youtubeId === youtubeId)) return void toast("Ese video ya está cargado.", "info");
    const video: VideoItem = {
      id: newId(), url: link.trim(), youtubeId, title: "", description: "", thumbnail: "", featured: false, visible: true,
    };
    onItems([video, ...latest.current]);
    setLink("");
    setBusy(true);
    try {
      const info = await api.youtubeInfo(youtubeId);
      onItems(latest.current.map((v) => (v.id === video.id && !v.title ? { ...v, title: info.title } : v)));
      toast("Video agregado");
    } catch {
      toast("Video agregado. No pude traer el título automáticamente: completalo a mano.", "info");
    } finally {
      setBusy(false);
    }
  }

  const header = (
    <>
      <SectionTexts meta={meta} onChange={onMeta} />
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-2xl uppercase tracking-wide">Agregar un video</h2>
        <p className="mt-1 text-sm text-muted">Pegá el link de YouTube (watch, youtu.be, shorts o en vivo). La miniatura se obtiene sola.</p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void addFromLink(); }}>
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" aria-label="Link de YouTube" inputMode="url" />
          <button type="submit" className="btn-primary shrink-0" disabled={!link.trim() || busy}>{busy ? "Agregando…" : "+ Agregar video"}</button>
        </form>
      </section>
    </>
  );

  return (
    <ListEditor<VideoItem>
      items={items} onChange={onItems} itemNoun="video" header={header}
      emptyText="Todavía no hay videos. Pegá un link de YouTube arriba para sumar el primero."
      summary={(v) => ({
        title: v.title, subtitle: `youtu.be/${v.youtubeId}`, badges: v.featured ? ["Destacado"] : [],
        thumb: <img src={v.thumbnail || youtubeThumb(v.youtubeId)} alt="" className="h-12 w-20 shrink-0 rounded object-cover" />,
      })}
      renderForm={(v, patch) => {
        const parsed = parseYouTubeId(v.url);
        return (
          <>
            <TextInput
              label="Link de YouTube" value={v.url} type="url"
              hint={parsed ? `Video detectado (${parsed}).` : "No se reconoce el link: el video no se mostrará en la web hasta corregirlo."}
              onChange={(url) => patch({ url, youtubeId: parseYouTubeId(url) ?? "" })}
            />
            <TextInput label="Título" value={v.title} onChange={(title) => patch({ title })} />
            <TextArea label="Descripción (opcional)" value={v.description} onChange={(description) => patch({ description })} rows={3} />
            <ImageField label="Miniatura personalizada (opcional)" value={v.thumbnail} onChange={(thumbnail) => patch({ thumbnail })} hint="Si no subís ninguna, se usa la miniatura de YouTube." />
            <Checkbox label="Destacar este video" hint="El primer video destacado se muestra grande arriba de la lista." checked={v.featured} onChange={(featured) => patch({ featured })} />
          </>
        );
      }}
    />
  );
}
