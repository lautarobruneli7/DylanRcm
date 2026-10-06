// ==================== SOBRE DYLAN ====================
// Bio, datos destacados y links destacados. Los items ocultos no se muestran.
import type { General, SectionMeta } from "@/types/content";
import { Reveal } from "../components/Reveal";
import { SectionShell } from "../components/SectionShell";
import { SmartLink } from "../components/SmartLink";

export function About({ general, meta }: { general: General; meta: SectionMeta }) {
  const highlights = general.highlights.filter((h) => h.visible && (h.label || h.value));
  const links = general.links.filter((l) => l.visible && l.label && l.url);
  if (!general.bio && highlights.length === 0 && links.length === 0) return null;

  return (
    <SectionShell id="about" meta={meta} eyebrow="Sobre el canal">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          {general.bio && <p className="whitespace-pre-line text-lg leading-relaxed text-white/85">{general.bio}</p>}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((l) => (
                <SmartLink key={l.id} href={l.url} className="btn-ghost">{l.label} ↗</SmartLink>
              ))}
            </div>
          )}
        </Reveal>
        {highlights.length > 0 && (
          <Reveal>
            <dl className="grid gap-3">
              {highlights.map((h) => (
                <div key={h.id} className="card border-l-4 !border-l-accent p-5">
                  <dt className="text-sm font-semibold text-muted">{h.label}</dt>
                  <dd className="mt-1 font-display text-2xl uppercase tracking-wide">{h.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </SectionShell>
  );
}
