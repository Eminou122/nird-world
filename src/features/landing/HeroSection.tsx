import { ArrowRight, MousePointerClick } from 'lucide-react'
import * as m from 'motion/react-m'
import { useState } from 'react'
import { ButtonLink } from '../../components/ui/ButtonLink'
import { getBuilding, type BuildingSlug } from '../../data/buildings'
import { VillageScene } from '../village/scene/VillageScene'

const ease = [0.2, 0.7, 0.2, 1] as const

export function HeroSection() {
  const [activeSlug, setActiveSlug] = useState<BuildingSlug | null>(null)
  const active = getBuilding(activeSlug ?? undefined)

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-forest-900 text-ivory-50">
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <m.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
              Nuit de l’Info 2025 · Démarche NIRD
            </p>
            <h1 id="hero-title" className="mt-5 text-[2.6rem] leading-[1.02] font-medium sm:text-6xl lg:text-[4.6rem]">
              Reprendre <em className="font-normal text-gold-300">la main</em> sur le numérique de l’école.
            </h1>
          </m.div>

          <m.div
            className="lg:col-span-5 lg:pb-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
          >
            <p className="text-lg leading-relaxed text-ivory-100/80">
              NIRD WORLD est un village numérique interactif. Six lieux pour comprendre les dépendances d’un
              établissement scolaire et le guider vers un numérique inclusif, responsable et durable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/village">
                Explorer le village <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/#mission" variant="outline-light">
                Notre mission
              </ButtonLink>
            </div>
          </m.div>
        </div>

        <p className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-1 font-display text-lg text-ivory-100/70 italic sm:text-xl">
          <span>Explorer.</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-gold-400" />
          <span>Comprendre.</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-gold-400" />
          <span>Transformer.</span>
        </p>
      </div>

      <m.figure
        className="relative mx-auto mt-6 max-w-6xl px-2 pb-6 sm:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.2 }}
      >
        <VillageScene className="block h-auto w-full" activeSlug={activeSlug} onActiveChange={setActiveSlug} />
        <figcaption className="mx-3 mt-2 flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-ivory-50/10 pt-4 text-sm sm:mx-0">
          <span className="text-ivory-100/55">Aperçu du village — six lieux, un parcours.</span>
          <span className="inline-flex items-center gap-2 text-ivory-100/85">
            {active ? (
              <>
                <span className="font-semibold text-gold-300 tabular-nums">{active.number}</span>
                <span className="font-medium text-ivory-50">{active.name}</span>
                <span className="text-ivory-100/60">— {active.theme}</span>
              </>
            ) : (
              <>
                <MousePointerClick aria-hidden="true" className="size-4 text-gold-400" />
                Survolez un bâtiment, cliquez pour y entrer.
              </>
            )}
          </span>
        </figcaption>
      </m.figure>
    </section>
  )
}
