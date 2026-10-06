// ==================== VIDEOS ====================
// Solo hace falta el link de YouTube; miniatura y reproductor se resuelven solos.
import type { SectionMeta, VideoItem } from "@/types/content";
import { LoadMore } from "../components/LoadMore";
import { Reveal } from "../components/Reveal";
import { SectionShell } from "../components/SectionShell";
import { usePagination } from "../components/usePagination";
import { VideoPlayer } from "../components/VideoPlayer";

const PAGE_SIZE = 6;

function VideoInfo({ video, large }: { video: VideoItem; large?: boolean }) {
  return (
    <div className={large ? "p-5 md:p-7" : "p-4"}>
      {video.featured && <span className="mb-2 inline-block rounded bg-accent px-2 py-0.5 font-display text-xs uppercase tracking-wider">Destacado</span>}
      <h3 className={`font-display uppercase leading-tight tracking-wide ${large ? "text-3xl" : "text-xl"}`}>{video.title}</h3>
      {video.description && <p className={`mt-2 whitespace-pre-line text-muted ${large ? "text-base" : "line-clamp-3 text-sm"}`}>{video.description}</p>}
    </div>
  );
}

export function Videos({ items, meta }: { items: VideoItem[]; meta: SectionMeta }) {
  const lead = items.find((v) => v.featured);
  const rest = items.filter((v) => v !== lead);
  const { visible, hasMore, remaining, showMore } = usePagination(rest, PAGE_SIZE);

  return (
    <SectionShell id="videos" meta={meta} eyebrow="En el canal">
      {lead && (
        <Reveal className="mb-6">
          <article className="card overflow-hidden">
            <VideoPlayer video={lead} />
            <VideoInfo video={lead} large />
          </article>
        </Reveal>
      )}
      {visible.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((v) => (
            <Reveal key={v.id}>
              <article className="card h-full overflow-hidden">
                <VideoPlayer video={v} />
                <VideoInfo video={v} />
              </article>
            </Reveal>
          ))}
        </div>
      )}
      {hasMore && <LoadMore remaining={remaining} onClick={showMore} />}
    </SectionShell>
  );
}
