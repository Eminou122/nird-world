import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '../../components/ui/Reveal'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { buildingPath, buildings } from '../../data/buildings'
import { BuildingIllustration } from '../village/BuildingIllustration'

export function PlacesSection() {
  return (
    <section id="lieux" aria-labelledby="lieux-title" className="scroll-mt-16 border-t border-ivory-300/60 bg-ivory-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="lieux-title" eyebrow="Le village" title="Six lieux, six leviers d’action.">
            <p>
              Chaque bâtiment correspond à un domaine de l’indépendance numérique. Ensemble, ils forment un parcours
              complet, du diagnostic à la mesure de l’impact.
            </p>
          </SectionHeading>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building, index) => (
            <li key={building.slug}>
              <Reveal delay={(index % 3) * 0.08} className="h-full">
                <Link
                  to={buildingPath(building.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-ivory-100 ring-1 ring-ivory-300/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-emerald-600/40"
                >
                  <div className="relative flex h-48 items-center justify-center bg-forest-900 px-10 pt-6 pb-4">
                    <span className="absolute top-4 left-5 font-display text-sm text-gold-300 tabular-nums">{building.number}</span>
                    <BuildingIllustration
                      slug={building.slug}
                      className="h-full w-auto max-w-full transition-transform duration-500 group-hover:-translate-y-1"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">{building.theme}</p>
                    <h3 className="mt-2 text-2xl font-medium text-forest-900">{building.name}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-ink-muted">{building.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      Découvrir
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
