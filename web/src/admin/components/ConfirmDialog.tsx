import { useEffect, useRef } from "react";

interface Props { open: boolean; title: string; message: string; confirmLabel?: string; onConfirm: () => void; onCancel: () => void }

/** Confirmación antes de acciones destructivas (usa <dialog> nativo: foco y Escape gratis). */
export function ConfirmDialog({ open, title, message, confirmLabel = "Eliminar", onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onCancel} className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-line bg-surface p-6 text-white backdrop:bg-black/70">
      <h3 className="font-display text-2xl uppercase tracking-wide">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="btn-ghost" onClick={onCancel} autoFocus>Cancelar</button>
        <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </dialog>
  );
}
