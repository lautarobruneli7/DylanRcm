// ==================== LANDING PÚBLICA ====================
// Arma la página a partir del contenido. No contiene textos propios: todo viene de SiteContent.
import { useEffect } from "react";
import type { SiteContent } from "@/types/content";
import { Footer } from "./components/Footer";
import { Navbar, type NavItem } from "./components/Navbar";
import { About } from "./sections/About";
import { Contacts } from "./sections/Contacts";
import { Hero } from "./sections/Hero";
import { News } from "./sections/News";
import { Videos } from "./sections/Videos";
import { useContent } from "./useContent";

const isPreview = new URLSearchParams(window.location.search).has("preview");

function applyTheme(content: SiteContent) {
  document.documentElement.style.setProperty("--color-accent", content.settings.accent || "#e3241d");
  if (content.settings.siteTitle) document.title = content.settings.siteTitle;
}

export function Landing() {
  const { content, error } = useContent(isPreview);
  useEffect(() => { if (content) applyTheme(content); }, [content]);

  if (error) return <p className="p-10 text-center text-muted">No se pudo cargar el contenido. Probá recargar la página.</p>;
  if (!content) return <div className="min-h-screen bg-accent" aria-busy="true" />;

  const { general, sections } = content;
  const news = content.news.filter((n) => n.visible);
  const videos = content.videos.filter((v) => v.visible && v.youtubeId);
  const contacts = content.contacts.filter((c) => c.visible && c.url);

  // Cada sección aparece solo si está activada y tiene algo para mostrar.
  const hasAbout = sections.about.visible && Boolean(general.bio || general.highlights.some((h) => h.visible) || general.links.some((l) => l.visible));
  const nav: NavItem[] = [
    hasAbout && { id: "about", label: sections.about.title },
    sections.news.visible && news.length > 0 && { id: "news", label: sections.news.title },
    sections.videos.visible && videos.length > 0 && { id: "videos", label: sections.videos.title },
    sections.contacts.visible && contacts.length > 0 && { id: "contacts", label: sections.contacts.title },
  ].filter(Boolean) as NavItem[];

  return (
    <>
      <Navbar general={general} items={nav} />
      <main>
        <Hero general={general} />
        {hasAbout && <About general={general} meta={sections.about} />}
        {sections.news.visible && news.length > 0 && <News items={news} meta={sections.news} />}
        {sections.videos.visible && videos.length > 0 && <Videos items={videos} meta={sections.videos} />}
        {sections.contacts.visible && contacts.length > 0 && <Contacts items={contacts} meta={sections.contacts} />}
      </main>
      <Footer general={general} />
    </>
  );
}
