import { ArrowLeft, ArrowRight, Hourglass } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs'
import { ButtonLink } from '../../components/ui/ButtonLink'
import { Reveal } from '../../components/ui/Reveal'
import { buildingPath, buildings, getBuilding, pillars, type Building } from '../../data/buildings'
import { NotFoundPage } from '../not-found/NotFoundPage'
import { BuildingIllustration } from '../village/BuildingIllustration'

export function BuildingPage() {
  const { slug } = useParams()
  const building = getBuilding(slug)
  if (!building) return <NotFoundPage />

  const { number, name, theme, description, icon: Icon, planned, missionLink } = building
  const pillar = pillars[building.pillar]
  const index = buildings.indexOf(building)
  const previous = buildings[(index - 1 + buildings.length) % buildings.length]
  const next = buildings[(index + 1) % buildings.length]

  return (
    <>
      <title>{`${name} — ${theme} — NIRD WORLD`}</title>

      <section aria-labelledby="building-title" className="bg-ivory-100">
        <div className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 sm:pb-24">
          <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Le village', to: '/village' }, { label: name }]} />

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                <span className="grid size-8 place-items-center rounded-full bg-forest-900 text-gold-300">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                Lieu {number} · {theme}
              </p>
              <h1 id="building-title" className="mt-5 text-5xl leading-none font-medium text-forest-900 sm:text-6xl lg:text-7xl">
                {name}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{description}</p>

              <div className="mt-8 flex max-w-xl gap-4 rounded-2xl bg-ivory-50 p-5 ring-1 ring-gold-400/40">
                <Hourglass aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-700" />
                <div>
                  <p className="font-semibold text-forest-900">Module en préparation</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    Ce lieu ouvrira lors d’une prochaine étape du projet. Cette page présente ce que vous y trouverez.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <ButtonLink to="/village" variant="outline-dark">
                  <ArrowLeft aria-hidden="true" /> Retour au village
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-3xl bg-forest-900 p-10 sm:p-14">
                <span aria-hidden="true" className="absolute top-6 left-7 font-display text-6xl text-ivory-50/10 tabular-nums">
                  {number}
                </span>
                <BuildingIllustration slug={building.slug} className="h-full max-h-80 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="planned-title" className="border-t border-ivory-300/60 bg-ivory-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">Bientôt dans ce lieu</p>
          <h2 id="planned-title" className="mt-3 text-3xl font-medium text-forest-900 sm:text-4xl">
            Ce que vous trouverez ici
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {planned.map((feature, i) => (
              <li key={feature.title}>
                <Reveal delay={i * 0.08} className="flex h-full flex-col rounded-2xl bg-ivory-100 p-6 ring-1 ring-ivory-300/80">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700">
                      <feature.icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="rounded-full bg-ivory-200 px-2.5 py-1 text-xs font-semibold text-ink-muted">Prévu</span>
                  </div>
                  <h3 className="mt-5 text-xl font-medium text-forest-900">{feature.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-muted">{feature.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="mission-link-title" className="bg-forest-900 py-20 text-ivory-50 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold-400 uppercase">Lien avec la démarche NIRD</p>
            <div className="mt-6 flex items-center gap-5">
              <span aria-hidden="true" className="font-display text-7xl leading-none text-gold-300">
                {pillar.letter}
              </span>
              <div>
                <p className="text-sm text-ivory-100/60">Pilier principal</p>
                <p className="font-display text-2xl">{pillar.name}</p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-ivory-100/65">{pillar.description}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="mission-link-title" className="text-3xl leading-snug font-medium sm:text-4xl">
              Pourquoi ce lieu compte
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ivory-100/80">{missionLink}</p>
          </div>
        </div>
      </section>

      <nav aria-label="Autres lieux du village" className="bg-ivory-100 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8">
          {previous && <NeighbourLink building={previous} direction="previous" />}
          {next && <NeighbourLink building={next} direction="next" />}
        </div>
      </nav>
    </>
  )
}

export function NeighbourLink({ building, direction }: { building: Building; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  return (
    <Link
      to={buildingPath(building.slug)}
      className={`group flex min-h-24 items-center gap-4 rounded-2xl bg-ivory-50 p-5 ring-1 ring-ivory-300/80 transition hover:shadow-soft hover:ring-emerald-600/40 ${
        isNext ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {isNext ? (
        <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-emerald-700 transition-transform group-hover:translate-x-0.5" />
      ) : (
        <ArrowLeft aria-hidden="true" className="size-5 shrink-0 text-emerald-700 transition-transform group-hover:-translate-x-0.5" />
      )}
      <span className="flex-1">
        <span className="block text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
          {isNext ? 'Lieu suivant' : 'Lieu précédent'}
        </span>
        <span className="mt-1 block font-display text-xl text-forest-900">
          {building.number} — {building.name}
        </span>
      </span>
    </Link>
  )
}
