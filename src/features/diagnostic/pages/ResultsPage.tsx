import { Archive, ArrowLeft, Info, PenLine, Printer, RotateCcw, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ButtonLink, buttonClass } from '../../../components/ui/ButtonLink'
import { questions } from '../data/questions'
import { analyse } from '../engine/analysis'
import { buildRecommendations, buildRoadmap } from '../engine/recommendationEngine'
import { computeResult, isMaturityLevel } from '../engine/scoring'
import { diagnosticActions, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import type { DimensionResult } from '../types/diagnostic'
import {
  AnalysisPanels,
  CoveragePanel,
  DimensionBreakdown,
  Methodology,
  RecommendationCard,
  Roadmap,
  ScoreSummary,
} from '../components/report'
import {
  ConfirmDialog,
  DiagnosticHeader,
  formatDateTime,
  institutionLabel,
  institutionTypeLabel,
  plural,
  priorityStyles,
} from '../components/ui'
import { diagnosticPaths } from '../paths'

const crumbs = [
  { label: 'Accueil', to: '/' },
  { label: 'Le village', to: '/village' },
  { label: 'École', to: diagnosticPaths.intro },
  { label: 'Rapport' },
]

export function ResultsPage() {
  const { id } = useParams()
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const [confirmRestart, setConfirmRestart] = useState(false)

  const assessment = id
    ? store.assessments.find((a) => a.id === id)
    : (store.assessments.find((a) => a.id === store.activeId) ?? store.assessments[0])

  const report = useMemo(() => {
    if (!assessment) return null
    const result = computeResult(assessment.answers)
    const recommendations = buildRecommendations(assessment.answers)
    return {
      result,
      analysis: analyse(assessment.answers, result),
      recommendations,
      roadmap: buildRoadmap(recommendations),
    }
  }, [assessment])

  if (!id && assessment) return <Navigate to={diagnosticPaths.results(assessment.id)} replace />

  if (!assessment || !report) {
    return (
      <>
        <title>Rapport introuvable — NIRD WORLD</title>
        <DiagnosticHeader crumbs={crumbs} eyebrow="Diagnostic d’indépendance numérique" title="Aucun rapport à afficher">
          <p className="mt-4 max-w-xl text-lg text-ivory-100/75">
            Ce rapport n’existe pas ou a été supprimé de cet appareil.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={diagnosticPaths.intro}>Commencer un diagnostic</ButtonLink>
            <ButtonLink to={diagnosticPaths.history} variant="outline-light">
              Historique
            </ButtonLink>
          </div>
        </DiagnosticHeader>
      </>
    )
  }

  const { result, analysis, recommendations, roadmap } = report
  const typeLabel = institutionTypeLabel(assessment)

  function review(index = 0) {
    diagnosticActions.open(assessment!.id, index)
    navigate(diagnosticPaths.questionnaire)
  }

  /** Jump to the first question of the dimension that can still receive a numeric answer. */
  function completeDimension(dimension: DimensionResult) {
    const target = questions.findIndex(
      (q) => q.dimension === dimension.dimension && !isMaturityLevel(assessment!.answers[q.id]) && assessment!.answers[q.id] !== 'na',
    )
    review(target === -1 ? questions.findIndex((q) => q.dimension === dimension.dimension) : target)
  }

  function restart() {
    diagnosticActions.start(assessment!.institutionName, assessment!.institutionType)
    navigate(diagnosticPaths.questionnaire)
  }

  const priorityCounts = (['haute', 'moyenne', 'basse'] as const)
    .map((priority) => ({ priority, count: recommendations.filter((r) => r.priority === priority).length }))
    .filter(({ count }) => count > 0)

  return (
    <>
      <title>{`Rapport — ${institutionLabel(assessment)} — NIRD WORLD`}</title>

      <DiagnosticHeader
        crumbs={crumbs}
        eyebrow="Rapport de diagnostic d’indépendance numérique"
        title={institutionLabel(assessment)}
      >
        <p className="mt-3 text-ivory-100/70">
          {[typeLabel, `Mis à jour le ${formatDateTime(assessment.updatedAt)}`].filter(Boolean).join(' · ')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <button type="button" onClick={() => review()} className={buttonClass('outline-light')}>
            <PenLine aria-hidden="true" /> Revoir les réponses
          </button>
          <button type="button" onClick={() => window.print()} className={buttonClass('outline-light')}>
            <Printer aria-hidden="true" /> Imprimer ou enregistrer en PDF
          </button>
          <button type="button" onClick={() => setConfirmRestart(true)} className={buttonClass('outline-light')}>
            <RotateCcw aria-hidden="true" /> Recommencer
          </button>
          <ButtonLink to={diagnosticPaths.history} variant="outline-light">
            <Archive aria-hidden="true" /> Historique
          </ButtonLink>
        </div>
      </DiagnosticHeader>

      <div className="bg-ivory-100 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-8">
          {result.valid && result.overall !== null ? (
            <>
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <ScoreSummary result={{ ...result, overall: result.overall }} />
                  <p className="mt-4 flex gap-2.5 px-1 text-sm leading-relaxed text-ink-muted">
                    <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                    Auto-évaluation indicative, fondée uniquement sur vos réponses. Ce résultat ne constitue ni une
                    certification ni un audit officiel de l’établissement.
                  </p>
                </div>
                <div className="lg:col-span-7">
                  <DimensionBreakdown dimensions={result.dimensions} />
                </div>
              </div>

              <CoveragePanel coverage={result.coverage} wide />
              <AnalysisPanels analysis={analysis} />

              <section aria-labelledby="recommandations-title" className="pt-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">Plan d’action</p>
                    <h2 id="recommandations-title" className="mt-2 text-3xl font-medium text-forest-900 sm:text-4xl">
                      Recommandations personnalisées
                    </h2>
                    <p className="mt-2 max-w-2xl text-ink-muted">
                      Chaque recommandation découle d’une réponse précise. Les réponses « Je ne sais pas » donnent lieu à
                      une vérification, jamais à un constat de faiblesse.
                    </p>
                  </div>
                  {priorityCounts.length > 0 && (
                    <ul className="flex flex-wrap gap-2 text-xs font-semibold">
                      {priorityCounts.map(({ priority, count }) => (
                        <li key={priority} className={`rounded-full px-2.5 py-1 ring-1 ${priorityStyles[priority].className}`}>
                          {count} · {priorityStyles[priority].label.replace('Priorité ', '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {recommendations.length === 0 ? (
                  <p className="mt-8 rounded-2xl bg-ivory-50 p-6 leading-relaxed text-ink-muted ring-1 ring-ivory-300/80">
                    Aucune faiblesse confirmée ni zone d’incertitude : toutes les pratiques notées sont établies ou
                    avancées. Prochaine étape : maintenir ces pratiques, les documenter et refaire ce diagnostic chaque
                    année.
                  </p>
                ) : (
                  <ul className="mt-8 grid gap-5 md:grid-cols-2">
                    {recommendations.map((recommendation) => (
                      <li key={recommendation.id}>
                        <RecommendationCard recommendation={recommendation} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="feuille-de-route-title" className="pt-8">
                <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">Feuille de route</p>
                <h2 id="feuille-de-route-title" className="mt-2 mb-8 text-3xl font-medium text-forest-900 sm:text-4xl">
                  Par où commencer
                </h2>
                <Roadmap roadmap={roadmap} />
              </section>

              <Methodology />
            </>
          ) : (
            <>
              <section
                aria-labelledby="incomplet-title"
                className="flex flex-col gap-4 rounded-2xl bg-gold-400/15 p-6 ring-1 ring-gold-400/50 sm:flex-row sm:p-7"
              >
                <TriangleAlert aria-hidden="true" className="size-6 shrink-0 text-gold-700" />
                <div className="flex-1">
                  <h2 id="incomplet-title" className="text-2xl font-medium text-forest-900">
                    Diagnostic incomplet
                  </h2>
                  <p className="mt-2 leading-relaxed text-ink-muted">
                    Le score global n’est calculé que lorsque chaque dimension compte au moins trois réponses notées
                    (niveaux 0 à 4). Une dimension manquante n’est jamais comptée comme zéro.{' '}
                    {plural(
                      result.dimensions.filter((d) => !d.valid).length,
                      'dimension doit encore être complétée.',
                      'dimensions doivent encore être complétées.',
                    )}
                  </p>
                  <button type="button" onClick={() => review(assessment.currentIndex)} className={buttonClass('dark', 'mt-5 print:hidden')}>
                    <ArrowLeft aria-hidden="true" /> Reprendre le questionnaire
                  </button>
                </div>
              </section>
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <DimensionBreakdown dimensions={result.dimensions} onComplete={completeDimension} />
                </div>
                <div className="lg:col-span-5">
                  <CoveragePanel coverage={result.coverage} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmRestart}
        title="Commencer un nouveau diagnostic ?"
        confirmLabel="Nouveau diagnostic"
        onClose={() => setConfirmRestart(false)}
        onConfirm={restart}
      >
        <p>
          Un nouveau questionnaire vierge sera créé pour {institutionLabel(assessment)}. Ce rapport reste disponible
          dans l’historique.
        </p>
      </ConfirmDialog>
    </>
  )
}
