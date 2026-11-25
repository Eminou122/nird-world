import { ArrowRight, ChevronDown, CircleQuestionMark } from 'lucide-react'
import type { ReactNode } from 'react'
import { Disclosure } from '../../../components/ui/Disclosure'
import { bandLines } from '../data/guidance'
import { getDimension, getQuestion, maturityLabels } from '../data/questions'
import type { Analysis, PracticeFinding } from '../engine/analysis'
import { bandFor, bands, MIN_SCORED_PER_DIMENSION } from '../engine/scoring'
import type { Band, Coverage, DimensionResult, Horizon, Recommendation } from '../types/diagnostic'
import { bandColors, dimensionIcons, plural, priorityStyles } from './ui'

/* ---------- First impression ---------- */

export function ScoreSummary({ score, band, children }: { score: number; band: Band; children?: ReactNode }) {
  return (
    <section
      aria-labelledby="score-title"
      className="on-dark grid items-center gap-x-12 gap-y-6 rounded-3xl bg-forest-900 p-7 text-ivory-50 break-inside-avoid sm:p-10 md:grid-cols-[auto_1fr]"
    >
      <h2 id="score-title" className="sr-only">
        Votre score d’indépendance numérique
      </h2>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-8xl leading-none tabular-nums sm:text-9xl" data-score>
          {score}
        </span>
        <span className="text-xl text-ivory-100/70">sur 100</span>
      </p>
      <div>
        <p className="font-display text-3xl">{band.label}</p>
        <p className="mt-2 text-lg leading-relaxed text-ivory-100/85">{bandLines[band.id]}</p>
        <BandScale score={score} />
        {children}
      </div>
    </section>
  )
}

function BandScale({ score }: { score: number }) {
  return (
    <div aria-hidden="true" className="relative mt-6">
      <div className="flex h-2.5 overflow-hidden rounded-full">
        {bands.map((band) => (
          <span key={band.id} style={{ width: `${band.max - band.min + 1}%`, background: bandColors[band.id] }} />
        ))}
      </div>
      <span
        className="absolute -top-1.5 size-5.5 -translate-x-1/2 rounded-full border-4 border-forest-900 bg-ivory-50"
        style={{ left: `${Math.min(Math.max(score, 1), 99)}%` }}
      />
    </div>
  )
}

/* ---------- What is going well / what needs attention ---------- */

const VISIBLE_PRACTICES = 3

export function GoingWell({ analysis }: { analysis: Analysis }) {
  return (
    <section aria-labelledby="forces-title" className="break-inside-avoid">
      <h2 id="forces-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
        Ce qui va bien
      </h2>
      <DimensionLines results={analysis.strongest} />
      <PracticeList findings={analysis.strengths} />
      {analysis.strongest.length === 0 && (
        <p className="mt-4 leading-relaxed text-ink-muted">
          {analysis.balanced
            ? 'Votre profil est homogène : aucun sujet ne se détache nettement.'
            : analysis.strengths.length === 0
              ? 'Aucune pratique n’est encore bien établie. C’est un point de départ, pas un reproche.'
              : 'Aucun sujet n’atteint encore 50 sur 100, mais ces pratiques sont déjà bien en place.'}
        </p>
      )}
    </section>
  )
}

export function NeedsAttention({ analysis }: { analysis: Analysis }) {
  const { weakest, weaknesses, informationGaps, balanced } = analysis
  return (
    <section aria-labelledby="faiblesses-title" className="break-inside-avoid">
      <h2 id="faiblesses-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
        Ce qui mérite votre attention
      </h2>
      <DimensionLines results={weakest} />
      <PracticeList findings={weaknesses} />
      {weakest.length === 0 && weaknesses.length === 0 && (
        <p className="mt-4 leading-relaxed text-ink-muted">
          {balanced ? 'Aucun sujet n’est nettement en retrait.' : 'Aucune pratique n’est absente ou seulement à ses débuts.'}
        </p>
      )}
      {informationGaps.length > 0 && (
        <div className="mt-5">
          <h3 className="flex items-center gap-2 font-sans text-base font-semibold tracking-normal text-gold-700">
            <CircleQuestionMark aria-hidden="true" className="size-4" /> À vérifier
          </h3>
          <ul className="mt-1.5 space-y-1 text-ink-muted">
            {informationGaps.slice(0, VISIBLE_PRACTICES).map((question) => (
              <li key={question.id}>{question.title}</li>
            ))}
          </ul>
          {informationGaps.length > VISIBLE_PRACTICES && (
            <Disclosure variant="inline" title={`Voir ${plural(informationGaps.length - VISIBLE_PRACTICES, 'autre', 'autres')}`}>
              <ul className="space-y-1 text-ink-muted">
                {informationGaps.slice(VISIBLE_PRACTICES).map((question) => (
                  <li key={question.id}>{question.title}</li>
                ))}
              </ul>
            </Disclosure>
          )}
        </div>
      )}
    </section>
  )
}

