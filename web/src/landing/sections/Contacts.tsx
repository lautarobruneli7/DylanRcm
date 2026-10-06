// ==================== CONTACTO / REDES ====================
import type { ContactItem, SectionMeta } from "@/types/content";
import { SocialIcon } from "@/lib/icons";
import { Reveal } from "../components/Reveal";
import { SectionShell } from "../components/SectionShell";
import { SmartLink } from "../components/SmartLink";

export function Contacts({ items, meta }: { items: ContactItem[]; meta: SectionMeta }) {
  return (
    <SectionShell id="contacts" meta={meta} eyebrow="Conectemos">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <li key={c.id}>
            <Reveal>
              <SmartLink href={c.url} className="group card flex items-center gap-4 p-4 transition-colors hover:border-accent/70 hover:bg-surface-2">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-transform group-hover:scale-105">
                  <SocialIcon name={c.icon} className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xl uppercase tracking-wide">{c.name}</span>
                  {c.text && <span className="block truncate text-sm text-muted">{c.text}</span>}
                </span>
              </SmartLink>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
