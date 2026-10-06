import { useState } from "react";
import type { Settings } from "@/types/content";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { ImageField } from "../components/ImageField";
import { Field, Panel, TextArea, TextInput } from "../components/ui";

const PRESETS = [
  { name: "Rojo Dylan", value: "#e3241d" }, { name: "Azul", value: "#1d6fe3" },
  { name: "Verde", value: "#16a34a" }, { name: "Naranja", value: "#ea580c" }, { name: "Violeta", value: "#7c3aed" },
];

export function SettingsEditor({ settings, onChange }: { settings: Settings; onChange: (s: Settings) => void }) {
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => onChange({ ...settings, [k]: v });
  const [pw, setPw] = useState({ current: "", next: "" });
  const [busy, setBusy] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.changePassword(pw.current, pw.next);
      setPw({ current: "", next: "" });
      toast("Contraseña actualizada");
    } catch (err) { toast((err as Error).message, "error"); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid gap-6">
      <Panel title="Color principal" description="Cambia el color de botones, detalles y portada en toda la web.">
        <div className="flex flex-wrap items-center gap-3">
          {PRESETS.map((p) => (
            <button key={p.value} type="button" title={p.name} aria-label={p.name} onClick={() => set("accent", p.value)}
              className={`h-10 w-10 rounded-full border-2 ${settings.accent.toLowerCase() === p.value ? "border-white" : "border-transparent"}`} style={{ background: p.value }} />
          ))}
          <label className="ml-2 flex items-center gap-2 text-sm text-muted">
            Otro:
            <input type="color" value={settings.accent} onChange={(e) => set("accent", e.target.value)} className="h-10 w-14 cursor-pointer rounded bg-transparent" aria-label="Elegir color personalizado" />
          </label>
        </div>
      </Panel>

      <Panel title="Cómo se ve en Google y al compartir" description="Título de la pestaña y vista previa en WhatsApp, X, etc.">
        <TextInput label="Título de la página" value={settings.siteTitle} onChange={(v) => set("siteTitle", v)} />
        <TextArea label="Descripción corta" value={settings.metaDescription} onChange={(v) => set("metaDescription", v)} rows={3} hint="Idealmente menos de 160 caracteres." />
        <ImageField label="Imagen al compartir el link" value={settings.shareImage} onChange={(v) => set("shareImage", v)} />
      </Panel>

      <Panel title="Contraseña del panel">
        <form className="grid gap-4 sm:max-w-sm" onSubmit={changePassword}>
          <Field label="Contraseña actual">{(id) => <input id={id} type="password" autoComplete="current-password" className="input" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />}</Field>
          <Field label="Nueva contraseña" hint="Mínimo 8 caracteres.">{(id) => <input id={id} type="password" autoComplete="new-password" className="input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />}</Field>
          <div><button type="submit" className="btn-ghost" disabled={busy || !pw.current || pw.next.length < 8}>Cambiar contraseña</button></div>
        </form>
      </Panel>
    </div>
  );
}
