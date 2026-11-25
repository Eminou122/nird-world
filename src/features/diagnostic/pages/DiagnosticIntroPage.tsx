import { Footprints, Gauge, Scale } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Breadcrumbs } from '../../../components/navigation/Breadcrumbs'
import { Disclosure } from '../../../components/ui/Disclosure'
import { SectionHeading } from '../../../components/ui/SectionHeading'
import { buttonClass } from '../../../components/ui/buttonClass'
import { getBuilding } from '../../../data/buildings'
import { NeighbourNav } from '../../buildings/BuildingPage'
import { BuildingIllustration } from '../../village/BuildingIllustration'
import { MethodologyContent } from '../components/report'
import { StorageNotice, dimensionIcons, institutionLabel, plural } from '../components/ui'
import { dimensionIntros } from '../data/guidance'
import { dimensions, institutionTypes, questions } from '../data/questions'
import { diagnosticActions, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import { diagnosticPaths } from '../paths'
import { MAX_NAME_LENGTH } from '../services/storage'
import type { InstitutionType } from '../types/diagnostic'

const outcomes = [
  { icon: Gauge, title: 'Un score lisible', text: 'Votre niveau d’indépendance numérique, et celui de chacun des cinq sujets.' },
  { icon: Scale, title: 'Un regard honnête', text: 'Ce qui va bien, ce qui mérite votre attention, et ce qu’il reste à vérifier.' },
  { icon: Footprints, title: 'Un premier pas', text: 'Une action prioritaire à lancer, puis une feuille de route pour la suite.' },
]

export function DiagnosticIntroPage() {
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState<InstitutionType | ''>('')
  const nameId = useId()
  const typeId = useId()

  const inProgress = store.assessments.find((a) => a.id === store.activeId && a.completedAt === null)
  const ecole = getBuilding('ecole')!

  function handleStart(event: FormEvent) {
    event.preventDefault()
    diagnosticActions.start(name, type || null)
    navigate(diagnosticPaths.questionnaire)
  }

  return (
    <>
      <title>Diagnostic d’indépendance numérique — École — NIRD WORLD</title>

      <section aria-labelledby="diagnostic-title" className="bg-sage-100">
        <div className="mx-auto max-w-7xl px-5 pt-8 pb-14 sm:px-8 sm:pb-20">
          <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Le village', to: '/village' }, { label: 'École' }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <h1 id="diagnostic-title" className="text-4xl leading-tight font-medium text-forest-900 sm:text-5xl lg:text-6xl">
                Où en est votre établissement&nbsp;?
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
                Le diagnostic d’indépendance numérique vous pose {questions.length} questions sur ce qui se fait vraiment
                chez vous. Comptez une quinzaine de minutes. Vous repartez avec un premier pas concret.
              </p>

              <div className="mt-6 max-w-xl space-y-4">
                <StorageNotice />

                {inProgress && (
                  <div className="flex flex-col gap-4 rounded-3xl bg-ivory-50 p-6 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <p className="font-display text-xl text-forest-900">Vous en étiez là</p>
                      <p className="mt-1 text-ink-muted">
                        {institutionLabel(inProgress)}, {plural(Object.keys(inProgress.answers).length, 'réponse', 'réponses')} sur{' '}
                        {questions.length}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        diagnosticActions.open(inProgress.id)
                        navigate(diagnosticPaths.questionnaire)
                      }}
                      className={buttonClass('primary')}
                    >
                      Reprendre
                    </button>
                  </div>
                )}

                <form onSubmit={handleStart} className="rounded-3xl bg-ivory-50 p-6">
                  {inProgress && <p className="mb-4 font-display text-xl text-forest-900">Ou en commencer un nouveau</p>}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={nameId} className="text-sm text-ink-muted">
                        Nom de l’établissement (facultatif)
                      </label>
                      <input
                        id={nameId}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={MAX_NAME_LENGTH}
                        autoComplete="organization"
                        className="mt-1.5 block min-h-12 w-full rounded-xl bg-ivory-100 px-4 text-ink ring-1 ring-forest-900/20 ring-inset"
                      />
                    </div>
                    <div>
                      <label htmlFor={typeId} className="text-sm text-ink-muted">
                        Type d’établissement (facultatif)
                      </label>
                      <select
                        id={typeId}
                        value={type}
                        onChange={(event) => setType(event.target.value as InstitutionType | '')}
                        className="mt-1.5 block min-h-12 w-full rounded-xl bg-ivory-100 px-3.5 text-ink ring-1 ring-forest-900/20 ring-inset"
                      >
                        <option value="">Non précisé</option>
                        {Object.entries(institutionTypes).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className={buttonClass(inProgress ? 'outline-dark' : 'primary', 'mt-5 w-full')}>
                    Commencer le diagnostic
                  </button>
                </form>

                {store.assessments.length > 0 && (
                  <Link
                    to={diagnosticPaths.history}
                    className="inline-flex min-h-11 items-center rounded font-semibold text-emerald-700 hover:text-forest-900"
                  >
                    Revoir mes diagnostics ({store.assessments.length})
                  </Link>
                )}
              </div>
            </div>

            <BuildingIllustration slug="ecole" className="building-art mx-auto hidden h-96 w-auto max-w-full lg:col-span-6 lg:block" />
          </div>
        </div>
      </section>

      <section aria-labelledby="obtenir-title" className="bg-ivory-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading id="obtenir-title" title="Ce que vous allez découvrir" />
          <ul className="mt-8 grid gap-8 sm:grid-cols-3">
            {outcomes.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon aria-hidden="true" className="size-7 text-emerald-600" strokeWidth={1.75} />
                <h3 className="mt-3 text-xl font-medium text-forest-900">{title}</h3>
                <p className="mt-1 leading-relaxed text-ink-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="dimensions-title" className="bg-ivory-100 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="dimensions-title" title="Cinq sujets, quatre questions chacun" />
            <ul className="mt-8 space-y-5">
              {dimensions.map((dimension) => {
                const Icon = dimensionIcons[dimension.id]
                return (
                  <li key={dimension.id} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-200 text-emerald-700">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-lg leading-tight font-medium text-forest-900">{dimension.name}</h3>
                      <p className="mt-0.5 text-ink-muted">{dimensionIntros[dimension.id]}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium text-forest-900">Bon à savoir</h2>
            <div className="mt-4 border-t border-forest-900/12">
              <Disclosure title="Et si je ne connais pas la réponse ?">
                <p className="leading-relaxed text-ink-muted">
                  Choisissez «&nbsp;Je ne sais pas&nbsp;»&nbsp;: cela ne compte jamais comme un zéro, et le rapport vous
                  indiquera où trouver l’information. Si une question ne concerne pas votre établissement, choisissez
                  «&nbsp;Non applicable&nbsp;»&nbsp;: elle est retirée du calcul.
                </p>
              </Disclosure>
              <Disclosure title="Mes réponses sont-elles envoyées quelque part ?">
                <p className="leading-relaxed text-ink-muted">
                  Non. Elles restent dans ce navigateur, sur cet appareil. Aucune donnée personnelle n’est demandée, et le
                  nom de l’établissement sert seulement à reconnaître votre rapport. Votre progression est enregistrée
                  automatiquement&nbsp;: vous pouvez vous arrêter et reprendre plus tard.
                </p>
              </Disclosure>
              <Disclosure title="Que vaut ce résultat ?">
                <p className="leading-relaxed text-ink-muted">
                  C’est une auto-évaluation indicative&nbsp;: elle reflète vos réponses, et sert de point de départ. Ce
                  n’est ni un jugement, ni une certification, ni un audit officiel.
                </p>
              </Disclosure>
              <Disclosure title="Comment le score est-il calculé ?">
                <MethodologyContent />
              </Disclosure>
              <Disclosure title="Qu’est-ce que l’indépendance numérique ?">
                <p className="leading-relaxed text-ink-muted">
                  Un établissement indépendant choisit ses outils au lieu de les subir. Il sait où sont ses données, fait
                  durer son matériel, rend ses services accessibles à toutes et à tous, et décide collectivement.
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </section>

      <NeighbourNav building={ecole} />
    </>
  )
}
