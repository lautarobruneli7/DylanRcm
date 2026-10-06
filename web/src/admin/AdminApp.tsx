// ==================== PANEL DE ADMINISTRACIÓN (/admin) ====================
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SiteContent } from "@/types/content";
import { AuthScreen } from "./AuthScreens";
import { PreviewFrame } from "./components/PreviewFrame";
import { Toaster } from "./components/Toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ContactsEditor } from "./editors/ContactsEditor";
import { GeneralEditor } from "./editors/GeneralEditor";
import { NewsEditor } from "./editors/NewsEditor";
import { SettingsEditor } from "./editors/SettingsEditor";
import { VideosEditor } from "./editors/VideosEditor";
import { useDraft, type SaveStatus } from "./hooks/useDraft";

type TabId = "general" | "news" | "videos" | "contacts" | "settings";
const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "Información general" },
  { id: "news", label: "Novedades" },
  { id: "videos", label: "Videos" },
  { id: "contacts", label: "Contactos / Redes" },
  { id: "settings", label: "Ajustes" },
];

const STATUS_TEXT: Record<SaveStatus, string> = {
  saved: "✓ Guardado", dirty: "Cambios sin guardar…", saving: "Guardando…", error: "⚠ Error al guardar",
};

export default function AdminApp() {
  const [auth, setAuth] = useState<{ configured: boolean; authenticated: boolean } | null>(null);
  const refresh = () => api.authStatus().then(setAuth);
  useEffect(() => { void refresh(); document.title = "Panel | Dylan RCM"; }, []);

  if (!auth) return null;
  return (
    <>
      {auth.authenticated ? <Dashboard onLogout={async () => { await api.logout(); await refresh(); }} /> : <AuthScreen configured={auth.configured} onDone={refresh} />}
      <Toaster />
    </>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { content, status, hasChanges, loadError, update, publish, discard } = useDraft();
  const [tab, setTab] = useState<TabId>("general");
  const [preview, setPreview] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [publishing, setPublishing] = useState(false);

  if (loadError) return <p className="p-10 text-center text-red-300">{loadError}</p>;
  if (!content) return <p className="p-10 text-center text-muted">Cargando panel…</p>;

  const patch = (recipe: (c: SiteContent) => SiteContent) => update(recipe);
  const setSection = (key: keyof SiteContent["sections"]) => (m: SiteContent["sections"][typeof key]) =>
    patch((c) => ({ ...c, sections: { ...c.sections, [key]: m } }));

  return (
    <div className="min-h-screen [--admin-header:4rem] md:[--admin-header:4rem]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-ink/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl uppercase tracking-wide">Panel <span className="text-accent">Dylan</span></span>
          <span className={`hidden text-xs font-semibold sm:inline ${status === "error" ? "text-red-300" : "text-muted"}`} aria-live="polite">{STATUS_TEXT[status]}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-ghost !min-h-10 !px-3 sm:!px-4" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>{preview ? "Cerrar vista previa" : "Vista previa"}</button>
          {hasChanges && <button type="button" className="btn-ghost !min-h-10 hidden md:inline-flex" onClick={() => setConfirmDiscard(true)}>Descartar</button>}
          <button
            type="button" className="btn-primary !min-h-10" disabled={!hasChanges || publishing || status === "saving"}
            onClick={async () => { setPublishing(true); await publish(); setPublishing(false); }}
          >{publishing ? "Publicando…" : hasChanges ? "Publicar cambios" : "Todo publicado"}</button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-10 hidden lg:inline-flex">Ver sitio ↗</a>
          <button type="button" className="btn-ghost !min-h-10 !px-3" onClick={onLogout}>Salir</button>
        </div>
      </header>

      <div className={`mx-auto grid max-w-[1500px] ${preview ? "xl:grid-cols-[minmax(0,1fr)_minmax(460px,48%)]" : ""}`}>
        <div className="min-w-0 px-4 py-6 sm:px-6">
          <nav className="mb-6 flex gap-2 overflow-x-auto pb-1" aria-label="Secciones del panel">
            {TABS.map((t) => (
              <button
                key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}
                className={`shrink-0 rounded-lg px-4 py-2.5 font-display text-lg uppercase tracking-wide transition-colors ${tab === t.id ? "bg-accent text-white" : "bg-surface text-muted hover:text-white"}`}
              >{t.label}</button>
            ))}
          </nav>

          <div className="mx-auto max-w-3xl">
            {tab === "general" && (
              <GeneralEditor general={content.general} about={content.sections.about}
                onGeneral={(general) => patch((c) => ({ ...c, general }))} onAbout={setSection("about")} />
            )}
            {tab === "news" && (
              <NewsEditor items={content.news} meta={content.sections.news}
                onItems={(news) => patch((c) => ({ ...c, news }))} onMeta={setSection("news")} />
            )}
            {tab === "videos" && (
              <VideosEditor items={content.videos} meta={content.sections.videos}
                onItems={(videos) => patch((c) => ({ ...c, videos }))} onMeta={setSection("videos")} />
            )}
            {tab === "contacts" && (
              <ContactsEditor items={content.contacts} meta={content.sections.contacts}
                onItems={(contacts) => patch((c) => ({ ...c, contacts }))} onMeta={setSection("contacts")} />
            )}
            {tab === "settings" && <SettingsEditor settings={content.settings} onChange={(settings) => patch((c) => ({ ...c, settings }))} />}
          </div>
        </div>
        {preview && <PreviewFrame content={content} onClose={() => setPreview(false)} />}
      </div>

      <ConfirmDialog
        open={confirmDiscard} title="¿Descartar los cambios?" confirmLabel="Descartar"
        message="Vas a volver a la última versión publicada. Todo lo que cambiaste desde entonces se pierde."
        onCancel={() => setConfirmDiscard(false)} onConfirm={() => { setConfirmDiscard(false); void discard(); }}
      />
    </div>
  );
}
