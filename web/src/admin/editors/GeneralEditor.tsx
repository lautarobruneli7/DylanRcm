import type { FeaturedLink, General, Highlight } from "@/types/content";
import type { SectionMeta } from "@/types/content";
import { ImageField } from "../components/ImageField";
import { ListEditor } from "../components/ListEditor";
import { SectionTexts } from "../components/SectionTexts";
import { Panel, TextArea, TextInput } from "../components/ui";

interface Props { general: General; about: SectionMeta; onGeneral: (g: General) => void; onAbout: (m: SectionMeta) => void }

export function GeneralEditor({ general: g, about, onGeneral, onAbout }: Props) {
  const set = <K extends keyof General>(key: K, value: General[K]) => onGeneral({ ...g, [key]: value });
  return (
    <div className="grid gap-6">
      <Panel title="Portada" description="Lo primero que ve el visitante.">
        <TextInput label="Nombre" value={g.name} onChange={(v) => set("name", v)} />
        <TextInput label="Título o profesión" value={g.role} onChange={(v) => set("role", v)} placeholder="Ej: FPL & UCL Fantasy Tips" />
        <TextInput label="Frase de presentación" value={g.intro} onChange={(v) => set("intro", v)} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageField label="Foto de perfil / logo" value={g.avatar} onChange={(v) => set("avatar", v)} aspect="square" />
          <ImageField label="Imagen principal (banner)" value={g.banner} onChange={(v) => set("banner", v)} hint="Se muestra de fondo en la portada." />
        </div>
      </Panel>

      <Panel title="Botones de la portada" description="El botón principal es el que más se destaca. Para saltar a una sección usá #videos, #news o #contacts.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Botón principal: texto" value={g.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
          <TextInput label="Botón principal: link" value={g.ctaUrl} onChange={(v) => set("ctaUrl", v)} />
          <TextInput label="Botón secundario: texto" value={g.secondaryCtaLabel} onChange={(v) => set("secondaryCtaLabel", v)} />
          <TextInput label="Botón secundario: link" value={g.secondaryCtaUrl} onChange={(v) => set("secondaryCtaUrl", v)} />
        </div>
      </Panel>

      <SectionTexts meta={about} onChange={onAbout} note="Sección con la bio, datos destacados y links." />
      <Panel>
        <TextArea label="Descripción / bio" value={g.bio} onChange={(v) => set("bio", v)} rows={6} hint="Los saltos de línea se respetan." />
      </Panel>

      <div className="grid gap-3">
        <h2 className="font-display text-2xl uppercase tracking-wide">Datos destacados</h2>
        <ListEditor<Highlight>
          items={g.highlights} onChange={(v) => set("highlights", v)} itemNoun="dato" addLabel="Agregar dato"
          emptyText="Sin datos destacados. Podés sumar cosas como “Formatos: FPL + UCL”."
          makeNew={() => ({ label: "", value: "" })}
          summary={(h) => ({ title: h.label, subtitle: h.value })}
          renderForm={(h, patch) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Etiqueta" value={h.label} onChange={(label) => patch({ label })} />
              <TextInput label="Valor" value={h.value} onChange={(value) => patch({ value })} />
            </div>
          )}
        />
      </div>

      <div className="grid gap-3">
        <h2 className="font-display text-2xl uppercase tracking-wide">Links destacados</h2>
        <ListEditor<FeaturedLink>
          items={g.links} onChange={(v) => set("links", v)} itemNoun="link" addLabel="Agregar link"
          emptyText="Sin links destacados."
          makeNew={() => ({ label: "", url: "" })}
          summary={(l) => ({ title: l.label, subtitle: l.url })}
          renderForm={(l, patch) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Texto del botón" value={l.label} onChange={(label) => patch({ label })} />
              <TextInput label="Link" value={l.url} onChange={(url) => patch({ url })} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
