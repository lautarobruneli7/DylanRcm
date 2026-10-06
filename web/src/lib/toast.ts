// Mini sistema de avisos ("Guardado", "Publicado", errores) sin dependencias.
export type ToastKind = "success" | "error" | "info";
export interface ToastMessage { id: number; kind: ToastKind; text: string }
type Listener = (t: ToastMessage) => void;

const listeners = new Set<Listener>();
let counter = 0;

export const toast = (text: string, kind: ToastKind = "success") => {
  const message = { id: ++counter, kind, text };
  listeners.forEach((l) => l(message));
};
export const subscribeToasts = (l: Listener) => { listeners.add(l); return () => void listeners.delete(l); };
