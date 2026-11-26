import { ArrowLeft, ArrowRight, Check, ListChecks } from 'lucide-react'
import * as m from 'motion/react-m'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { Disclosure } from '../../../components/ui/Disclosure'
import { buttonClass } from '../../../components/ui/buttonClass'
import { QuestionMap } from '../components/QuestionMap'
import { ConfirmDialog, dimensionIcons, plural } from '../components/ui'
import { dimensionIntros, questionGuides } from '../data/guidance'
import { dimensions, getDimension, maturityLabels, questions } from '../data/questions'
import { computeResult } from '../engine/scoring'
import { diagnosticActions, isPersisted, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import { diagnosticPaths } from '../paths'
import type { Answer, MaturityLevel } from '../types/diagnostic'

const levels: MaturityLevel[] = [0, 1, 2, 3, 4]

const specialOptions = [
  { value: 'unknown', label: 'Je ne sais pas' },
  { value: 'na', label: 'Non applicable' },
] as const

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

export function QuestionnairePage() {
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const assessment = store.assessments.find((a) => a.id === store.activeId)
  const [confirmReset, setConfirmReset] = useState(false)
  const mapRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const userMoved = useRef(false)
  const headingId = useId()
  const index = assessment?.currentIndex ?? 0

  // After moving to another question, start from its top and give it focus for screen-reader and keyboard users.
  useEffect(() => {
    if (!userMoved.current) return
    userMoved.current = false
    headingRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [index])

  if (!assessment) return <Navigate to={diagnosticPaths.intro} replace />
  const { id, answers } = assessment

  const question = questions[index] ?? questions[0]
  const dimension = getDimension(question.dimension)
  const DimensionIcon = dimensionIcons[dimension.id]
  const dimensionIndex = dimensions.findIndex((d) => d.id === dimension.id)
  const previousDimension = dimensions[dimensionIndex - 1]
  const isFirstOfDimension = questions[index - 1]?.dimension !== dimension.id
  const isAnswered = (q: (typeof questions)[number]) => answers[q.id] !== undefined
  const previousDone =
    previousDimension !== undefined && questions.filter((q) => q.dimension === previousDimension.id).every(isAnswered)

  const answer = answers[question.id]
  const guide = questionGuides[question.id]
  const answeredCount = questions.filter(isAnswered).length
  const remaining = questions.length - answeredCount
  const isLast = index === questions.length - 1

  const goTo = (target: number) => {
    userMoved.current = target !== index
    diagnosticActions.goTo(id, target)
  }

  const select = (value: Answer) => diagnosticActions.answer(id, question.id, value)

  function finish() {
    const valid = computeResult(answers).valid
    if (valid) diagnosticActions.markCompleted(id)
    navigate(diagnosticPaths.results(id), { state: { justCompleted: valid } })
  }

  return (
    <>
      <title>{`Question ${index + 1} sur ${questions.length} — Diagnostic — NIRD WORLD`}</title>

      <div className="bg-ivory-100">
        <div className="mx-auto max-w-3xl px-5 pt-3 sm:px-8 sm:pt-6">
          <div className="flex items-center justify-between gap-3">
            <Link
              to={diagnosticPaths.intro}
              className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-ink-muted hover:text-forest-900"
            >
              <ArrowLeft aria-hidden="true" className="size-4" /> École
            </Link>
            <p className="text-sm text-ink-muted">
              Question <span className="font-semibold text-forest-900 tabular-nums">{index + 1}</span> sur {questions.length}
            </p>
            <button
              type="button"
              onClick={() => mapRef.current?.showModal()}
              className="inline-flex min-h-11 min-w-11 items-center justify-end gap-2 rounded-md text-sm font-semibold text-emerald-700 hover:text-forest-900"
            >
              <ListChecks aria-hidden="true" className="size-5 sm:size-4" />
              <span className="max-sm:sr-only">Toutes les questions</span>
            </button>
          </div>

          {/* One segment per dimension, filled as its questions are answered. */}
          <div
            role="progressbar"
            aria-label="Questions répondues"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={answeredCount}
            aria-valuetext={`${plural(answeredCount, 'réponse', 'réponses')} sur ${questions.length}`}
            className="mt-1 flex gap-1.5"
          >
            {dimensions.map((d) => {
              const own = questions.filter((q) => q.dimension === d.id)
              const done = own.filter(isAnswered).length
              return (
                <span key={d.id} className="h-2 flex-1 overflow-hidden rounded-full bg-sage-300">
                  <span
                    className={`block h-full rounded-full transition-[width] duration-500 ${d.id === dimension.id ? 'bg-gold-400' : 'bg-emerald-600'}`}
                    style={{ width: `${(done / own.length) * 100}%` }}
                  />
                </span>
              )
            })}
          </div>
          <p className="mt-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <DimensionIcon aria-hidden="true" className="size-4" /> {dimension.name}
          </p>
        </div>

        <section aria-labelledby={headingId} className="mx-auto max-w-3xl px-5 pt-5 pb-10 sm:px-8 sm:pt-8">
          <m.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {isFirstOfDimension && (
              <p className="mb-5 rounded-2xl bg-sage-200 px-5 py-3.5 leading-relaxed text-forest-900">
                {previousDone && `${previousDimension.name} : c’est fait. `}
                <span className="font-semibold">
                  {index === 0 ? 'Premier sujet' : dimensionIndex === dimensions.length - 1 ? 'Dernier sujet' : 'Nouveau sujet'}&nbsp;:
                </span>{' '}
                {lowerFirst(dimensionIntros[dimension.id])}
              </p>
            )}

            <h1
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="text-[1.6rem] leading-snug font-medium text-forest-900 outline-none sm:text-4xl sm:leading-tight"
            >
              {question.prompt}
            </h1>

            <Disclosure variant="inline" title="Pourquoi cette question&nbsp;?">
              <div className="max-w-2xl rounded-2xl bg-ivory-50 px-5 py-4 leading-relaxed text-ink-muted">
                <p>{guide.why}</p>
                {guide.terms && (
                  <dl className="mt-3 space-y-1.5 text-sm">
                    {guide.terms.map(({ term, meaning }) => (
                      <div key={term}>
                        <dt className="inline font-semibold text-forest-900">{term}&nbsp;: </dt>
                        <dd className="inline">{meaning}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Disclosure>

            <fieldset aria-labelledby={headingId} className="mt-3">
              <p className="mb-3 text-ink-muted">Qu’est-ce qui ressemble le plus à votre établissement&nbsp;?</p>
              <div className="space-y-2.5">
                {levels.map((level) => (
                  <label
                    key={level}
                    className="group relative flex cursor-pointer gap-4 rounded-2xl bg-ivory-50 px-4 py-4 ring-1 ring-forest-900/10 transition duration-200 hover:ring-emerald-600/50 has-checked:bg-sage-200 has-checked:ring-2 has-checked:ring-emerald-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-emerald-600 sm:px-5"
                  >
                    <input
                      type="radio"
                      name={`reponse-${question.id}`}
                      value={level}
                      checked={answer === level}
                      onChange={() => select(level)}
                      className="absolute inset-0 size-full cursor-pointer appearance-none rounded-[inherit] opacity-0 scroll-my-24"
                    />
                    <RadioMark />
                    <span className="min-w-0 flex-1">
                      <span className="block leading-relaxed text-forest-900">{question.levels[level]}</span>
                      <span className="mt-1 block text-sm text-ink-muted">{maturityLabels[level]}</span>
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-6 mb-2.5 text-sm text-ink-muted">
                Pas de réponse évidente&nbsp;? Ces deux choix ne comptent jamais comme un zéro.
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                {specialOptions.map(({ value, label }) => (
                  <label
                    key={value}
                    className="group relative flex min-h-12 cursor-pointer items-center gap-3 rounded-full px-4 ring-1 ring-forest-900/15 transition duration-200 hover:ring-emerald-600/50 has-checked:bg-sage-200 has-checked:ring-2 has-checked:ring-emerald-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-emerald-600 sm:pr-6"
                  >
                    <input
                      type="radio"
                      name={`reponse-${question.id}`}
                      value={value}
                      checked={answer === value}
                      onChange={() => select(value)}
                      className="absolute inset-0 size-full cursor-pointer appearance-none rounded-[inherit] opacity-0 scroll-my-24"
                    />
                    <RadioMark />
                    <span className="text-forest-900">{label}</span>
                  </label>
                ))}
              </div>
              {answer === 'unknown' && (
                <p className="mt-3 text-sm text-ink-muted">C’est noté. Votre rapport vous dira comment trouver l’information.</p>
              )}
              {answer === 'na' && <p className="mt-3 text-sm text-ink-muted">C’est noté. Cette question est retirée du calcul.</p>}
            </fieldset>

            {isLast && remaining > 0 && (
              <p className="mt-6 text-ink-muted">
                Il reste {plural(remaining, 'question', 'questions')} sans réponse.{' '}
                <button
                  type="button"
                  onClick={() => goTo(questions.findIndex((q) => !isAnswered(q)))}
                  className="rounded font-semibold text-emerald-700 underline underline-offset-4 hover:text-forest-900"
                >
                  Y revenir
                </button>
              </p>
            )}
          </m.div>
        </section>

        {/* Always within reach, whatever the length of the answers. */}
        <div className="sticky bottom-0 z-10 border-t border-forest-900/10 bg-ivory-50/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className={buttonClass('outline-dark', 'max-sm:w-12 max-sm:px-0')}
            >
              <ArrowLeft aria-hidden="true" />
              <span className="max-sm:sr-only">Précédent</span>
            </button>
            <p aria-live="polite" className="min-w-0 flex-1 text-center text-sm">
              {answer !== undefined && (
                <m.span
                  key={question.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-1.5 font-medium text-emerald-700"
                >
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                  {isPersisted() ? 'Enregistré' : 'Noté pour cette visite'}
                </m.span>
              )}
            </p>
            {isLast ? (
              <button type="button" onClick={finish} className={buttonClass('primary')}>
                Voir mon rapport
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className={buttonClass(answer === undefined ? 'outline-dark' : 'dark')}
              >
                {answer === undefined ? 'Passer' : 'Continuer'} <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <QuestionMap
        ref={mapRef}
        assessment={assessment}
        currentIndex={index}
        onGoTo={(target) => {
          mapRef.current?.close()
          goTo(target)
        }}
        onClear={answer === undefined ? undefined : () => diagnosticActions.answer(id, question.id, null)}
        onFinish={finish}
        onReset={() => {
          mapRef.current?.close()
          setConfirmReset(true)
        }}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Tout recommencer ?"
        confirmLabel="Effacer mes réponses"
        danger
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          userMoved.current = index !== 0
          diagnosticActions.reset(id)
          setConfirmReset(false)
        }}
      >
        <p>
          {answeredCount > 1 ? `Vos ${answeredCount} réponses seront effacées` : 'Votre réponse sera effacée'} et vous
          reviendrez à la première question. Ce choix est définitif.
        </p>
      </ConfirmDialog>
    </>
  )
}

function RadioMark() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ring-2 ring-ink-muted/70 ring-inset transition group-hover:ring-emerald-600/60 group-has-checked:bg-emerald-600 group-has-checked:ring-emerald-600"
    >
      <Check className="size-4 scale-50 text-ivory-50 opacity-0 transition duration-200 group-has-checked:scale-100 group-has-checked:opacity-100" />
    </span>
  )
}
