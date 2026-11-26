import { ArrowLeft, ExternalLink, Info } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '../../../components/navigation/Breadcrumbs'
import { Disclosure } from '../../../components/ui/Disclosure'
import { buttonClass } from '../../../components/ui/buttonClass'
import { NotFoundPage } from '../../not-found/NotFoundPage'
import { CompareToggle } from '../components/CompareToggle'
import { CompareTray } from '../components/CompareTray'
import { ToolCard, platformSummary } from '../components/ToolCard'
import { ToolCover } from '../components/visuals'
import { categories, hostingLabels, platformLabels, selfHostingLabels } from '../data/categories'
import { VERIFIED_ON, getTool } from '../data/software'
import { libraryPaths } from '../paths'
import type { Tool } from '../types/library'

const verifiedOn = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(VERIFIED_ON))

/** The four notions people mix up, said plainly for this tool. */
function statusLines(tool: Tool) {
  return [
    `Logiciel libre (licence ${tool.license.name})`,
    'Gratuit à utiliser',
    ...(tool.paidServices ? ['Services payants proposés autour'] : []),
    tool.selfHosting === 'oui' ? 'Hébergeable sur votre serveur' : tool.selfHosting === 'partiel' ? 'Hébergeable en partie' : 'Rien à héberger',
  ]
}

const external = (href: string, label: string, className: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {label}
    <ExternalLink aria-hidden="true" className="size-4" />
    <span className="sr-only"> (nouvel onglet)</span>
  </a>
)

