import type { NewsItem } from "@/types/content";
import { formatDate } from "@/lib/format";
import { safeUrl } from "@/lib/url";
import { SmartLink } from "./SmartLink";

export function NewsCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
  const hasLink = Boolean(safeUrl(item.url));
  const body = (
    <>
      {item.image && (
        <div className={`overflow-hidden bg-surface-2 ${large ? "md:w-1/2" : ""}`}>
          <img
            src={item.image} alt="" loading="lazy"
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${large ? "aspect-video md:h-full md:aspect-auto" : "aspect-video"}`}
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col p-5 ${large ? "md:p-8" : ""}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          {item.featured && <span className="rounded bg-accent px-2 py-0.5 font-display uppercase tracking-wider text-white">Destacada</span>}
          {item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
        </div>
        <h3 className={`font-display uppercase leading-tight tracking-wide ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{item.title}</h3>
        {item.description && <p className={`mt-3 whitespace-pre-line text-muted ${large ? "text-base" : "line-clamp-4 text-sm"}`}>{item.description}</p>}
        {hasLink && <span className="mt-auto pt-4 text-sm font-semibold text-accent group-hover:underline">Leer más ↗</span>}
      </div>
    </>
  );
  const cls = `group card flex overflow-hidden ${large ? "flex-col md:flex-row" : "flex-col"} ${hasLink ? "transition-colors hover:border-accent/60" : ""}`;
  return hasLink ? <SmartLink href={item.url} className={cls}>{body}</SmartLink> : <article className={cls}>{body}</article>;
}
