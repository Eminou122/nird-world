import { ArrowLeft, ArrowRight, Ban, Check, CircleQuestionMark, Eraser, HardDrive, RotateCcw } from 'lucide-react'
import * as m from 'motion/react-m'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { buttonClass } from '../../../components/ui/ButtonLink'
import { dimensions, getDimension, maturityLabels, questions } from '../data/questions'
import { computeResult } from '../engine/scoring'
import { diagnosticActions, isPersisted, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import type { Answer, MaturityLevel } from '../types/diagnostic'
import { ConfirmDialog, DiagnosticHeader, institutionLabel, institutionTypeLabel } from '../components/ui'
import { diagnosticPaths } from '../paths'

const levels: MaturityLevel[] = [0, 1, 2, 3, 4]

const specialOptions = [
  {
    value: 'unknown',
    icon: CircleQuestionMark,
    label: 'Je ne sais pas',
    hint: 'Non compté dans le score. Une piste de vérification vous sera proposée.',
  },
  {
    value: 'na',
    icon: Ban,
    label: 'Non applicable',
    hint: 'Cette pratique ne concerne pas votre établissement. Elle est retirée du calcul.',
  },
] as const

const answerStatus = (answer: Answer | undefined) =>
  answer === undefined
    ? 'sans réponse'
    : answer === 'unknown'
      ? '« Je ne sais pas »'
      : answer === 'na'
        ? 'non applicable'
        : `niveau ${answer}`

export function QuestionnairePage() {
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const assessment = store.assessments.find((a) => a.id === store.activeId)
  const [confirmReset, setConfirmReset] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const userMoved = useRef(false)
  const headingId = useId()
  const index = assessment?.currentIndex ?? 0

  // After Previous/Next, bring the new question into view and give it focus for screen-reader users.
  useEffect(() => {
    if (!userMoved.current) return
    userMoved.current = false
    const heading = headingRef.current
    if (!heading) return
    heading.focus({ preventScroll: true })
    const top = heading.getBoundingClientRect().top
    if (top < 96 || top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 140 })
  }, [index])

  if (!assessment) return <Navigate to={diagnosticPaths.intro} replace />

  const question = questions[index] ?? questions[0]
  const dimension = getDimension(question.dimension)
  const dimensionQuestions = questions.filter((q) => q.dimension === question.dimension)
  const positionInDimension = dimensionQuestions.findIndex((q) => q.id === question.id) + 1
  const answer = assessment.answers[question.id]
  const answeredCount = questions.filter((q) => assessment.answers[q.id] !== undefined).length
  const isLast = index === questions.length - 1
  const typeLabel = institutionTypeLabel(assessment)

  const goTo = (target: number) => {
    userMoved.current = true
    diagnosticActions.goTo(assessment.id, target)
  }

  const select = (value: Answer) => diagnosticActions.answer(assessment.id, question.id, value)

  function finish() {
    if (computeResult(assessment!.answers).valid) diagnosticActions.markCompleted(assessment!.id)
    navigate(diagnosticPaths.results(assessment!.id))
  }

  return (
    <>
      <title>{`Question ${index + 1} sur ${questions.length} — Diagnostic — NIRD WORLD`}</title>

      <DiagnosticHeader
        crumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Le village', to: '/village' },
          { label: 'École', to: diagnosticPaths.intro },
          { label: 'Diagnostic' },
        ]}
        eyebrow={[institutionLabel(assessment), typeLabel].filter(Boolean).join(' · ')}
        title="Diagnostic d’indépendance numérique"
      >
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <p className="font-semibold">
              Question {index + 1} <span className="font-normal text-ivory-100/65">sur {questions.length}</span>
            </p>
            <p className="text-ivory-100/70">
              {answeredCount} réponse{answeredCount > 1 ? 's' : ''} sur {questions.length}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Questions répondues"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={answeredCount}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-ivory-50/10"
          >
            <div
              className="h-full rounded-full bg-gold-400 transition-[width] duration-500"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>

          <nav aria-label="Questions du diagnostic" className="mt-6">
            <ol className="grid grid-cols-5 gap-2 sm:gap-3">
              {dimensions.map((d) => {
                const isCurrent = d.id === question.dimension
                return (
                  <li key={d.id} className={`rounded-xl p-2.5 sm:p-3 ${isCurrent ? 'bg-ivory-50/10 ring-1 ring-gold-400/40' : 'bg-ivory-50/[0.03]'}`}>
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-gold-300' : 'text-ivory-100/60'}`}>
                      <span className="font-display text-sm">{d.letter}</span>
                      <span className="hidden md:inline"> · {d.name}</span>
                    </p>
                    <ol className="mt-2 grid w-fit grid-cols-2 gap-1.5 sm:flex">
                      {questions.map((q, i) =>
                        q.dimension !== d.id ? null : (
                          <li key={q.id}>
                            <button
                              type="button"
                              onClick={() => goTo(i)}
                              aria-current={i === index ? 'step' : undefined}
                              aria-label={`Question ${i + 1} : ${q.title} (${answerStatus(assessment.answers[q.id])})`}
                              className={`block size-3 rounded-full transition sm:size-3.5 ${
                                i === index
                                  ? 'bg-gold-400 ring-2 ring-gold-400/40 ring-offset-2 ring-offset-forest-900'
                                  : assessment.answers[q.id] !== undefined
                                    ? 'bg-ivory-50/80 hover:bg-ivory-50'
                                    : 'bg-transparent ring-1 ring-ivory-50/40 ring-inset hover:bg-ivory-50/20'
                              }`}
                            />
                          </li>
                        ),
                      )}
                    </ol>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      </DiagnosticHeader>

      <section aria-labelledby={headingId} className="bg-ivory-100 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <m.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">
              Dimension {dimension.letter} · {dimension.name}
              <span className="text-ink-muted"> — {positionInDimension} sur {dimensionQuestions.length}</span>
            </p>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 text-2xl leading-snug font-medium text-forest-900 outline-none sm:text-3xl"
            >
              {question.prompt}
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Choisissez la description la plus proche de ce qui se pratique réellement aujourd’hui.
            </p>

            <fieldset aria-labelledby={headingId} className="mt-7">
              <div className="space-y-2.5">
                {levels.map((level) => (
                  <label
                    key={level}
                    className="group flex cursor-pointer gap-4 rounded-2xl bg-ivory-50 p-4 ring-1 ring-ivory-300/80 transition hover:ring-emerald-600/40 has-checked:bg-emerald-600/[0.07] has-checked:ring-2 has-checked:ring-emerald-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold-400 sm:p-5"
                  >
                    <input
                      type="radio"
                      name={`reponse-${question.id}`}
                      value={level}
                      checked={answer === level}
                      onChange={() => select(level)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-ivory-200 font-display text-lg text-forest-900 tabular-nums transition group-has-checked:bg-emerald-600 group-has-checked:text-ivory-50"
                    >
                      {level}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-forest-900">{maturityLabels[level]}</span>
                      <span className="mt-0.5 block leading-relaxed text-ink-muted">{question.levels[level]}</span>
                    </span>
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-emerald-600 opacity-0 transition group-has-checked:opacity-100"
                    />
                  </label>
                ))}
              </div>

              <p className="mt-6 mb-2.5 text-sm font-medium text-ink-muted">Si vous ne pouvez pas répondre :</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {specialOptions.map(({ value, icon: Icon, label, hint }) => (
                  <label
                    key={value}
                    className="group flex cursor-pointer gap-3 rounded-2xl bg-ivory-50/60 p-4 ring-1 ring-ivory-300/80 transition hover:ring-forest-900/30 has-checked:bg-forest-900/[0.06] has-checked:ring-2 has-checked:ring-forest-900/70 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold-400"
                  >
                    <input
                      type="radio"
                      name={`reponse-${question.id}`}
                      value={value}
                      checked={answer === value}
                      onChange={() => select(value)}
                      className="sr-only"
                    />
                    <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-muted group-has-checked:text-forest-900" />
                    <span>
                      <span className="block font-semibold text-forest-900">{label}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {answer !== undefined && (
              <button
                type="button"
                onClick={() => diagnosticActions.answer(assessment.id, question.id, null)}
                className="mt-4 inline-flex items-center gap-1.5 rounded text-sm text-ink-muted underline-offset-4 hover:text-forest-900 hover:underline"
              >
                <Eraser aria-hidden="true" className="size-4" /> Effacer ma réponse
              </button>
            )}
          </m.div>

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-ivory-300/70 pt-6">
            <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className={buttonClass('outline-dark')}>
              <ArrowLeft aria-hidden="true" /> <span className="hidden sm:inline">Précédent</span>
              <span className="sr-only sm:hidden">Question précédente</span>
            </button>
            {isLast ? (
              <button type="button" onClick={finish} className={buttonClass('primary')}>
                Voir les résultats <ArrowRight aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={() => goTo(index + 1)} className={buttonClass('dark')}>
                {answer === undefined ? 'Passer' : 'Suivant'} <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2">
              <HardDrive aria-hidden="true" className="size-4 text-emerald-700" />
              {isPersisted() ? 'Progression enregistrée automatiquement sur cet appareil.' : 'Enregistrement local indisponible.'}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {!isLast && answeredCount > 0 && (
                <button type="button" onClick={finish} className="rounded font-semibold text-emerald-700 hover:text-forest-900">
                  Voir les résultats
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                disabled={answeredCount === 0}
                className="inline-flex items-center gap-1.5 rounded hover:text-forest-900 disabled:opacity-40"
              >
                <RotateCcw aria-hidden="true" className="size-4" /> Réinitialiser
              </button>
              <Link to={diagnosticPaths.history} className="rounded hover:text-forest-900">
                Historique
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={confirmReset}
        title="Réinitialiser le questionnaire ?"
        confirmLabel="Effacer mes réponses"
        danger
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          diagnosticActions.reset(assessment.id)
          setConfirmReset(false)
          userMoved.current = true
        }}
      >
        <p>
          Les {answeredCount} réponses de ce diagnostic seront effacées et vous reprendrez à la première question. Cette
          action est définitive.
        </p>
      </ConfirmDialog>
    </>
  )
}
