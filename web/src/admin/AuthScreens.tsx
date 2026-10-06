import { useState } from "react";
import { api } from "@/lib/api";

/** Pantalla de entrada: crea la contraseña la primera vez y pide la contraseña después. */
export function AuthScreen({ configured, onDone }: { configured: boolean; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!configured && password !== confirm) return void setError("Las contraseñas no coinciden");
    setBusy(true);
    try {
      await (configured ? api.login(password) : api.setup(password));
      onDone();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border-[3px] border-black bg-ink p-7 shadow-card">
        <h1 className="font-display text-4xl uppercase leading-none tracking-wide">{configured ? "Panel de Dylan" : "Creá tu contraseña"}</h1>
        <p className="mt-2 text-sm text-muted">
          {configured ? "Ingresá para editar tu página." : "Es la primera vez que entrás. Elegí una contraseña (mínimo 8 caracteres) para proteger el panel."}
        </p>
        <div className="mt-6 grid gap-4">
          <div>
            <label htmlFor="pw" className="mb-1.5 block text-sm font-semibold">Contraseña</label>
            <input id="pw" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={configured ? "current-password" : "new-password"} autoFocus required minLength={configured ? 1 : 8} />
          </div>
          {!configured && (
            <div>
              <label htmlFor="pw2" className="mb-1.5 block text-sm font-semibold">Repetir contraseña</label>
              <input id="pw2" type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>
          )}
          {error && <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? "Un momento…" : configured ? "Entrar" : "Crear contraseña y entrar"}</button>
        </div>
      </form>
    </main>
  );
}
