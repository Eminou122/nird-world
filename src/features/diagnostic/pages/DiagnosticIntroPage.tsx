import {
  Archive,
  ArrowRight,
  CircleQuestionMark,
  ClipboardCheck,
  Clock,
  GraduationCap,
  HardDrive,
  Info,
  ListOrdered,
  Play,
  Route,
  ShieldCheck,
} from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Breadcrumbs } from '../../../components/navigation/Breadcrumbs'
import { ButtonLink, buttonClass } from '../../../components/ui/ButtonLink'
import { Reveal } from '../../../components/ui/Reveal'
import { SectionHeading } from '../../../components/ui/SectionHeading'
import { buildings } from '../../../data/buildings'
import { NeighbourLink } from '../../buildings/BuildingPage'
import { BuildingIllustration } from '../../village/BuildingIllustration'
import { dimensions, institutionTypes, questions, questionsOf } from '../data/questions'
import { diagnosticActions, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import { MAX_NAME_LENGTH } from '../services/storage'
import type { InstitutionType } from '../types/diagnostic'
import { StorageNotice, dimensionIcons, institutionLabel, plural } from '../components/ui'
import { diagnosticPaths } from '../paths'

const outcomes = [
  'Un score global d’indépendance numérique et un niveau de maturité',
  'Un score détaillé pour chacune des cinq dimensions',
  'Vos points forts, vos points faibles et vos zones d’incertitude',
  'Des recommandations concrètes, classées par priorité',
  'Une feuille de route : actions immédiates, à moyen et à long terme',
]

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Décrivez vos pratiques',
    text: 'Pour chaque question, choisissez la description qui correspond le mieux à ce qui se fait réellement dans l’établissement.',
  },
  {
    icon: ListOrdered,
    title: 'Avancez à votre rythme',
    text: 'Revenez sur une réponse à tout moment. Votre progression est enregistrée automatiquement sur cet appareil.',
  },
  {
    icon: Route,
    title: 'Recevez votre rapport',
    text: 'Scores, analyse et plan d’action sont calculés à partir de vos réponses, et uniquement d’elles.',
  },
]

