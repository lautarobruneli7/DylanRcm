// ==================== MODELO DE CONTENIDO ====================
// Esta es la única fuente de verdad de lo que se puede editar. Landing y panel dependen de estos tipos.

export interface Settings {
  siteTitle: string;
  metaDescription: string;
  /** Color principal (hex). Reemplaza --color-accent en toda la web. */
  accent: string;
  shareImage: string;
}

export interface Highlight { id: string; label: string; value: string; visible: boolean }
export interface FeaturedLink { id: string; label: string; url: string; visible: boolean }

export interface General {
  name: string;
  role: string;
  avatar: string;
  banner: string;
  intro: string;
  bio: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  highlights: Highlight[];
  links: FeaturedLink[];
}

export interface SectionMeta { title: string; subtitle: string; visible: boolean }
export type SectionKey = "about" | "news" | "videos" | "contacts";
export type Sections = Record<SectionKey, SectionMeta>;

export interface NewsItem {
  id: string; title: string; description: string; image: string;
  date: string; url: string; featured: boolean; visible: boolean;
}

export interface VideoItem {
  id: string; url: string; youtubeId: string; title: string; description: string;
  thumbnail: string; featured: boolean; visible: boolean;
}

export interface ContactItem {
  id: string; name: string; url: string; icon: string; text: string; visible: boolean;
}

export interface SiteContent {
  version: number;
  settings: Settings;
  general: General;
  sections: Sections;
  news: NewsItem[];
  videos: VideoItem[];
  contacts: ContactItem[];
}
