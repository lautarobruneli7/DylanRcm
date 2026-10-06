import type { ReactNode } from "react";
import type { SectionMeta } from "@/types/content";
import { Reveal } from "./Reveal";

interface Props { id: string; meta: SectionMeta; eyebrow?: string; children: ReactNode }

/** Contenedor común de todas las secciones: título y subtítulo salen del panel. */
export function SectionShell({ id, meta, eyebrow, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-20">
      <Reveal>
        <header className="mb-10 max-w-2xl">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">{meta.title}</h2>
          {meta.subtitle && <p className="mt-4 text-base text-muted sm:text-lg">{meta.subtitle}</p>}
        </header>
      </Reveal>
      {children}
    </section>
  );
}
