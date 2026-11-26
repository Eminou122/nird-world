import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { ButtonLink } from '../../../components/ui/ButtonLink'
import { Disclosure } from '../../../components/ui/Disclosure'
import { buttonClass } from '../../../components/ui/buttonClass'
import {
  CoverageDetails,
  DimensionScores,
  GoingWell,
  MethodologyContent,
  NeedsAttention,
  NextStep,
  RecommendationItem,
  Roadmap,
  ScoreSummary,
  horizons,
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
import { toolsForReport, type ReturnTo } from '../../connections/suggest'
import { ReportTools } from '../../connections/SuggestedTools'
import { questions } from '../data/questions'
import { analyse } from '../engine/analysis'
import { buildRecommendations, buildRoadmap } from '../engine/recommendationEngine'
import { computeResult, isMaturityLevel } from '../engine/scoring'
import { diagnosticActions, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import { diagnosticPaths } from '../paths'
import type { DimensionResult } from '../types/diagnostic'

const crumbs = [
  { label: 'Accueil', to: '/' },
  { label: 'Le village', to: '/village' },
  { label: 'École', to: diagnosticPaths.intro },
  { label: 'Rapport' },
]

/** The printed report is complete: open every collapsed section while printing, then restore them. */
function useExpandedPrint() {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = []
    const expand = () => {
      opened = [...document.querySelectorAll<HTMLDetailsElement>('main details:not([open])')]
      opened.forEach((details) => (details.open = true))
    }
    const restore = () => opened.forEach((details) => (details.open = false))
    window.addEventListener('beforeprint', expand)
    window.addEventListener('afterprint', restore)
    return () => {
      window.removeEventListener('beforeprint', expand)
      window.removeEventListener('afterprint', restore)
    }
  }, [])
}

