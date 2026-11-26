import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs'
import { ButtonLink } from '../../components/ui/ButtonLink'
import { Disclosure } from '../../components/ui/Disclosure'
import { buildingPath, buildings, getBuilding, pillars, type Building } from '../../data/buildings'
import { NotFoundPage } from '../not-found/NotFoundPage'
import { BuildingIllustration } from '../village/BuildingIllustration'

export function BuildingPage() {
  const { slug } = useParams()
  const building = getBuilding(slug)
  if (!building) return <NotFoundPage />

  const { name, theme, question, description, why, planned, missionLink } = building
  const pillar = pillars[building.pillar]

  return (
    <>
      <title>{`${name} — ${theme} — NIRD WORLD`}</title>

      <section aria-labelledby="building-title" className="bg-sage-100">
        <div className="mx-auto max-w-7xl px-5 pt-8 pb-14 sm:px-8 sm:pb-20">
          <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Le village', to: '/village' }, { label: name }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
            <BuildingIllustration
              slug={building.slug}
              className="building-art mx-auto h-52 w-auto max-w-full sm:h-72 lg:order-2 lg:col-span-6 lg:h-96"
            />
            <div className="lg:col-span-6">
              <h1 id="building-title" className="text-4xl leading-tight font-medium text-forest-900 sm:text-5xl lg:text-6xl">
                {name}
              </h1>
              <p className="mt-3 font-display text-2xl leading-snug text-emerald-700">{question}</p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">{why}</p>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-muted">
                <span className="font-semibold text-forest-900">Ce lieu ouvrira bientôt.</span> En attendant, le diagnostic
                de l’École aborde déjà cette question.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to={buildingPath('ecole')} viewTransition>
                  Aller à l’École
                </ButtonLink>
                <ButtonLink to={`/village?lieu=${building.slug}`} variant="outline-dark" viewTransition>
                  <ArrowLeft aria-hidden="true" /> Retour au village
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="planned-title" className="bg-ivory-50 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="planned-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
              Ce que vous y trouverez
            </h2>
            <ul className="mt-6 space-y-6">
              {planned.map((feature) => (
                <li key={feature.title} className="flex gap-4">
                  <feature.icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-emerald-700" />
                  <div>
                    <h3 className="text-lg font-medium text-forest-900">{feature.title}</h3>
                    <p className="mt-0.5 leading-relaxed text-ink-muted">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="border-t border-forest-900/12">
              <Disclosure title="En savoir plus sur ce lieu">
                <p className="leading-relaxed text-ink-muted">{description}</p>
              </Disclosure>
              <Disclosure title="Le lien avec la démarche NIRD" hint={`Pilier « ${pillar.name} »`}>
                <p className="leading-relaxed text-ink-muted">{missionLink}</p>
                <p className="mt-3 leading-relaxed text-ink-muted">
                  <span className="font-semibold text-forest-900">{pillar.name}&nbsp;:</span> {pillar.description}
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </section>

      <NeighbourNav building={building} />
    </>
  )
}

/** Previous and next places, walking around the village. */
export function NeighbourNav({ building }: { building: Building }) {
  const index = buildings.indexOf(building)
  const previous = buildings[(index - 1 + buildings.length) % buildings.length]!
  const next = buildings[(index + 1) % buildings.length]!
  return (
    <nav aria-label="Autres lieux du village" className="bg-ivory-100 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-x-6 gap-y-2 px-5 sm:px-8">
        <NeighbourLink building={previous} direction="previous" />
        <NeighbourLink building={next} direction="next" />
      </div>
    </nav>
  )
}

function NeighbourLink({ building, direction }: { building: Building; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  const Arrow = isNext ? ArrowRight : ArrowLeft
  return (
    <Link
      to={buildingPath(building.slug)}
      viewTransition
      className={`group flex min-h-14 items-center gap-3 rounded-lg text-forest-900 hover:text-emerald-700 ${isNext ? 'flex-row-reverse text-right' : ''}`}
    >
      <Arrow aria-hidden="true" className="size-5 shrink-0" />
      <span>
        <span className="block font-display text-lg leading-tight">{building.name}</span>
        <span className="hidden text-sm text-ink-muted sm:block">{building.question}</span>
      </span>
    </Link>
  )
}
