import type { General } from "@/types/content";

export function Footer({ general }: { general: General }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {general.name}. Todos los derechos reservados.</p>
        <a href="#top" className="font-semibold transition-colors hover:text-white">Volver arriba ↑</a>
      </div>
    </footer>
  );
}