export function DiagnosticIntroPage() {
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState<InstitutionType | ''>('')
  const nameId = useId()
  const typeId = useId()

  const inProgress = store.assessments.find((a) => a.id === store.activeId && a.completedAt === null)
  const ecole = buildings[0]!
  const next = buildings[1]!
  const previous = buildings[buildings.length - 1]!

  function handleStart(event: FormEvent) {
    event.preventDefault()
    diagnosticActions.start(name, type || null)
    navigate(diagnosticPaths.questionnaire)
  }

  function handleResume(id: string) {
    diagnosticActions.open(id)
    navigate(diagnosticPaths.questionnaire)
  }

  return (
    <>
      <title>Diagnostic d’indépendance numérique — École — NIRD WORLD</title>

      <section aria-labelledby="diagnostic-title" className="bg-ivory-100">
        <div className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 sm:pb-24">
          <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Le village', to: '/village' }, { label: 'École' }]} />

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7 lg:pt-4">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                <span className="grid size-8 place-items-center rounded-full bg-forest-900 text-gold-300">
                  <GraduationCap aria-hidden="true" className="size-4" />
                </span>
                Lieu {ecole.number} · École
              </p>
              <h1
                id="diagnostic-title"
                className="mt-5 text-5xl leading-[1.02] font-medium text-forest-900 sm:text-6xl lg:text-[4.25rem]"
              >
                Diagnostic d’indépendance numérique
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                Évaluez où en est votre établissement : logiciels, données, matériel, accessibilité et gouvernance.
                Vingt questions fondées sur des pratiques observables, pour un état des lieux honnête et un plan
                d’action concret.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2 text-sm text-forest-900">
                {[
                  { icon: ClipboardCheck, label: `${questions.length} questions` },
                  { icon: ListOrdered, label: `${dimensions.length} dimensions` },
                  { icon: Clock, label: 'Environ 15 minutes' },
                  { icon: HardDrive, label: 'Enregistré sur cet appareil' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2 rounded-full bg-ivory-50 px-3.5 py-2 ring-1 ring-ivory-300/80">
                    <Icon aria-hidden="true" className="size-4 text-emerald-700" />
                    {label}
                  </li>
                ))}
              </ul>

              {store.assessments.length > 0 && (
                <p className="mt-6">
                  <Link
                    to={diagnosticPaths.history}
                    className="inline-flex items-center gap-2 rounded text-sm font-semibold text-emerald-700 hover:text-forest-900"
                  >
                    <Archive aria-hidden="true" className="size-4" />
                    Historique des diagnostics ({store.assessments.length})
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-4 lg:col-span-5">
              <StorageNotice />

              {inProgress && (
                <div className="rounded-2xl bg-ivory-50 p-5 ring-1 ring-emerald-600/30">
                  <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">Diagnostic en cours</p>
                  <p className="mt-2 font-display text-xl text-forest-900">{institutionLabel(inProgress)}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {plural(Object.keys(inProgress.answers).length, 'réponse', 'réponses')} sur {questions.length}
                  </p>
                  <button type="button" onClick={() => handleResume(inProgress.id)} className={buttonClass('dark', 'mt-4 w-full')}>
                    Reprendre le diagnostic <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              )}

              <form
                onSubmit={handleStart}
                aria-labelledby="start-title"
                className="overflow-hidden rounded-3xl bg-forest-900 text-ivory-50 shadow-lift"
              >
                <div className="relative flex h-40 items-center justify-center bg-forest-950/40 px-10 pt-6">
                  <BuildingIllustration slug="ecole" className="h-full w-auto" />
                </div>
                <div className="space-y-5 p-6 sm:p-8">
                  <div>
                    <h2 id="start-title" className="text-2xl font-medium">
                      {inProgress ? 'Commencer un nouveau diagnostic' : 'Votre établissement'}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ivory-100/70">
                      Ces informations servent uniquement à identifier le rapport. Elles n’influencent pas le score.
                    </p>
                  </div>

                  <div>
                    <label htmlFor={nameId} className="text-sm font-semibold">
                      Nom de l’établissement <span className="font-normal text-ivory-100/60">(facultatif)</span>
                    </label>
                    <input
                      id={nameId}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={MAX_NAME_LENGTH}
                      autoComplete="organization"
                      placeholder="Ex. Collège Jean Moulin"
                      className="mt-2 block min-h-11 w-full rounded-xl bg-ivory-50 px-4 text-ink placeholder:text-ink-muted/60 focus-visible:outline-gold-400"
                    />
                  </div>

                  <div>
                    <label htmlFor={typeId} className="text-sm font-semibold">
                      Type d’établissement <span className="font-normal text-ivory-100/60">(facultatif)</span>
                    </label>
                    <select
                      id={typeId}
                      value={type}
                      onChange={(event) => setType(event.target.value as InstitutionType | '')}
                      className="mt-2 block min-h-11 w-full rounded-xl bg-ivory-50 px-3.5 text-ink"
                    >
                      <option value="">Non précisé</option>
                      {Object.entries(institutionTypes).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className={buttonClass('primary', 'w-full text-base')}>
                    <Play aria-hidden="true" /> Commencer le diagnostic
                  </button>
                  <p className="flex gap-2 text-xs leading-relaxed text-ivory-100/60">
                    <ShieldCheck aria-hidden="true" className="mt-px size-4 shrink-0 text-gold-400" />
                    Aucune donnée personnelle n’est demandée. Vos réponses restent dans ce navigateur et ne sont envoyées
                    nulle part.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="independance-title" className="border-t border-ivory-300/60 bg-ivory-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <SectionHeading id="independance-title" eyebrow="Pourquoi ce diagnostic" title="L’indépendance numérique, concrètement.">
              <p>
                Un établissement numériquement indépendant choisit ses outils au lieu de les subir. Il sait où sont ses
                données, fait durer son matériel, rend ses services accessibles à toutes et à tous, et décide
                collectivement de ses orientations.
              </p>
              <p className="mt-4">
                Le diagnostic donne une image honnête de la situation actuelle : un point de départ, pas un jugement.
              </p>
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-2xl bg-ivory-100 p-7 ring-1 ring-ivory-300/80">
              <h3 className="text-xl font-medium text-forest-900">Ce que vous obtiendrez</h3>
              <ul className="mt-5 space-y-3.5">
                {outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-400" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="dimensions-title" className="bg-forest-900 py-20 text-ivory-50 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading id="dimensions-title" onDark eyebrow="Ce qui est évalué" title="Cinq dimensions, à poids égal.">
            <p>Chaque dimension compte quatre questions et pèse pour 20 % du score global.</p>
          </SectionHeading>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dimensions.map((dimension, index) => {
              const Icon = dimensionIcons[dimension.id]
              return (
                <li key={dimension.id}>
                  <Reveal delay={index * 0.06} className="flex h-full flex-col rounded-2xl bg-ivory-50/[0.04] p-6 ring-1 ring-ivory-50/10">
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-xl bg-gold-400/15 text-gold-300">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span aria-hidden="true" className="font-display text-3xl text-ivory-50/20">
                        {dimension.letter}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg leading-snug font-medium">{dimension.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory-100/65">{dimension.description}</p>
                    <p className="mt-4 text-xs font-semibold text-gold-300">
                      {questionsOf(dimension.id).length} questions · 20 %
                    </p>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="deroulement-title" className="bg-ivory-100 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading id="deroulement-title" eyebrow="Déroulement" title="Comment ça se passe" />
            <ol className="mt-10 space-y-6">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-forest-900 text-gold-300">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-medium text-forest-900">
                      <span className="text-ink-muted tabular-nums">{index + 1}. </span>
                      {title}
                    </h3>
                    <p className="mt-1.5 max-w-lg leading-relaxed text-ink-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside aria-labelledby="bon-a-savoir" className="lg:col-span-5">
            <div className="rounded-2xl bg-ivory-50 p-7 ring-1 ring-ivory-300/80">
              <h3 id="bon-a-savoir" className="flex items-center gap-2.5 text-xl font-medium text-forest-900">
                <Info aria-hidden="true" className="size-5 text-emerald-700" />
                Bon à savoir
              </h3>
              <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold text-forest-900">Cinq niveaux de maturité</dt>
                  <dd className="mt-1 text-ink-muted">
                    De 0 (absent) à 4 (avancé), chaque niveau décrit une pratique que l’on peut constater dans
                    l’établissement.
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 font-semibold text-forest-900">
                    <CircleQuestionMark aria-hidden="true" className="size-4 text-emerald-700" />
                    « Je ne sais pas » et « Non applicable »
                  </dt>
                  <dd className="mt-1 text-ink-muted">
                    Ces réponses ne comptent jamais comme un zéro. Elles sont retirées du calcul ; « Je ne sais pas »
                    génère une piste de vérification.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-forest-900">Une auto-évaluation indicative</dt>
                  <dd className="mt-1 text-ink-muted">
                    Le résultat reflète vos réponses. Il ne constitue ni une certification ni un audit officiel.
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-6">
              <ButtonLink to="/village" variant="outline-dark">
                Retour au village
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      <nav aria-label="Autres lieux du village" className="border-t border-ivory-300/60 bg-ivory-100 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8">
          <NeighbourLink building={previous} direction="previous" />
          <NeighbourLink building={next} direction="next" />
        </div>
      </nav>
    </>
  )
}
