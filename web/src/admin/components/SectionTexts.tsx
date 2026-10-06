import type { SectionMeta } from "@/types/content";
import { Panel, TextInput, VisibilityToggle } from "./ui";

/** Título, subtítulo y visibilidad de una sección de la landing. */
export function SectionTexts({ meta, onChange, note }: { meta: SectionMeta; onChange: (m: SectionMeta) => void; note?: string }) {
  return (
    <Panel title="Textos de la sección" description={note}>
      <TextInput label="Título" value={meta.title} onChange={(title) => onChange({ ...meta, title })} />
      <TextInput label="Subtítulo (opcional)" value={meta.subtitle} onChange={(subtitle) => onChange({ ...meta, subtitle })} />
      <div className="flex items-center gap-3">
        <VisibilityToggle visible={meta.visible} onChange={(visible) => onChange({ ...meta, visible })} labelOn="Sección visible" labelOff="Sección oculta" />
        <span className="text-xs text-muted">Si está oculta, no aparece en la web ni en el menú.</span>
      </div>
    </Panel>
  );
}
