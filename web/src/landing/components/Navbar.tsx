import { useState } from "react";
import type { General } from "@/types/content";
import { SmartLink } from "./SmartLink";

export interface NavItem { id: string; label: string }

export function Navbar({ general, items }: { general: General; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5" aria-label="Principal">
        <a href="#top" className="flex items-center gap-3" onClick={close}>
          {general.avatar && <img src={general.avatar} alt="" className="h-9 w-9 rounded-md object-cover" />}
          <span className="font-display text-xl uppercase tracking-wide">{general.name}</span>
        </a>

        <ul className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
          {items.map((i) => (
            <li key={i.id}><a href={`#${i.id}`} className="transition-colors hover:text-white">{i.label}</a></li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {general.ctaLabel && general.ctaUrl && (
            <SmartLink href={general.ctaUrl} className="btn-primary hidden sm:inline-flex">{general.ctaLabel}</SmartLink>
          )}
          <button
            type="button" className="btn-ghost !px-3 md:hidden" aria-expanded={open} aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-ink px-5 pb-5 md:hidden">
          <ul className="flex flex-col py-2">
            {items.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} onClick={close} className="block border-b border-line py-3.5 font-display text-xl uppercase tracking-wide">{i.label}</a>
              </li>
            ))}
          </ul>
          {general.ctaLabel && general.ctaUrl && (
            <SmartLink href={general.ctaUrl} className="btn-primary mt-3 w-full">{general.ctaLabel}</SmartLink>
          )}
        </div>
      )}
    </header>
  );
}
