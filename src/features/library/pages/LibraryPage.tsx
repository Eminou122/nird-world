import { Search, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Breadcrumbs } from '../../../components/navigation/Breadcrumbs'
import { ButtonLink } from '../../../components/ui/ButtonLink'
import { Disclosure } from '../../../components/ui/Disclosure'
import { SectionHeading } from '../../../components/ui/SectionHeading'
import { getBuilding } from '../../../data/buildings'
import { NeighbourNav } from '../../buildings/BuildingPage'
import { BuildingIllustration } from '../../village/BuildingIllustration'
import { CompareTray } from '../components/CompareTray'
import { ToolCard } from '../components/ToolCard'
import { Shelf, categoryIcons } from '../components/visuals'
import { categories, platformLabels, searchExamples } from '../data/categories'
import { explanations } from '../data/explanations'
import { tools } from '../data/software'
import { searchTools } from '../services/search'
import type { CategoryId, Platform } from '../types/library'

const isCategory = (value: string | null): value is CategoryId => categories.some((category) => category.id === value)
const isPlatform = (value: string | null): value is Platform => value !== null && Object.hasOwn(platformLabels, value)


export function LibraryPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const besoin = params.get('besoin')
  const sur = params.get('sur')
  const category = isCategory(besoin) ? besoin : null
  const platform = isPlatform(sur) ? sur : null
  const searching = query.trim() !== '' || category !== null || platform !== null || params.has('tout')

  const results = useMemo(() => searchTools(tools, { query, category, platform }), [query, category, platform])
  const resultsRef = useRef<HTMLHeadingElement>(null)
  const searchId = useId()
  const platformId = useId()
  const bibliotheque = getBuilding('bibliotheque')!

  /** Updates one filter in the address, so results can be shared and the Back button works. */
  function update(key: 'q' | 'besoin' | 'sur', value: string | null) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(key, value)
        else next.delete(key)
        // Clearing a filter from the results keeps you on the results.
        if (!value && key !== 'q' && current.size > 0 && !next.get('q') && !next.has('besoin') && !next.has('sur')) next.set('tout', '1')
        if (value) next.delete('tout')
        return next
      },
      { replace: key === 'q', preventScrollReset: true },
    )
  }

  // A category link disappears once results show: keep keyboard and screen-reader users on the results.
  const lastCategory = useRef(category)
  useEffect(() => {
    if (lastCategory.current === category) return
    lastCategory.current = category
    const active = document.activeElement
    if (category && (!active || active === document.body || !document.contains(active))) {
      resultsRef.current?.focus({ preventScroll: true })
      resultsRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [category])

  const title = category ? categories.find((c) => c.id === category)!.title : query.trim() ? `Résultats pour « ${query.trim()} »` : 'Tous les outils'

  return (
    <>
      <title>{searching ? `${title} — Bibliothèque — NIRD WORLD` : 'Bibliothèque — Logiciels libres — NIRD WORLD'}</title>

      <section aria-labelledby="library-title" className="bg-sage-100">
        <div className="mx-auto max-w-7xl px-5 pt-8 pb-12 sm:px-8 sm:pb-16">
          <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Le village', to: '/village' }, { label: 'Bibliothèque' }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h1 id="library-title" className="text-4xl leading-tight font-medium text-forest-900 sm:text-5xl lg:text-6xl">
                Que souhaitez‑vous faire&nbsp;?
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
                Découvrez des outils numériques libres adaptés à vos besoins.
              </p>

              <form role="search" onSubmit={(event) => event.preventDefault()} className="mt-7 max-w-xl">
                <label htmlFor={searchId} className="sr-only">
                  Décrivez ce que vous voulez faire, ou le nom d’un logiciel
                </label>
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-muted" />
                  <input
                    id={searchId}
                    type="search"
                    value={query}
                    onChange={(event) => update('q', event.target.value)}
                    placeholder="Ex. faire un podcast, remplacer Word…"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="block min-h-14 w-full rounded-full bg-ivory-50 pr-12 pl-12 text-lg text-ink shadow-soft ring-1 ring-forest-900/15 ring-inset placeholder:text-ink-muted/70 [&::-webkit-search-cancel-button]:hidden"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => update('q', null)}
                      className="absolute top-1/2 right-1.5 grid size-11 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-sage-200 hover:text-forest-900"
                    >
                      <X aria-hidden="true" className="size-5" />
                      <span className="sr-only">Effacer la recherche</span>
                    </button>
                  )}
                </div>
                {!searching && (
                  <p className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-ink-muted">
                    Essayez&nbsp;:
                    {searchExamples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => update('q', example)}
                        className="min-h-9 rounded-full px-2 font-semibold text-emerald-700 hover:bg-sage-200 hover:text-forest-900"
                      >
                        {example}
                      </button>
                    ))}
                  </p>
                )}
              </form>
            </div>
            {!searching && (
              <BuildingIllustration slug="bibliotheque" className="building-art mx-auto hidden h-80 w-auto max-w-full lg:col-span-5 lg:block" />
            )}
          </div>
        </div>
      </section>

      <div className="bg-ivory-100">
        {searching ? (
          <section aria-labelledby="results-title" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 id="results-title" ref={resultsRef} tabIndex={-1} className="scroll-mt-24 text-3xl font-medium text-forest-900 outline-none">
                  {title}
                </h2>
                <p aria-live="polite" className="mt-1 text-ink-muted">
                  {results.length === 0 ? 'Aucun outil' : results.length === 1 ? '1 outil' : `${results.length} outils`}
                </p>
              </div>
              <Link
                to="/village/bibliotheque"
                preventScrollReset
                className="inline-flex min-h-11 items-center rounded font-semibold text-emerald-700 hover:text-forest-900"
              >
                Revenir aux six envies
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <nav aria-label="Filtrer par besoin" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <ul className="flex gap-2 sm:flex-wrap">
                  <FilterChip active={category === null} onClick={() => update('besoin', null)} label="Tous les besoins" />
                  {categories.map((c) => (
                    <FilterChip key={c.id} active={category === c.id} onClick={() => update('besoin', c.id)} label={c.title} />
                  ))}
                </ul>
              </nav>
              <div className="flex shrink-0 items-center gap-2">
                <label htmlFor={platformId} className="text-sm text-ink-muted">
                  Fonctionne sur
                </label>
                <select
                  id={platformId}
                  value={platform ?? ''}
                  onChange={(event) => update('sur', event.target.value || null)}
                  className="min-h-11 rounded-full bg-ivory-50 px-3.5 text-forest-900 ring-1 ring-forest-900/20 ring-inset"
                >
                  <option value="">Tout appareil</option>
                  {Object.entries(platformLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {platform && platform !== 'navigateur' && platform !== 'android' && platform !== 'ios' && (
              <p className="mt-3 text-sm text-ink-muted">Les outils utilisables dans un navigateur sont inclus.</p>
            )}

            {results.length > 0 ? (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((tool) => (
                  <li key={tool.id}>
                    <ToolCard tool={tool} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-3xl bg-ivory-50 p-7 sm:p-10">
                <p className="font-display text-2xl text-forest-900">Rien ne correspond, pour l’instant.</p>
                <p className="mt-2 max-w-xl leading-relaxed text-ink-muted">
                  Essayez un mot plus simple («&nbsp;vidéo&nbsp;», «&nbsp;dessin&nbsp;», «&nbsp;cours&nbsp;»), le nom d’un logiciel que
                  vous utilisez déjà, ou retirez un filtre.
                </p>
                <ButtonLink to="/village/bibliotheque" variant="dark" className="mt-6">
                  Tout effacer
                </ButtonLink>
              </div>
            )}
          </section>
        ) : (
          <>
            <section aria-labelledby="envies-title" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
              <h2 id="envies-title" className="sr-only">
                Six envies pour commencer
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => {
                  const Icon = categoryIcons[c.id]
                  const own = tools.filter((tool) => tool.categories.includes(c.id))
                  return (
                    <li key={c.id}>
                      <Link
                        to={`?besoin=${c.id}`}
                        className="group flex h-full flex-col rounded-3xl bg-ivory-50 p-6 ring-1 ring-forest-900/8 transition duration-200 hover:shadow-soft hover:ring-emerald-600/40"
                      >
                        <Shelf category={c.id} tools={own} />
                        <span className="mt-5 flex items-center gap-2.5 text-emerald-700">
                          <Icon aria-hidden="true" className="size-5" />
                          <span className="text-sm">{own.length} outils</span>
                        </span>
                        <span className="mt-2 block font-display text-2xl leading-snug text-forest-900 group-hover:text-emerald-700">
                          {c.title}
                        </span>
                        <span className="mt-1 block leading-relaxed text-ink-muted">{c.description}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-6 text-ink-muted">
                Ou{' '}
                <Link to="?tout=1" className="rounded font-semibold text-emerald-700 underline-offset-4 hover:text-forest-900 hover:underline">
                  parcourir les {tools.length} outils
                </Link>
                .
              </p>
            </section>

            <section aria-labelledby="comprendre-title" className="bg-ivory-50">
              <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <SectionHeading id="comprendre-title" title="Envie de comprendre&nbsp;?">
                    <p>Cinq questions que l’on se pose souvent. Ouvrez celles qui vous intriguent.</p>
                  </SectionHeading>
                  <p className="mt-6 leading-relaxed text-ink-muted">
                    Pas sûr de vos besoins&nbsp;?{' '}
                    <Link to="/village/ecole" className="font-semibold text-emerald-700 underline-offset-4 hover:underline">
                      Le diagnostic de l’École
                    </Link>{' '}
                    vous aide à y voir clair.
                  </p>
                </div>
                <div className="border-t border-forest-900/12 lg:col-span-7">
                  {explanations.map((explanation) => (
                    <Disclosure key={explanation.id} title={explanation.question}>
                      <div className="max-w-2xl space-y-3 leading-relaxed text-ink-muted">
                        {explanation.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        {explanation.sources.length > 0 && (
                          <p className="text-sm">
                            Pour aller plus loin&nbsp;:{' '}
                            {explanation.sources.map((source, index) => (
                              <span key={source.url}>
                                {index > 0 && ', '}
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline underline-offset-4 hover:text-forest-900">
                                  {source.label}
                                  <span className="sr-only"> (nouvel onglet)</span>
                                </a>
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    </Disclosure>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {!searching && <NeighbourNav building={bibliotheque} />}
      <CompareTray />
    </>
  )
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={`min-h-11 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
          active ? 'bg-forest-900 text-ivory-50' : 'bg-ivory-50 text-forest-900 ring-1 ring-forest-900/15 ring-inset hover:bg-sage-200'
        }`}
      >
        {label}
      </button>
    </li>
  )
}
