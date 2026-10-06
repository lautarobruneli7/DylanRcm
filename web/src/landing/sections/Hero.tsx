// ==================== HERO ====================
// Todo el texto, imágenes y botones salen de content.general (editable en Panel > Información general).
import type { General } from "@/types/content";
import { SmartLink } from "../components/SmartLink";

export function Hero({ general }: { general: General }) {
  const hasPrimary = general.ctaLabel && general.ctaUrl;
  const hasSecondary = general.secondaryCtaLabel && general.secondaryCtaUrl;
  return (
    <section id="top" className="bg-accent">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-14 sm:pb-16 sm:pt-20 md:grid-cols-[1fr_auto]">
        <div>
          {general.role && <p className="mb-3 font-display text-sm uppercase tracking-[0.25em] text-black">{general.role}</p>}
          <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-wide text-white sm:text-8xl">{general.name}</h1>
          {general.intro && <p className="mt-5 max-w-xl text-lg font-medium text-white sm:text-xl">{general.intro}</p>}
          {(hasPrimary || hasSecondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {hasPrimary && <SmartLink href={general.ctaUrl} className="btn-light">{general.ctaLabel}</SmartLink>}
              {hasSecondary && (
                <SmartLink href={general.secondaryCtaUrl} className="btn border border-black/40 bg-black/25 text-white hover:bg-black/45">
                  {general.secondaryCtaLabel}
                </SmartLink>
              )}
            </div>
          )}
        </div>
        {general.avatar && (
          <img
            src={general.avatar} alt={`Logo de ${general.name}`} width={288} height={288}
            className="mx-auto h-48 w-48 rounded-2xl border-[3px] border-black object-cover shadow-card sm:h-64 sm:w-64 md:h-72 md:w-72"
          />
        )}
      </div>
      {/* Banner: franja a todo el ancho con las líneas negras de la identidad de Dylan. */}
      {general.banner && (
        <img src={general.banner} alt={`Banner de ${general.name}`} className="stripe-lines aspect-[16/7] w-full object-cover object-center sm:aspect-[5/1]" />
      )}
    </section>
  );
}
