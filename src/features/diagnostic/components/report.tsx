import { ArrowRight, CircleCheck, CircleDashed, CircleQuestionMark, Lightbulb, Target, TrendingDown, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { getDimension, getQuestion, maturityLabels } from '../data/questions'
import type { Analysis } from '../engine/analysis'
import { bandFor, bands, MIN_SCORED_PER_DIMENSION } from '../engine/scoring'
import type { Coverage, DiagnosticResult, DimensionResult, Horizon, Recommendation } from '../types/diagnostic'
import { bandColors, dimensionIcons, plural, priorityStyles } from './ui'

/** Card shell used by every block of the report. */
export function Panel({ title, id, children, className = '' }: { title: string; id: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={`rounded-2xl bg-ivory-50 p-6 ring-1 ring-ivory-300/80 break-inside-avoid sm:p-7 ${className}`}>
      <h2 id={id} className="text-xl font-medium text-forest-900">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

/* ---------- A. Overall score ---------- */

export function ScoreSummary({ result }: { result: DiagnosticResult & { overall: number } }) {
  const band = result.band ?? bands[0]!
  return (
    <section aria-labelledby="score-title" className="rounded-3xl bg-forest-900 p-7 text-ivory-50 shadow-lift break-inside-avoid sm:p-9">
      <h2 id="score-title" className="text-sm font-semibold tracking-[0.14em] text-gold-300 uppercase">
        Score d’indépendance numérique
      </h2>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-8xl leading-none tabular-nums sm:text-9xl">{result.overall}</span>
        <span className="text-2xl text-ivory-100/60">/ 100</span>
      </p>
      <p className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-ivory-50/10 py-1.5 pr-4 pl-2 text-lg font-semibold">
        <span aria-hidden="true" className="size-4 rounded-full" style={{ background: bandColors[band.id] }} />
        Niveau : {band.label}
      </p>
      <p className="mt-4 leading-relaxed text-ivory-100/80">{band.description}</p>
      <BandScale score={result.overall} />
    </section>
  )
}

function BandScale({ score }: { score: number }) {
  return (
    <div aria-hidden="true" className="mt-8">
      <div className="relative">
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
      <div className="mt-2.5 hidden text-[0.7rem] text-ivory-100/55 sm:flex">
        {bands.map((band) => (
          <span key={band.id} style={{ width: `${band.max - band.min + 1}%` }}>
            {band.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- B. Dimension breakdown ---------- */

export function DimensionBreakdown({
  dimensions,
  onComplete,
}: {
  dimensions: DimensionResult[]
  onComplete?: (dimension: DimensionResult) => void
}) {
  return (
    <Panel id="dimensions-title" title="Scores par dimension">
      <ul className="divide-y divide-ivory-300/60">
        {dimensions.map((result) => (
          <DimensionRow key={result.dimension} result={result} onComplete={onComplete} />
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-muted">Chaque dimension pèse 20 % du score global.</p>
    </Panel>
  )
}

function DimensionRow({ result, onComplete }: { result: DimensionResult; onComplete?: (dimension: DimensionResult) => void }) {
  const dimension = getDimension(result.dimension)
  const Icon = dimensionIcons[result.dimension]
  const band = bandFor(result.score)
  const details = [
    plural(result.scored, 'réponse notée', 'réponses notées'),
    result.na > 0 && plural(result.na, 'non applicable', 'non applicables'),
    result.unknown > 0 && `${result.unknown} « Je ne sais pas »`,
    result.unanswered > 0 && plural(result.unanswered, 'sans réponse', 'sans réponse'),
  ].filter(Boolean)

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-900 text-gold-300">
          <Icon aria-hidden="true" className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-sans text-base font-semibold tracking-normal text-forest-900">
              <span className="text-ink-muted">{dimension.letter}.</span> {dimension.name}
            </h3>
            {result.score !== null && band ? (
              <p className="text-sm text-ink-muted">
                <span className="font-display text-2xl text-forest-900 tabular-nums">{result.score}</span>
                <span className="sr-only"> sur 100</span> · {band.label}
              </p>
            ) : (
              <p className="text-sm font-semibold text-[#8a3622]">Données insuffisantes</p>
            )}
          </div>
          <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-ivory-200">
            {result.score !== null && band && (
              <div className="h-full rounded-full" style={{ width: `${Math.max(result.score, 1)}%`, background: bandColors[band.id] }} />
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-muted">{details.join(' · ')}</p>
          {!result.valid && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-xs text-ink-muted">
                Au moins {MIN_SCORED_PER_DIMENSION} réponses notées (niveaux 0 à 4) sont nécessaires pour calculer ce score.
              </p>
              {onComplete && (
                <button
                  type="button"
                  onClick={() => onComplete(result)}
                  className="inline-flex items-center gap-1 rounded text-sm font-semibold text-emerald-700 hover:text-forest-900 print:hidden"
                >
                  Compléter <ArrowRight aria-hidden="true" className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

/* ---------- C. Coverage ---------- */

export function CoveragePanel({ coverage, wide = false }: { coverage: Coverage; wide?: boolean }) {
  const stats = [
    { label: 'Réponses notées', value: coverage.scored, hint: 'niveaux 0 à 4' },
    { label: 'Sans réponse', value: coverage.unanswered, hint: 'questions passées' },
    { label: 'Non applicables', value: coverage.na, hint: 'retirées du calcul' },
    { label: '« Je ne sais pas »', value: coverage.unknown, hint: 'à vérifier' },
  ]
  return (
    <Panel id="coverage-title" title="Couverture de l’évaluation">
      <p className="text-sm leading-relaxed text-ink-muted">
        <span className="font-display text-3xl text-forest-900 tabular-nums">{coverage.percent} %</span> des questions
        applicables ont reçu une réponse notée ({coverage.scored} sur {coverage.total - coverage.na}).
      </p>
      <dl className={`mt-5 grid grid-cols-2 gap-3 ${wide ? 'md:grid-cols-4' : ''}`}>
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-ivory-100 p-3.5">
            <dt className="text-xs font-semibold text-ink-muted">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl text-forest-900 tabular-nums">{stat.value}</dd>
            <dd className="text-xs text-ink-muted">{stat.hint}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

/* ---------- D. Analysis ---------- */

export function AnalysisPanels({ analysis }: { analysis: Analysis }) {
  const dimensionLine = (result: DimensionResult) =>
    `${getDimension(result.dimension).name} — ${result.score}/100`
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel id="forces-title" title="Points forts">
        <AnalysisList
          icon={<TrendingUp aria-hidden="true" className="size-4 text-emerald-700" />}
          lead={analysis.strongest.map(dimensionLine)}
          items={analysis.strengths.map((f) => `${f.question.title} (${maturityLabels[f.level].toLowerCase()})`)}
          empty={
            analysis.balanced
              ? 'Profil homogène : aucune dimension ne se détache nettement.'
              : 'Aucune pratique n’atteint encore le niveau « établi ».'
          }
        />
      </Panel>
      <Panel id="faiblesses-title" title="Points faibles">
        <AnalysisList
          icon={<TrendingDown aria-hidden="true" className="size-4 text-[#8a3622]" />}
          lead={analysis.weakest.map(dimensionLine)}
          items={analysis.weaknesses.map((f) => `${f.question.title} (${maturityLabels[f.level].toLowerCase()})`)}
          empty={
            analysis.balanced
              ? 'Profil homogène : aucune dimension n’est nettement en retrait.'
              : 'Aucune pratique n’est absente ou seulement initiale.'
          }
        />
      </Panel>
      <Panel id="incertitudes-title" title="Zones d’incertitude">
        <AnalysisList
          icon={<CircleQuestionMark aria-hidden="true" className="size-4 text-gold-700" />}
          lead={[]}
          items={analysis.informationGaps.map((q) => q.title)}
          empty="Aucune réponse « Je ne sais pas » : la situation est connue sur toutes les pratiques notées."
        />
      </Panel>
    </div>
  )
}

function AnalysisList({ icon, lead, items, empty }: { icon: ReactNode; lead: string[]; items: string[]; empty: string }) {
  if (lead.length === 0 && items.length === 0) return <p className="text-sm leading-relaxed text-ink-muted">{empty}</p>
  return (
    <div className="space-y-4">
      {lead.length > 0 && (
        <ul className="space-y-1.5">
          {lead.map((line) => (
            <li key={line} className="font-semibold text-forest-900">
              {line}
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-0.5">{icon}</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- E. Recommendations ---------- */

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const dimension = getDimension(recommendation.dimension)
  const Icon = dimensionIcons[recommendation.dimension]
  const priority = priorityStyles[recommendation.priority]
  const question = getQuestion(recommendation.questionId)
  const isGap = recommendation.kind === 'investigation'

  return (
    <article className="flex h-full flex-col rounded-2xl bg-ivory-50 p-6 ring-1 ring-ivory-300/80 break-inside-avoid sm:p-7">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`rounded-full px-2.5 py-1 ring-1 ${priority.className}`}>{priority.label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory-200 px-2.5 py-1 text-forest-900">
          <Icon aria-hidden="true" className="size-3.5" /> {dimension.name}
        </span>
        {isGap && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-2.5 py-1 text-gold-700">
            <CircleQuestionMark aria-hidden="true" className="size-3.5" /> Information à vérifier
          </span>
        )}
      </div>

      <h3 className="mt-4 text-xl leading-snug font-medium text-forest-900">{recommendation.title}</h3>

      <div className="mt-3 rounded-xl bg-ivory-100 p-3.5 text-sm leading-relaxed">
        <p className="text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
          {isGap ? 'Situation' : `Constat · niveau ${recommendation.level} — ${maturityLabels[recommendation.level ?? 0]}`}
        </p>
        {question && <p className="mt-1 font-semibold text-forest-900">{question.title}</p>}
        <p className="mt-0.5 text-ink-muted">{recommendation.observation}</p>
      </div>

      <p className="mt-4 leading-relaxed text-ink-muted">{recommendation.description}</p>

      <h4 className="mt-5 text-xs font-semibold tracking-[0.12em] text-forest-900 uppercase">Étapes pratiques</h4>
      <ol className="mt-2.5 space-y-2 text-sm leading-relaxed">
        {recommendation.steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ${
                index === 0 ? 'bg-forest-900 text-gold-300' : 'bg-ivory-200 text-forest-900'
              }`}
            >
              {index + 1}
            </span>
            <span className={index === 0 ? 'text-forest-900' : 'text-ink-muted'}>
              {index === 0 && <span className="font-semibold">Prochaine étape : </span>}
              {step}
            </span>
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="min-h-5 flex-1" />
      <p className="flex gap-2.5 border-t border-ivory-300/60 pt-4 text-sm leading-relaxed text-ink-muted">
        <Target aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
        <span>
          <span className="font-semibold text-forest-900">Bénéfice attendu : </span>
          {recommendation.benefit}
        </span>
      </p>
    </article>
  )
}

/* ---------- F. Roadmap ---------- */

const horizons: { id: Horizon; label: string; period: string }[] = [
  { id: 'immediat', label: 'Actions immédiates', period: '0 à 3 mois' },
  { id: 'moyen-terme', label: 'Moyen terme', period: '3 à 12 mois' },
  { id: 'long-terme', label: 'Long terme', period: 'Au-delà de 12 mois' },
]

export function Roadmap({ roadmap }: { roadmap: Record<Horizon, Recommendation[]> }) {
  return (
    <ol className="grid gap-5 lg:grid-cols-3">
      {horizons.map((horizon, index) => {
        const items = roadmap[horizon.id]
        return (
          <li key={horizon.id} className="rounded-2xl bg-ivory-50 p-6 ring-1 ring-ivory-300/80 break-inside-avoid">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-forest-900 font-display text-gold-300">{index + 1}</span>
              <div>
                <h3 className="text-lg leading-tight font-medium text-forest-900">{horizon.label}</h3>
                <p className="text-xs text-ink-muted">{horizon.period}</p>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="mt-5 flex gap-2 text-sm text-ink-muted">
                <CircleDashed aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> Aucune action pour cet horizon.
              </p>
            ) : (
              <ul className="mt-5 space-y-3.5">
                {items.map((item) => (
                  <li key={item.id} className="text-sm leading-relaxed">
                    <p className="flex gap-2 font-semibold text-forest-900">
                      {item.kind === 'investigation' ? (
                        <CircleQuestionMark aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold-700" />
                      ) : (
                        <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                      )}
                      {item.title}
                    </p>
                    <p className="mt-0.5 pl-6 text-ink-muted">
                      {getDimension(item.dimension).name} · {priorityStyles[item.priority].label.toLowerCase()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- Methodology ---------- */

export function Methodology() {
  return (
    <details className="group rounded-2xl bg-ivory-50 p-6 ring-1 ring-ivory-300/80 break-inside-avoid sm:p-7">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 font-display text-xl text-forest-900 [&::-webkit-details-marker]:hidden">
        <Lightbulb aria-hidden="true" className="size-5 text-gold-700" />
        Méthode de calcul
        <span className="ml-auto text-sm font-sans text-emerald-700 group-open:hidden">Afficher</span>
        <span className="ml-auto hidden text-sm font-sans text-emerald-700 group-open:inline">Masquer</span>
      </summary>
      <div className="mt-5 grid gap-6 text-sm leading-relaxed text-ink-muted md:grid-cols-2">
        <ul className="space-y-2.5">
          <li>Chaque réponse vaut de 0 (absent) à 4 (avancé).</li>
          <li>
            Score d’une dimension = somme des réponses notées ÷ (4 × nombre de réponses notées) × 100. « Non applicable » et
            « Je ne sais pas » sont exclus du calcul, jamais comptés comme zéro.
          </li>
          <li>Une dimension n’est notée qu’avec au moins {MIN_SCORED_PER_DIMENSION} réponses notées sur 4.</li>
        </ul>
        <ul className="space-y-2.5">
          <li>
            Score global = moyenne des cinq dimensions (20 % chacune), calculée seulement si les cinq dimensions sont
            notées.
          </li>
          <li>Les scores sont arrondis à l’entier le plus proche ; la moyenne utilise les valeurs non arrondies.</li>
          <li>
            Niveaux : {bands.map((band) => `${band.min}–${band.max} ${band.label.toLowerCase()}`).join(' · ')}.
          </li>
        </ul>
      </div>
    </details>
  )
}
