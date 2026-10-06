import { useEffect, useState } from "react";
import { subscribeToasts, type ToastMessage } from "@/lib/toast";

export function Toaster() {
  const [items, setItems] = useState<ToastMessage[]>([]);
  useEffect(() => subscribeToasts((t) => {
    setItems((cur) => [...cur, t]);
    window.setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== t.id)), t.kind === "error" ? 6000 : 3200);
  }), []);
  const tone = { success: "border-emerald-500/50 bg-emerald-950", error: "border-red-500/60 bg-red-950", info: "border-white/20 bg-surface-2" } as const;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`pointer-events-auto max-w-md rounded-xl border px-4 py-3 text-sm font-semibold shadow-card ${tone[t.kind]}`}>{t.text}</div>
      ))}
    </div>
  );
}