function DimensionLines({ results }: { results: DimensionResult[] }) {
  if (results.length === 0) return null
  return (
    <ul className="mt-4 space-y-3">
      {results.map((result) => {
        const Icon = dimensionIcons[result.dimension]
        return (
          <li key={result.dimension} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage-200 text-emerald-700">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="flex-1 text-lg font-semibold text-forest-900">{getDimension(result.dimension).name}</span>
            <span className="text-ink-muted">
              <span className="font-display text-2xl text-forest-900 tabular-nums">{result.score}</span>
              <span className="text-sm"> sur 100</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function PracticeList({ findings }: { findings: PracticeFinding[] }) {
  if (findings.length === 0) return null
  const rest = findings.slice(VISIBLE_PRACTICES)
  const list = (items: PracticeFinding[]) => (
    <ul className="space-y-1.5 text-ink-muted">
      {items.map(({ question, level }) => (
        <li key={question.id} className="flex justify-between gap-4">
          <span>{question.title}</span>
          <span className="shrink-0 text-sm">{maturityLabels[level].toLowerCase()}</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="mt-4 border-t border-forest-900/12 pt-4">
      {list(findings.slice(0, VISIBLE_PRACTICES))}
      {rest.length > 0 && (
        <Disclosure variant="inline" title={`Voir ${plural(rest.length, 'autre', 'autres')}`}>
          {list(rest)}
        </Disclosure>
      )}
    </div>
  )
}

/* ---------- Your next step ---------- */

export function NextStep({ recommendation }: { recommendation: Recommendation | undefined }) {
  if (!recommendation) {
    return (
      <section aria-labelledby="prochain-pas-title" className="rounded-3xl bg-gold-300/45 p-7 sm:p-10">
        <h2 id="prochain-pas-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
          Rien d’urgent
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-forest-900">
          Toutes les pratiques évaluées sont établies ou avancées. Gardez le cap, écrivez ce qui fonctionne, et refaites ce
          diagnostic l’an prochain.
        </p>
      </section>
    )
  }
  const { title, description, steps, benefit, priority, dimension } = recommendation
  return (
    <section aria-labelledby="prochain-pas-title" className="rounded-3xl bg-gold-300/45 p-7 break-inside-avoid sm:p-10">
      <h2 id="prochain-pas-title" className="font-sans text-base font-semibold tracking-normal text-gold-700">
        Votre prochain pas
      </h2>
      <p className="mt-2 max-w-3xl font-display text-3xl leading-tight text-forest-900 sm:text-4xl">{title}</p>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-forest-900/85">{description}</p>

      <div className="mt-6 rounded-2xl bg-ivory-50 p-5 sm:p-6">
        <p className="font-semibold text-forest-900">Pour commencer</p>
        <p className="mt-1 text-lg leading-relaxed text-forest-900">{steps[0]}</p>
        {steps.length > 1 && (
          <Disclosure variant="inline" title="Et ensuite&nbsp;?">
            <StepList steps={steps.slice(1)} start={2} />
          </Disclosure>
        )}
      </div>

      <p className="mt-5 leading-relaxed text-forest-900/85">
        <span className="font-semibold text-forest-900">Ce que vous y gagnez&nbsp;:</span> {benefit}
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        {priorityStyles[priority].label}, {getDimension(dimension).name.toLowerCase()}
      </p>
    </section>
  )
}

function StepList({ steps, start = 1 }: { steps: readonly string[]; start?: number }) {
  return (
    <ol start={start} className="list-decimal space-y-1.5 pl-5 leading-relaxed text-ink-muted marker:font-semibold marker:text-forest-900">
      {steps.map((step) => (
        <li key={step} className="pl-1">
          {step}
        </li>
      ))}
    </ol>
  )
}

/* ---------- Deeper analysis ---------- */

export function DimensionScores({
  dimensions,
  onComplete,
}: {
  dimensions: DimensionResult[]
  onComplete?: (dimension: DimensionResult) => void
}) {
  return (
    <>
      <ul className="space-y-6">
        {dimensions.map((result) => (
          <DimensionRow key={result.dimension} result={result} onComplete={onComplete} />
        ))}
      </ul>
      <p className="mt-5 text-sm text-ink-muted">Chaque dimension pèse 20&nbsp;% du score global.</p>
    </>
  )
}

function DimensionRow({ result, onComplete }: { result: DimensionResult; onComplete?: (dimension: DimensionResult) => void }) {
  const dimension = getDimension(result.dimension)
  const Icon = dimensionIcons[result.dimension]
  const band = bandFor(result.score)
  const missing = MIN_SCORED_PER_DIMENSION - result.scored
  const details = [
    plural(result.scored, 'réponse notée', 'réponses notées'),
    result.na > 0 && plural(result.na, 'non applicable', 'non applicables'),
    result.unknown > 0 && `${result.unknown} « Je ne sais pas »`,
    result.unanswered > 0 && `${result.unanswered} sans réponse`,
  ].filter(Boolean)

  return (
    <li className="flex items-start gap-4 break-inside-avoid">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage-200 text-emerald-700">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="font-sans text-lg font-semibold tracking-normal text-forest-900">{dimension.name}</h3>
          {result.score !== null && band ? (
            <p className="text-ink-muted">
              <span className="font-display text-2xl text-forest-900 tabular-nums" data-dimension-score>
                {result.score}
              </span>
              <span className="sr-only"> sur 100</span>, {band.label.toLowerCase()}
            </p>
          ) : (
            <p className="font-semibold text-gold-700">Données insuffisantes</p>
          )}
        </div>
        <div aria-hidden="true" className="mt-2 h-2.5 overflow-hidden rounded-full bg-sage-200">
          {result.score !== null && band && (
            <div className="h-full rounded-full" style={{ width: `${Math.max(result.score, 1)}%`, background: bandColors[band.id] }} />
          )}
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">{details.join(', ')}</p>
        {!result.valid && (
          <div className="mt-1 flex flex-wrap items-center gap-x-4">
            <p className="text-sm text-ink-muted">
              Il manque {plural(missing, 'réponse notée', 'réponses notées')} pour calculer ce score.
            </p>
            {onComplete && (
              <button
                type="button"
                onClick={() => onComplete(result)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-emerald-700 hover:text-forest-900 print:hidden"
              >
                Compléter <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

/** One recommendation: the title and first step are always visible, the reasoning and other steps open on demand. */
export function RecommendationItem({ recommendation }: { recommendation: Recommendation }) {
  const { title, description, observation, steps, benefit, level, kind, dimension, priority } = recommendation
  const question = getQuestion(recommendation.questionId)
  const isGap = kind === 'investigation'
  return (
    <li className="border-b border-forest-900/12 break-inside-avoid last:border-b-0">
      <details className="disclosure">
        <summary className="flex gap-4 rounded-md py-5 hover:text-emerald-700">
          <span className="flex-1">
            <span className="block font-display text-xl leading-snug text-forest-900">{title}</span>
            <span className="mt-1 block leading-relaxed text-ink-muted">
              <span className="font-semibold text-forest-900">À faire en premier&nbsp;:</span> {steps[0]}
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span className={`rounded-full px-2.5 py-0.5 font-semibold ring-1 ${priorityStyles[priority].className}`}>
                {priorityStyles[priority].label}
              </span>
              {getDimension(dimension).name}
              {isGap && <span className="font-semibold text-gold-700">Information à vérifier</span>}
            </span>
          </span>
          <ChevronDown aria-hidden="true" className="disclosure__chevron mt-1 size-5 shrink-0 text-forest-900" />
        </summary>
        <dl className="space-y-4 pb-7 leading-relaxed text-ink-muted">
          <div>
            <dt className="font-semibold text-forest-900">{isGap ? 'Ce que l’on ne sait pas encore' : 'Aujourd’hui'}</dt>
            <dd>
              {question?.title}
              {!isGap && level !== null && ` (niveau ${level}, ${maturityLabels[level].toLowerCase()})`}
              &nbsp;: {observation}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-forest-900">Pourquoi c’est important</dt>
            <dd>{description}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest-900">Les étapes</dt>
            <dd className="mt-1">
              <StepList steps={steps} />
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-forest-900">Ce que vous y gagnez</dt>
            <dd>{benefit}</dd>
          </div>
        </dl>
      </details>
    </li>
  )
}

export const horizons: { id: Horizon; label: string; period: string }[] = [
  { id: 'immediat', label: 'Tout de suite', period: '0 à 3 mois' },
  { id: 'moyen-terme', label: 'À moyen terme', period: '3 à 12 mois' },
  { id: 'long-terme', label: 'À long terme', period: 'au-delà de 12 mois' },
]

export function Roadmap({ roadmap }: { roadmap: Record<Horizon, Recommendation[]> }) {
  return (
    <ol className="grid gap-x-8 gap-y-8 lg:grid-cols-3">
      {horizons.map((horizon) => (
        <li key={horizon.id} className="border-t-4 border-emerald-600 pt-4 break-inside-avoid">
          <h3 className="text-xl font-medium text-forest-900">{horizon.label}</h3>
          <p className="text-sm text-ink-muted">{horizon.period}</p>
          {roadmap[horizon.id].length === 0 ? (
            <p className="mt-4 text-ink-muted">Rien de prévu pour cette période.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {roadmap[horizon.id].map((item) => (
                <li key={item.id} className="leading-snug">
                  <p className="font-medium text-forest-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {getDimension(item.dimension).name}, {priorityStyles[item.priority].label.toLowerCase()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}

export function CoverageDetails({ coverage }: { coverage: Coverage }) {
  const stats = [
    { label: 'Réponses notées', value: coverage.scored, hint: 'niveaux 0 à 4' },
    { label: 'Sans réponse', value: coverage.unanswered, hint: 'questions passées' },
    { label: 'Non applicables', value: coverage.na, hint: 'retirées du calcul' },
    { label: '« Je ne sais pas »', value: coverage.unknown, hint: 'à vérifier' },
  ]
  return (
    <>
      <p className="leading-relaxed text-ink-muted" data-coverage>
        {coverage.percent}&nbsp;% des questions applicables ont reçu une réponse notée ({coverage.scored} sur{' '}
        {coverage.total - coverage.na}).
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-sm text-ink-muted">{stat.label}</dt>
            <dd className="font-display text-3xl text-forest-900 tabular-nums">{stat.value}</dd>
            <dd className="text-sm text-ink-muted">{stat.hint}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

export function MethodologyContent({ band }: { band?: Band }) {
  return (
    <div className="space-y-3 leading-relaxed text-ink-muted">
      {band && (
        <p>
          <span className="font-semibold text-forest-900">
            {band.label} ({band.min} à {band.max})&nbsp;:
          </span>{' '}
          {band.description}
        </p>
      )}
      <p>Chaque réponse vaut de 0 (absent) à 4 (avancé).</p>
      <p>
        Score d’une dimension = somme des réponses notées ÷ (4 × nombre de réponses notées) × 100. «&nbsp;Non
        applicable&nbsp;» et «&nbsp;Je ne sais pas&nbsp;» sont exclus du calcul, jamais comptés comme zéro.
      </p>
      <p>Une dimension n’est notée qu’avec au moins {MIN_SCORED_PER_DIMENSION} réponses notées sur 4.</p>
      <p>
        Score global = moyenne des cinq dimensions (20&nbsp;% chacune), calculée seulement si les cinq sont notées. Les
        scores sont arrondis à l’entier le plus proche&nbsp;; la moyenne utilise les valeurs non arrondies.
      </p>
      <p>Niveaux&nbsp;: {bands.map((b) => `${b.min} à ${b.max}, ${b.label.toLowerCase()}`).join(' ; ')}.</p>
    </div>
  )
}
