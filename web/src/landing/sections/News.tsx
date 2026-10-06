// ==================== NOVEDADES ====================
// El orden es el del panel. La primera novedad "destacada" se muestra grande arriba.
import type { NewsItem, SectionMeta } from "@/types/content";
import { LoadMore } from "../components/LoadMore";
import { NewsCard } from "../components/NewsCard";
import { Reveal } from "../components/Reveal";
import { SectionShell } from "../components/SectionShell";
import { usePagination } from "../components/usePagination";

const PAGE_SIZE = 6;

export function News({ items, meta }: { items: NewsItem[]; meta: SectionMeta }) {
  const lead = items.find((n) => n.featured);
  const rest = items.filter((n) => n !== lead);
  const { visible, hasMore, remaining, showMore } = usePagination(rest, PAGE_SIZE);

  return (
    <SectionShell id="news" meta={meta} eyebrow="Lo último">
      {lead && <Reveal className="mb-6"><NewsCard item={lead} large /></Reveal>}
      {visible.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((n) => <Reveal key={n.id} className="flex"><div className="flex w-full"><NewsCard item={n} /></div></Reveal>)}
        </div>
      )}
      {hasMore && <LoadMore remaining={remaining} onClick={showMore} />}
    </SectionShell>
  );
}
