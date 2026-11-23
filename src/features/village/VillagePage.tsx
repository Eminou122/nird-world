import { ArrowRight, Keyboard, MousePointerClick } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs'
import { buildingPath, buildings, type BuildingSlug } from '../../data/buildings'
import { VillageMap } from './VillageMap'

export function VillagePage() {
  const [activeSlug, setActiveSlug] = useState<BuildingSlug | null>(null)

  return (
    <>
      <title>Le village — NIRD WORLD</title>
      <section aria-labelledby="village-title" className="bg-forest-900 text-ivory-50">
        <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-12">
          <Breadcrumbs onDark items={[{ label: 'Accueil', to: '/' }, { label: 'Le village' }]} />
          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h1 id="village-title" className="text-4xl leading-tight font-medium sm:text-5xl lg:text-6xl">
                Le village NIRD
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory-100/75">
                Six lieux, six façons d’agir pour un numérique éducatif plus indépendant. Choisissez un bâtiment pour
                découvrir ce qu’il vous réserve.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2 text-sm text-ivory-100/75 lg:col-span-5 lg:justify-end">
              <li className="inline-flex items-center gap-2 rounded-full bg-ivory-50/5 px-3.5 py-2 ring-1 ring-ivory-50/10">
                <MousePointerClick aria-hidden="true" className="size-4 text-gold-400" />
                Survolez ou touchez un bâtiment
              </li>
              <li className="hidden items-center gap-2 rounded-full bg-ivory-50/5 px-3.5 py-2 ring-1 ring-ivory-50/10 sm:inline-flex">
                <Keyboard aria-hidden="true" className="size-4 text-gold-400" />
                Touche Tab pour parcourir les lieux
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-1 pt-14 pb-10 sm:px-8 sm:pt-16">
          <VillageMap activeSlug={activeSlug} onActiveChange={setActiveSlug} />
        </div>
      </section>

      <section aria-labelledby="directory-title" className="bg-ivory-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 id="directory-title" className="text-3xl font-medium text-forest-900">
            Tous les lieux du village
          </h2>
          <p className="mt-2 text-ink-muted">Accès direct, sans passer par l’illustration.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map(({ slug, number, name, theme, icon: Icon }) => (
              <li key={slug}>
                <Link
                  to={buildingPath(slug)}
                  onPointerEnter={() => setActiveSlug(slug)}
                  onPointerLeave={() => setActiveSlug(null)}
                  onFocus={() => setActiveSlug(slug)}
                  onBlur={() => setActiveSlug(null)}
                  className={`group flex min-h-20 items-center gap-4 rounded-xl bg-ivory-50 p-4 ring-1 transition duration-200 ${
                    activeSlug === slug ? 'shadow-soft ring-emerald-600/50' : 'ring-ivory-300/80'
                  }`}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-forest-900 text-gold-300">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-emerald-700 tabular-nums">{number}</span>
                    <span className="block font-display text-lg leading-tight text-forest-900">{name}</span>
                    <span className="block text-sm text-ink-muted">{theme}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-emerald-700 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