export function ResultsPage() {
  const { id } = useParams()
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [confirmRestart, setConfirmRestart] = useState(false)
  useExpandedPrint()

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
      tools: toolsForReport(recommendations),
    }
  }, [assessment])

  if (!id && assessment) return <Navigate to={diagnosticPaths.results(assessment.id)} replace />

  if (!assessment || !report) {
    return (
      <>
        <title>Rapport introuvable — NIRD WORLD</title>
        <DiagnosticHeader crumbs={crumbs} title="Aucun rapport ici">
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            Ce rapport a été supprimé, ou il se trouve sur un autre appareil. Vous pouvez en créer un en une quinzaine de
            minutes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink to={diagnosticPaths.intro}>Commencer un diagnostic</ButtonLink>
            <ButtonLink to={diagnosticPaths.history} variant="outline-dark">
              Mes diagnostics
            </ButtonLink>
          </div>
        </DiagnosticHeader>
      </>
    )
  }

  const { result, analysis, recommendations, roadmap, tools } = report
  const returnTo: ReturnTo = { to: diagnosticPaths.results(assessment.id), label: 'Retour à votre rapport' }
  const remember = (section: string) => `rapport.${assessment.id}.${section}`
  const { overall, band, coverage } = result
  const justCompleted = (state as { justCompleted?: boolean } | null)?.justCompleted === true

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

  const priorityHint = (['haute', 'moyenne', 'basse'] as const)
    .map((priority) => ({ priority, count: recommendations.filter((r) => r.priority === priority).length }))
    .filter(({ count }) => count > 0)
    .map(({ priority, count }) => `${count} en ${priorityStyles[priority].label.toLowerCase()}`)
    .join(', ')

  const roadmapHint = horizons
    .filter(({ id: horizon }) => roadmap[horizon].length > 0)
    .map(({ id: horizon, label }) => `${roadmap[horizon].length} ${label.charAt(0).toLowerCase()}${label.slice(1)}`)
    .join(', ')

  const toDo = result.dimensions.filter((d) => !d.valid)
  const scored = overall !== null && band !== null
  const quietAction = 'inline-flex min-h-11 items-center rounded font-semibold text-emerald-700 hover:text-forest-900'

  return (
    <>
      <title>{`Rapport — ${institutionLabel(assessment)} — NIRD WORLD`}</title>

      <DiagnosticHeader crumbs={crumbs} title={institutionLabel(assessment)}>
        {justCompleted && (
          <p className="mt-2 text-lg font-semibold text-emerald-700">C’est terminé, merci&nbsp;! Voici votre rapport.</p>
        )}
        <p className="mt-1 text-ink-muted">
          {institutionTypeLabel(assessment) && `${institutionTypeLabel(assessment)}. `}
          Mis à jour le {formatDateTime(assessment.updatedAt)}
        </p>
      </DiagnosticHeader>

      <div className="bg-sage-100">
        <div className="mx-auto max-w-5xl px-5 pb-14 sm:px-8 sm:pb-20">
          {scored ? (
            <ScoreSummary score={overall} band={band}>
              <p className="mt-4 text-sm text-ivory-100/70">
                Auto-évaluation indicative, d’après vos réponses. Ce n’est ni une certification ni un audit officiel.
              </p>
            </ScoreSummary>
          ) : (
            <section aria-labelledby="incomplet-title" className="rounded-3xl bg-ivory-50 p-7 sm:p-10">
              <h2 id="incomplet-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
                Encore quelques réponses
              </h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
                Votre diagnostic est incomplet. Pour calculer un score juste, il faut au moins trois réponses notées par
                sujet&nbsp;: {plural(toDo.length, 'sujet reste', 'sujets restent')} à compléter. Rien n’est compté comme un
                zéro.
              </p>
              <button type="button" onClick={() => review(assessment.currentIndex)} className={buttonClass('primary', 'mt-6 print:hidden')}>
                Reprendre le questionnaire
              </button>
            </section>
          )}
        </div>
      </div>

      <div className="bg-ivory-50">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          {scored ? (
            <>
              <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                <GoingWell analysis={analysis} />
                <NeedsAttention analysis={analysis} />
              </div>

              <div className="mt-14">
                <NextStep recommendation={recommendations[0]} returnTo={returnTo} />
              </div>

              <section aria-labelledby="approfondir-title" className="mt-16">
                <h2 id="approfondir-title" className="text-2xl font-medium text-forest-900 sm:text-3xl">
                  Pour aller plus loin
                </h2>
                <div className="mt-4 border-t border-forest-900/12">
                  <Disclosure title="Les scores des cinq sujets" defaultOpen>
                    <DimensionScores dimensions={result.dimensions} />
                  </Disclosure>
                  {recommendations.length > 0 && (
                    <Disclosure
                      title={`Toutes les recommandations (${recommendations.length})`}
                      hint={priorityHint}
                      rememberAs={remember('recommandations')}
                    >
                      <p className="max-w-2xl leading-relaxed text-ink-muted">
                        Chacune vient d’une de vos réponses. Un «&nbsp;Je ne sais pas&nbsp;» donne une vérification à faire,
                        jamais un reproche.
                      </p>
                      <ul className="mt-2" data-recommendations>
                        {recommendations.map((recommendation) => (
                          <RecommendationItem
                            key={recommendation.id}
                            recommendation={recommendation}
                            returnTo={returnTo}
                            rememberAs={remember(recommendation.id)}
                          />
                        ))}
                      </ul>
                    </Disclosure>
                  )}
                  {tools.length > 0 && (
                    <Disclosure
                      title={`Des outils libres pour passer à l’action (${tools.length})`}
                      hint="Choisis d’après vos réponses, sans classement"
                      rememberAs={remember('outils')}
                    >
                      <ReportTools tools={tools} returnTo={returnTo} />
                    </Disclosure>
                  )}
                  {recommendations.length > 0 && (
                    <Disclosure title="La feuille de route" hint={roadmapHint}>
                      <Roadmap roadmap={roadmap} />
                    </Disclosure>
                  )}
                  <Disclosure title="Ce que couvrent vos réponses" hint={`${coverage.percent} % des questions applicables sont notées`}>
                    <CoverageDetails coverage={coverage} />
                  </Disclosure>
                  <Disclosure title="Comment ce score est calculé">
                    <MethodologyContent band={band} />
                  </Disclosure>
                </div>
              </section>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-medium text-forest-900 sm:text-3xl">Où vous en êtes, sujet par sujet</h2>
              <div className="mt-6">
                <DimensionScores dimensions={result.dimensions} onComplete={completeDimension} />
              </div>
              <div className="mt-8 border-t border-forest-900/12">
                <Disclosure title="Ce que couvrent vos réponses" hint={`${coverage.percent} % des questions applicables sont notées`}>
                  <CoverageDetails coverage={coverage} />
                </Disclosure>
                <Disclosure title="Comment le score est calculé">
                  <MethodologyContent />
                </Disclosure>
              </div>
            </>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 print:hidden">
            <button type="button" onClick={() => window.print()} className={buttonClass('dark')}>
              Imprimer ou enregistrer en PDF
            </button>
            <button type="button" onClick={() => review()} className={quietAction}>
              Revoir mes réponses
            </button>
            <button type="button" onClick={() => setConfirmRestart(true)} className={quietAction}>
              Refaire le diagnostic
            </button>
            <Link to={diagnosticPaths.history} className={quietAction}>
              Mes diagnostics
            </Link>
            <Link to="/village" className={quietAction}>
              Retour au village
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmRestart}
        title="Refaire le diagnostic ?"
        confirmLabel="Commencer"
        onClose={() => setConfirmRestart(false)}
        onConfirm={restart}
      >
        <p>Vous partirez d’un questionnaire vierge. Ce rapport reste disponible dans «&nbsp;Mes diagnostics&nbsp;».</p>
      </ConfirmDialog>
    </>
  )
}
