import { useState } from "react";
import type { VideoItem } from "@/types/content";
import { youtubeEmbedUrl, youtubeThumb } from "@/lib/youtube";

/** Muestra la miniatura y carga el iframe de YouTube recién al hacer click (la página carga más rápido). */
export function VideoPlayer({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const thumb = video.thumbnail || youtubeThumb(video.youtubeId);

  if (playing) {
    return (
      <iframe
        className="aspect-video w-full" src={youtubeEmbedUrl(video.youtubeId)} title={video.title || "Video de YouTube"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
      />
    );
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} className="group relative block aspect-video w-full overflow-hidden bg-black" aria-label={`Reproducir: ${video.title}`}>
      <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/5">
        <span className="flex h-14 w-20 items-center justify-center rounded-xl bg-accent shadow-lg transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5 text-white" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </span>
    </button>
  );
}