export function ToolPage() {
  const { id } = useParams()
  const tool = getTool(id)
  if (!tool) return <NotFoundPage />

  const category = categories.find((c) => c.id === tool.categories[0])!
  const alternatives = tool.alternatives.map((other) => getTool(other)).filter((other): other is Tool => other !== undefined)

  return (
    <>
      <title>{`${tool.name} : ${tool.purpose.toLowerCase()} — Bibliothèque — NIRD WORLD`}</title>

      <section aria-labelledby="tool-title" className="bg-sage-100">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 sm:px-8 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Le village', to: '/village' },
              { label: 'Bibliothèque', to: libraryPaths.home },
              { label: tool.name },
            ]}
          />
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
            <ToolCover tool={tool} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-emerald-700">
                <Link to={libraryPaths.category(category.id)} className="rounded underline-offset-4 hover:underline">
                  {category.title}
                </Link>
              </p>
              <h1 id="tool-title" className="mt-1 text-4xl leading-tight font-medium text-forest-900 sm:text-5xl">
                {tool.name}
              </h1>
              <p className="mt-2 font-display text-2xl leading-snug text-forest-900">{tool.purpose}</p>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">{tool.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm text-forest-900">
                {statusLines(tool).map((line) => (
                  <li key={line} className="rounded-full bg-ivory-50 px-3 py-1.5 ring-1 ring-forest-900/10">
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {external(tool.website, 'Site officiel', buttonClass('primary'))}
                <CompareToggle tool={tool} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-ivory-50">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <section aria-labelledby="usages-title">
            <h2 id="usages-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
              À l’école, pour…
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {tool.useCases.map((useCase) => (
                <li key={useCase} className="rounded-2xl bg-sage-100 px-5 py-4 text-lg leading-snug text-forest-900">
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <section aria-labelledby="atouts-title">
              <h2 id="atouts-title" className="text-2xl font-medium text-forest-900">
                Ce qui plaît
              </h2>
              <ul className="mt-4 space-y-2.5 leading-relaxed text-ink-muted">
                {tool.advantages.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="limites-title">
              <h2 id="limites-title" className="text-2xl font-medium text-forest-900">
                À savoir avant de choisir
              </h2>
              <ul className="mt-4 space-y-2.5 leading-relaxed text-ink-muted">
                {tool.limitations.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside aria-labelledby="donnees-title" className="mt-12 flex gap-4 rounded-3xl bg-gold-300/40 p-6 sm:p-8">
            <Info aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold-700" />
            <div>
              <h2 id="donnees-title" className="font-sans text-base font-semibold tracking-normal text-forest-900">
                Côté données
              </h2>
              <p className="mt-1 max-w-3xl text-lg leading-relaxed text-forest-900">{tool.dataNote}</p>
            </div>
          </aside>

          <section aria-labelledby="details-title" className="mt-14">
            <h2 id="details-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
              Pour aller plus loin
            </h2>
            <div className="mt-4 border-t border-forest-900/12">
              <Disclosure title="Où l’utiliser et comment l’installer" hint={platformSummary(tool)}>
                <dl className="max-w-3xl space-y-4 leading-relaxed text-ink-muted">
                  <div>
                    <dt className="font-semibold text-forest-900">Appareils</dt>
                    <dd>{tool.platforms.map((platform) => platformLabels[platform]).join(', ')}.</dd>
                    {tool.platformNote && <dd className="mt-1">{tool.platformNote}</dd>}
                  </div>
                  <div>
                    <dt className="font-semibold text-forest-900">Fonctionnement</dt>
                    <dd>{hostingLabels[tool.hosting]}.</dd>
                    {tool.hostingNote && <dd className="mt-1">{tool.hostingNote}</dd>}
                  </div>
                  <div>
                    <dt className="font-semibold text-forest-900">L’héberger soi-même</dt>
                    <dd>{selfHostingLabels[tool.selfHosting]}.</dd>
                  </div>
                </dl>
              </Disclosure>
              <Disclosure title="Licence et prix" hint={`${tool.license.name}, gratuit à utiliser`}>
                <dl className="max-w-3xl space-y-4 leading-relaxed text-ink-muted">
                  <div>
                    <dt className="font-semibold text-forest-900">Licence</dt>
                    <dd>
                      {tool.license.name}, une licence libre reconnue par l’Open Source Initiative&nbsp;: on peut utiliser, étudier,
                      modifier et partager le logiciel.
                    </dd>
                    {tool.license.note && <dd className="mt-1">{tool.license.note}</dd>}
                  </div>
                  <div>
                    <dt className="font-semibold text-forest-900">Prix</dt>
                    <dd>Gratuit à utiliser.</dd>
                    <dd className="mt-1">{tool.paidServices ?? 'Nos sources ne mentionnent pas de service payant lié à ce logiciel.'}</dd>
                  </div>
                </dl>
              </Disclosure>
              {tool.insteadOf.length > 0 && (
                <Disclosure title="Si vous utilisez aujourd’hui…" hint={tool.insteadOf.join(', ')}>
                  <p className="max-w-3xl leading-relaxed text-ink-muted">
                    {tool.name} répond à des besoins proches de ceux de {tool.insteadOf.join(', ')}, des logiciels ou services
                    propriétaires. Les fonctions et l’interface ne sont pas identiques&nbsp;: essayez avec vos propres fichiers avant
                    de décider.
                  </p>
                </Disclosure>
              )}
              <Disclosure title="Sources" hint={`Informations vérifiées le ${verifiedOn}`}>
                <p className="max-w-3xl leading-relaxed text-ink-muted">
                  Chaque information de cette fiche vient des pages officielles du projet. Les services et les prix évoluent&nbsp;:
                  vérifiez-les avant de vous engager.
                </p>
                <ul className="mt-3 space-y-1.5">
                  {tool.sources.map((source) => (
                    <li key={source.url}>
                      {external(source.url, source.label, 'inline-flex min-h-9 items-center gap-1.5 rounded text-emerald-700 underline underline-offset-4 hover:text-forest-900')}
                    </li>
                  ))}
                </ul>
              </Disclosure>
            </div>
          </section>

          {alternatives.length > 0 && (
            <section aria-labelledby="aussi-title" className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 id="aussi-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
                  À découvrir aussi
                </h2>
                <Link
                  to={libraryPaths.compare([tool.id, ...tool.alternatives.slice(0, 2)])}
                  className="inline-flex min-h-11 items-center rounded font-semibold text-emerald-700 hover:text-forest-900"
                >
                  Comparer {tool.name} avec {alternatives.slice(0, 2).map((a) => a.name).join(' et ')}
                </Link>
              </div>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {alternatives.map((other) => (
                  <li key={other.id}>
                    <ToolCard tool={other} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link
            to={libraryPaths.category(category.id)}
            className="mt-12 inline-flex min-h-11 items-center gap-2 rounded font-semibold text-emerald-700 hover:text-forest-900"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> {category.title}
          </Link>
        </div>
      </div>
      <CompareTray />
    </>
  )
}
