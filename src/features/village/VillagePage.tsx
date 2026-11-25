import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useSearchParams } from 'react-router'
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs'
import { buildingPath, buildings, getBuilding, type BuildingSlug } from '../../data/buildings'
import { PlaceGuide } from './PlaceGuide'
import { VillageMap, pinId } from './VillageMap'

export function VillagePage() {
  const [activeSlug, setActiveSlug] = useState<BuildingSlug | null>(null)
  // Kept in the URL so that coming back from a place finds it still selected.
  const [params, setParams] = useSearchParams()
  const selected = getBuilding(params.get('lieu') ?? undefined)
  const headingRef = useRef<HTMLHeadingElement>(null)

  function select(slug: BuildingSlug) {
    flushSync(() => setParams({ lieu: slug }, { replace: true, preventScrollReset: true, flushSync: true }))
    // Below the map on small screens: bring the presentation into view. Focus lets keyboard users continue to its button.
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'nearest' })
  }

  function close() {
    const slug = selected?.slug
    setParams({}, { replace: true, preventScrollReset: true })
    if (slug) document.getElementById(pinId(slug))?.focus({ preventScroll: true })
  }

  return (
    <>
      <title>Le village — NIRD WORLD</title>
      <section aria-labelledby="village-title" className="bg-sage-100">
        <div className="mx-auto max-w-[88rem] px-5 pt-8 pb-14 sm:px-8 sm:pb-20">
          <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Le village' }]} />
          {/* Title and map share a column, so the map never moves when the presentation grows. */}
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
            <div>
              <h1 id="village-title" className="text-4xl leading-tight font-medium text-forest-900 sm:text-5xl">
                Bienvenue au village
              </h1>
              <p className="mt-2 max-w-xl text-lg leading-relaxed text-ink-muted">
                Six bâtiments, six questions sur le numérique de votre école.
              </p>
              <div className="-mx-3 mt-14 sm:mx-0 sm:mt-10">
                <VillageMap
                  activeSlug={activeSlug}
                  selectedSlug={selected?.slug ?? null}
                  onActiveChange={setActiveSlug}
                  onSelect={select}
                />
              </div>
            </div>
            <PlaceGuide building={selected} headingRef={headingRef} onSelectSchool={() => select('ecole')} onClose={close} />
          </div>
        </div>
      </section>

      <section aria-labelledby="directory-title" className="bg-ivory-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 id="directory-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
            Aller directement à un lieu
          </h2>
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map(({ slug, name, question, open, icon: Icon }) => (
              <li key={slug}>
                <Link
                  to={buildingPath(slug)}
                  viewTransition
                  onPointerEnter={() => setActiveSlug(slug)}
                  onPointerLeave={() => setActiveSlug(null)}
                  onFocus={() => setActiveSlug(slug)}
                  onBlur={() => setActiveSlug(null)}
                  className="group flex min-h-20 items-center gap-4 rounded-xl py-3"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage-200 text-emerald-700 transition-colors group-hover:bg-gold-300 group-hover:text-forest-900">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-muted">
                      {name}
                      {!open && ' (bientôt)'}
                    </span>
                    <span className="block font-display text-lg leading-snug text-forest-900 group-hover:text-emerald-700">{question}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
