// ==================== ICONOS DE REDES ====================
// Para sumar una red nueva al selector del panel: importar su icono y agregarlo a ICONS.
import {
  siYoutube, siInstagram, siX, siDiscord, siTiktok, siTwitch, siPatreon, siFacebook,
  siTelegram, siWhatsapp, siSpotify, siKick, siThreads, siBluesky, siGithub, siApplepodcasts,
} from "simple-icons";

type Glyph = { label: string; path: string; stroke?: boolean };

const stroke = (d: string) => d;
export const ICONS: Record<string, Glyph> = {
  youtube: { label: "YouTube", path: siYoutube.path },
  instagram: { label: "Instagram", path: siInstagram.path },
  x: { label: "X / Twitter", path: siX.path },
  discord: { label: "Discord", path: siDiscord.path },
  tiktok: { label: "TikTok", path: siTiktok.path },
  twitch: { label: "Twitch", path: siTwitch.path },
  patreon: { label: "Patreon", path: siPatreon.path },
  facebook: { label: "Facebook", path: siFacebook.path },
  telegram: { label: "Telegram", path: siTelegram.path },
  whatsapp: { label: "WhatsApp", path: siWhatsapp.path },
  spotify: { label: "Spotify", path: siSpotify.path },
  applepodcasts: { label: "Apple Podcasts", path: siApplepodcasts.path },
  kick: { label: "Kick", path: siKick.path },
  threads: { label: "Threads", path: siThreads.path },
  bluesky: { label: "Bluesky", path: siBluesky.path },
  github: { label: "GitHub", path: siGithub.path },
  mail: { label: "Email", stroke: true, path: stroke("M3 6h18v12H3zM3 7l9 6 9-6") },
  web: { label: "Página web", stroke: true, path: stroke("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18") },
  link: { label: "Link", stroke: true, path: stroke("M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1") },
  phone: { label: "Teléfono", stroke: true, path: stroke("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z") },
};

export const ICON_OPTIONS = Object.entries(ICONS).map(([value, g]) => ({ value, label: g.label }));

/** Detecta el icono por la URL cuando el admin pega un link nuevo. */
export function guessIcon(url: string): string {
  const u = url.toLowerCase();
  if (u.startsWith("mailto:")) return "mail";
  if (u.startsWith("tel:")) return "phone";
  const hosts: [RegExp, string][] = [
    [/youtu\.?be/, "youtube"], [/instagram\.com/, "instagram"], [/(twitter|x)\.com/, "x"],
    [/discord\.(gg|com)/, "discord"], [/tiktok\.com/, "tiktok"], [/twitch\.tv/, "twitch"],
    [/patreon\.com/, "patreon"], [/facebook\.com|fb\.com/, "facebook"], [/t\.me|telegram/, "telegram"],
    [/wa\.me|whatsapp/, "whatsapp"], [/spotify\.com/, "spotify"], [/kick\.com/, "kick"],
    [/threads\.net/, "threads"], [/bsky\.app/, "bluesky"], [/github\.com/, "github"],
  ];
  return hosts.find(([re]) => re.test(u))?.[1] ?? (u.startsWith("http") ? "web" : "link");
}

export function SocialIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const glyph = ICONS[name] ?? ICONS.link;
  return glyph.stroke ? (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={glyph.path} />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={glyph.path} />
    </svg>
  );
}
