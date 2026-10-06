// ==================== LISTA EDITABLE GENÉRICA ====================
// Crear / editar / eliminar (con confirmación) / ocultar / reordenar (arrastrar o con flechas).
// Novedades, videos, contactos y links usan este mismo componente: solo cambia el formulario de cada item.
import { useState, type ReactNode } from "react";
import { newId } from "@/lib/ids";
import { ConfirmDialog } from "./ConfirmDialog";
import { VisibilityToggle } from "./ui";

interface Base { id: string; visible: boolean }

interface Props<T extends Base> {
  items: T[];
  onChange: (items: T[]) => void;
  /** Crea un item vacío. Se inserta arriba o abajo según addAtTop. */
  makeNew?: () => Omit<T, "id" | "visible"> & Partial<Base>;
  addLabel?: string;
  addAtTop?: boolean;
  itemNoun: string;
  emptyText: string;
  header?: ReactNode;
  summary: (item: T) => { title: string; subtitle?: string; thumb?: ReactNode; badges?: string[] };
  renderForm: (item: T, patch: (p: Partial<T>) => void) => ReactNode;
}

export function ListEditor<T extends Base>({ items, onChange, makeNew, addLabel, addAtTop, itemNoun, emptyText, header, summary, renderForm }: Props<T>) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const patchItem = (id: string) => (p: Partial<T>) => onChange(items.map((it) => (it.id === id ? { ...it, ...p } : it)));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };
  const add = () => {
    if (!makeNew) return;
    const item = { visible: true, ...makeNew(), id: newId() } as T;
    onChange(addAtTop ? [item, ...items] : [...items, item]);
    setOpenId(item.id);
  };

  return (
    <div className="grid gap-4">
      {header}
      {makeNew && (
        <div><button type="button" className="btn-primary" onClick={add}>+ {addLabel ?? `Agregar ${itemNoun}`}</button></div>
      )}

      {items.length === 0 && <p className="card border-dashed p-8 text-center text-sm text-muted">{emptyText}</p>}

      <ul className="grid gap-3">
        {items.map((item, index) => {
          const s = summary(item);
          const open = openId === item.id;
          return (
            <li
              key={item.id}
              onDragOver={(e) => { if (dragFrom !== null) { e.preventDefault(); setDragOver(index); } }}
              onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) move(dragFrom, index); setDragFrom(null); setDragOver(null); }}
              className={`card overflow-hidden transition-colors ${dragOver === index && dragFrom !== index ? "!border-accent" : ""} ${dragFrom === index ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-2 p-3 sm:gap-3">
                <span
                  draggable
                  onDragStart={(e) => { setDragFrom(index); e.dataTransfer.effectAllowed = "move"; const row = e.currentTarget.closest("li"); if (row) e.dataTransfer.setDragImage(row, 20, 20); }}
                  onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
                  className="hidden cursor-grab select-none px-1 text-xl leading-none text-muted active:cursor-grabbing sm:block"
                  title="Arrastrá para reordenar" aria-hidden="true"
                >⋮⋮</span>

                <button type="button" onClick={() => setOpenId(open ? null : item.id)} className={`flex min-w-0 flex-1 items-center gap-3 text-left ${item.visible ? "" : "opacity-55"}`} aria-expanded={open}>
                  {s.thumb}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{s.title || `(${itemNoun} sin título)`}</span>
                    {s.subtitle && <span className="block truncate text-xs text-muted">{s.subtitle}</span>}
                    {s.badges && s.badges.length > 0 && (
                      <span className="mt-1 flex flex-wrap gap-1">{s.badges.map((b) => <span key={b} className="rounded bg-accent/20 px-1.5 py-0.5 text-[11px] font-bold text-accent-hi">{b}</span>)}</span>
                    )}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <VisibilityToggle visible={item.visible} onChange={(v) => patchItem(item.id)({ visible: v } as Partial<T>)} />
                  <div className="flex flex-col sm:flex-row">
                    <button type="button" className="rounded p-1.5 text-muted hover:bg-white/10 hover:text-white disabled:opacity-25" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={`Subir ${itemNoun}`}>▲</button>
                    <button type="button" className="rounded p-1.5 text-muted hover:bg-white/10 hover:text-white disabled:opacity-25" disabled={index === items.length - 1} onClick={() => move(index, index + 1)} aria-label={`Bajar ${itemNoun}`}>▼</button>
                  </div>
                </div>
              </div>

              {open && (
                <div className="grid gap-4 border-t border-line bg-black/20 p-4 sm:p-5">
                  {renderForm(item, patchItem(item.id))}
                  <div className="flex justify-between gap-3 pt-1">
                    <button type="button" className="btn-danger" onClick={() => setDeleting(item)}>Eliminar {itemNoun}</button>
                    <button type="button" className="btn-ghost" onClick={() => setOpenId(null)}>Cerrar</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={deleting !== null}
        title={`¿Eliminar ${itemNoun}?`}
        message="Esta acción no se puede deshacer. Si solo querés que no se vea, usá el botón Visible/Oculto."
        onCancel={() => setDeleting(null)}
        onConfirm={() => { if (deleting) onChange(items.filter((i) => i.id !== deleting.id)); setDeleting(null); }}
      />
    </div>
  );
}
