import { Plus, X } from 'lucide-react'
import { useEffect, useId, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Breadcrumbs } from '../../../components/navigation/Breadcrumbs'
import { ToolCover } from '../components/visuals'
import { categories, hostingLabels, platformLabels, selfHostingLabels } from '../data/categories'
import { getTool, tools } from '../data/software'
import { comparisonActions, useComparison } from '../hooks/useComparison'
import { libraryPaths } from '../paths'
import { MAX_COMPARED, MIN_COMPARED, cleanSelection } from '../services/comparison'
import type { Tool } from '../types/library'

const isKnown = (id: string) => getTool(id) !== undefined

const suggestions: [string, string, ...string[]][] = [
  ['jitsi', 'bigbluebutton'],
  ['nextcloud', 'syncthing'],
  ['gimp', 'krita', 'inkscape'],
  ['libreoffice', 'cryptpad'],
]

const list = (items: readonly string[]) => (
  <ul className="space-y-1.5">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

/** Properties compared, in the order people decide: what it does, where it runs, then the constraints. */
const rows: { label: string; render: (tool: Tool) => ReactNode }[] = [
  { label: 'À quoi il sert', render: (tool) => <p className="font-display text-lg text-forest-900">{tool.purpose}</p> },
  { label: 'À l’école, pour', render: (tool) => list(tool.useCases) },
  {
    label: 'Appareils',
    render: (tool) => (
      <>
        <p>{tool.platforms.map((platform) => platformLabels[platform]).join(', ')}</p>
        {tool.platformNote && <p className="mt-1 text-sm">{tool.platformNote}</p>}
      </>
    ),
  },
  {
    label: 'Fonctionnement',
    render: (tool) => (
      <>
        <p>{hostingLabels[tool.hosting]}</p>
        {tool.hostingNote && <p className="mt-1 text-sm">{tool.hostingNote}</p>}
      </>
    ),
  },
  { label: 'L’héberger soi-même', render: (tool) => <p>{selfHostingLabels[tool.selfHosting]}</p> },
  {
    label: 'Licence et prix',
    render: (tool) => (
      <>
        <p>Libre ({tool.license.name}), gratuit à utiliser.</p>
        {tool.paidServices && <p className="mt-1 text-sm">{tool.paidServices}</p>}
      </>
    ),
  },
  { label: 'Ce qui plaît', render: (tool) => list(tool.advantages) },
  { label: 'À savoir avant de choisir', render: (tool) => list(tool.limitations) },
  { label: 'Côté données', render: (tool) => <p>{tool.dataNote}</p> },
]

export function ComparePage() {
  const [params, setParams] = useSearchParams()
  const stored = useComparison()
  const fromUrl = cleanSelection((params.get('outils') ?? '').split(','), isKnown)
  const selected = (fromUrl.length > 0 ? fromUrl : stored).map((id) => getTool(id)!)
  const addId = useId()

  // The address is the reference (it can be shared); the tray follows it.
  useEffect(() => {
    if (fromUrl.length > 0 && fromUrl.join() !== stored.join()) comparisonActions.set(fromUrl)
    else if (fromUrl.length === 0 && stored.length > 0) setParams({ outils: stored.join(',') }, { replace: true })
  }, [fromUrl.join(), stored.join()]) // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (ids: string[]) => {
    comparisonActions.set(ids)
    setParams(ids.length > 0 ? { outils: ids.join(',') } : {}, { replace: true, preventScrollReset: true })
  }
  const ids = selected.map((tool) => tool.id)
  const columns = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' }[Math.max(1, selected.length) as 1 | 2 | 3]

  return (
    <>
      <title>{`Comparer ${selected.map((t) => t.name).join(', ') || 'des outils'} — Bibliothèque — NIRD WORLD`}</title>

      <section aria-labelledby="compare-title" className="bg-sage-100">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-10 sm:px-8">
          <Breadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Le village', to: '/village' },
              { label: 'Bibliothèque', to: libraryPaths.home },
              { label: 'Comparer' },
            ]}
          />
          <h1 id="compare-title" className="mt-5 text-4xl leading-tight font-medium text-forest-900 sm:text-5xl">
            Comparer, sans désigner de gagnant
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Le bon choix dépend de vos besoins, des compétences disponibles et de vos moyens. Ce tableau aide à poser les bonnes
            questions&nbsp;; il ne note pas les outils.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {selected.map((tool) => (
              <span key={tool.id} className="inline-flex items-center gap-1 rounded-full bg-ivory-50 py-1 pr-1 pl-4 text-forest-900 ring-1 ring-forest-900/10">
                {tool.name}
                <button
                  type="button"
                  onClick={() => choose(ids.filter((id) => id !== tool.id))}
                  className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-sage-200 hover:text-forest-900"
                >
                  <X aria-hidden="true" className="size-4" />
                  <span className="sr-only">Retirer {tool.name}</span>
                </button>
              </span>
            ))}
            {selected.length < MAX_COMPARED && (
              <span className="inline-flex max-w-full items-center gap-2">
                <label htmlFor={addId} className="sr-only">
                  Ajouter un outil à la comparaison
                </label>
                <span className="relative max-w-full">
                  <Plus aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-700" />
                  <select
                    id={addId}
                    value=""
                    onChange={(event) => event.target.value && choose([...ids, event.target.value])}
                    className="min-h-11 w-full max-w-full rounded-full bg-ivory-50 pr-3 pl-9 font-semibold text-emerald-700 ring-1 ring-forest-900/15 ring-inset"
                  >
                    <option value="">Ajouter un outil</option>
                    {categories.map((category) => (
                      <optgroup key={category.id} label={category.title}>
                        {tools
                          .filter((tool) => tool.categories[0] === category.id && !ids.includes(tool.id))
                          .map((tool) => (
                            <option key={tool.id} value={tool.id}>
                              {tool.name} : {tool.purpose.toLowerCase()}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </span>
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="bg-ivory-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          {selected.length < MIN_COMPARED ? (
            <section aria-labelledby="idees-title">
              <h2 id="idees-title" className="text-2xl font-medium text-forest-900">
                {selected.length === 0 ? 'Choisissez deux ou trois outils' : 'Encore un outil, et c’est parti'}
              </h2>
              <p className="mt-2 text-ink-muted">Quelques comparaisons qui reviennent souvent&nbsp;:</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {suggestions.map((pair) => (
                  <li key={pair.join()}>
                    <button
                      type="button"
                      onClick={() => choose(pair)}
                      className="flex min-h-16 w-full items-center rounded-2xl bg-sage-100 px-5 text-left font-display text-xl text-forest-900 hover:bg-sage-200"
                    >
                      {pair.map((id) => getTool(id)!.name).join(' ou ')}&nbsp;?
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <>
              {/* Tool names stay visible while scrolling down the comparison. */}
              <div className={`sticky top-16 z-10 -mx-5 hidden gap-6 border-b border-forest-900/10 bg-ivory-50/95 px-5 py-3 backdrop-blur md:grid ${columns}`}>
                {selected.map((tool) => (
                  <Link key={tool.id} to={libraryPaths.tool(tool.id)} className="flex items-center gap-3 rounded-lg hover:text-emerald-700">
                    <ToolCover tool={tool} size="sm" />
                    <span className="font-display text-2xl text-forest-900">{tool.name}</span>
                  </Link>
                ))}
              </div>

              {rows.map((row) => (
                <section key={row.label} aria-label={row.label} className="border-b border-forest-900/10 py-6">
                  <h2 className="font-sans text-sm font-semibold tracking-normal text-emerald-700">{row.label}</h2>
                  <ul className={`mt-3 grid gap-x-6 gap-y-4 ${columns}`}>
                    {selected.map((tool) => (
                      <li key={tool.id} className="leading-relaxed text-ink-muted">
                        <p className="mb-1 font-semibold text-forest-900 md:sr-only">{tool.name}</p>
                        {row.render(tool)}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <section aria-labelledby="questions-title" className="mt-10 rounded-3xl bg-sage-100 p-6 sm:p-8">
                <h2 id="questions-title" className="text-2xl font-medium text-forest-900">
                  Avant de choisir, demandez-vous
                </h2>
                <ul className="mt-4 space-y-2 leading-relaxed text-ink-muted">
                  <li>Qui l’installera, le mettra à jour et répondra aux questions des collègues&nbsp;?</li>
                  <li>Sur quels appareils les élèves et les équipes vont-ils l’utiliser&nbsp;?</li>
                  <li>Où seront les données, et qui pourra y accéder&nbsp;?</li>
                  <li>Peut-on l’essayer d’abord avec un petit groupe et de vrais documents&nbsp;?</li>
                </ul>
              </section>
            </>
          )}

          <Link to={libraryPaths.home} className="mt-10 inline-flex min-h-11 items-center rounded font-semibold text-emerald-700 hover:text-forest-900">
            Retour à la Bibliothèque
          </Link>
        </div>
      </div>
    </>
  )
}
