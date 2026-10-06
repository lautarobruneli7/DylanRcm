import type { ContactItem, SectionMeta } from "@/types/content";
import { ICON_OPTIONS, SocialIcon, guessIcon } from "@/lib/icons";
import { ListEditor } from "../components/ListEditor";
import { SectionTexts } from "../components/SectionTexts";
import { Field, TextInput } from "../components/ui";

interface Props { items: ContactItem[]; meta: SectionMeta; onItems: (i: ContactItem[]) => void; onMeta: (m: SectionMeta) => void }

export function ContactsEditor({ items, meta, onItems, onMeta }: Props) {
  return (
    <div className="grid gap-6">
      <SectionTexts meta={meta} onChange={onMeta} />
      <ListEditor<ContactItem>
        items={items} onChange={onItems} itemNoun="contacto" addLabel="Nueva red o contacto"
        emptyText="No hay redes cargadas. Agregá YouTube, Instagram, Discord o cualquier link."
        makeNew={() => ({ name: "", url: "", icon: "link", text: "" })}
        summary={(c) => ({
          title: c.name, subtitle: c.url,
          thumb: <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-white"><SocialIcon name={c.icon} className="h-5 w-5" /></span>,
        })}
        renderForm={(c, patch) => (
          <>
            <TextInput
              label="URL" value={c.url} placeholder="https://… o mailto:correo@dominio.com"
              hint="Para un email escribí mailto:tucorreo@dominio.com. El icono se elige solo al pegar el link; podés cambiarlo."
              onChange={(url) => patch({ url, ...(c.icon === "link" || c.icon === guessIcon(c.url) ? { icon: guessIcon(url) } : {}) })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Nombre" value={c.name} onChange={(name) => patch({ name })} placeholder="Ej: Instagram" />
              <TextInput label="Texto de apoyo" value={c.text} onChange={(text) => patch({ text })} placeholder="Ej: @dylanrcm" />
            </div>
            <Field label="Icono">
              {(id) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-white"><SocialIcon name={c.icon} className="h-6 w-6" /></span>
                  <select id={id} className="input" value={c.icon} onChange={(e) => patch({ icon: e.target.value })}>
                    {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
            </Field>
          </>
        )}
      />
    </div>
  );
}
