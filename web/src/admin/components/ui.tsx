// ==================== PIEZAS DE FORMULARIO DEL PANEL ====================
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-white/90">{label}</label>
      {children(id)}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

type TextProps = { label: string; hint?: string; value: string; onChange: (v: string) => void } &
  Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;
export function TextInput({ label, hint, value, onChange, ...rest }: TextProps) {
  return <Field label={label} hint={hint}>{(id) => <input id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />}</Field>;
}

type AreaProps = { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number } &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">;
export function TextArea({ label, hint, value, onChange, rows = 4, ...rest }: AreaProps) {
  return <Field label={label} hint={hint}>{(id) => <textarea id={id} rows={rows} className="input resize-y" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />}</Field>;
}

/** Interruptor Visible / Oculto. */
export function VisibilityToggle({ visible, onChange, labelOn = "Visible", labelOff = "Oculto" }: { visible: boolean; onChange: (v: boolean) => void; labelOn?: string; labelOff?: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={visible} onClick={() => onChange(!visible)}
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition-colors ${visible ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : "border-white/15 bg-white/5 text-muted"}`}
    >
      <span className={`h-2 w-2 rounded-full ${visible ? "bg-emerald-400" : "bg-white/30"}`} />
      {visible ? labelOn : labelOff}
    </button>
  );
}

export function Checkbox({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[var(--color-accent)]" />
      <span><span className="block text-sm font-semibold">{label}</span>{hint && <span className="block text-xs text-muted">{hint}</span>}</span>
    </label>
  );
}

export function Panel({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      {title && <h2 className="font-display text-2xl uppercase tracking-wide">{title}</h2>}
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className={`grid gap-4 ${title ? "mt-5" : ""}`}>{children}</div>
    </section>
  );
}
