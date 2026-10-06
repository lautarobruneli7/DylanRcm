import type { NewsItem, SectionMeta } from "@/types/content";
import { formatDate, todayISO } from "@/lib/format";
import { ImageField } from "../components/ImageField";
import { ListEditor } from "../components/ListEditor";
import { SectionTexts } from "../components/SectionTexts";
import { Checkbox, Field, TextArea, TextInput } from "../components/ui";

interface Props { items: NewsItem[]; meta: SectionMeta; onItems: (i: NewsItem[]) => void; onMeta: (m: SectionMeta) => void }

export function NewsEditor({ items, meta, onItems, onMeta }: Props) {
  return (
    <div className="grid gap-6">
      <SectionTexts meta={meta} onChange={onMeta} />
      <ListEditor<NewsItem>
        items={items} onChange={onItems} itemNoun="novedad" addLabel="Nueva novedad" addAtTop
        emptyText="Todavía no hay novedades. Creá la primera con el botón de arriba."
        makeNew={() => ({ title: "", description: "", image: "", date: todayISO(), url: "", featured: false })}
        summary={(n) => ({
          title: n.title, subtitle: formatDate(n.date), badges: n.featured ? ["Destacada"] : [],
          thumb: n.image ? <img src={n.image} alt="" className="h-12 w-16 shrink-0 rounded object-cover" /> : undefined,
        })}
        renderForm={(n, patch) => (
          <>
            <TextInput label="Título" value={n.title} onChange={(title) => patch({ title })} placeholder="Ej: Mi equipo para la Gameweek 8" />
            <TextArea label="Descripción" value={n.description} onChange={(description) => patch({ description })} rows={4} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fecha">{(id) => <input id={id} type="date" className="input" value={n.date} onChange={(e) => patch({ date: e.target.value })} />}</Field>
              <TextInput label="Link externo (opcional)" type="url" value={n.url} onChange={(url) => patch({ url })} placeholder="https://…" />
            </div>
            <ImageField label="Imagen (opcional)" value={n.image} onChange={(image) => patch({ image })} />
            <Checkbox label="Destacar esta novedad" hint="La primera destacada se muestra grande arriba de todas." checked={n.featured} onChange={(featured) => patch({ featured })} />
          </>
        )}
      />
    </div>
  );
}
