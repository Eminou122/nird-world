import { Check, Circle, X } from 'lucide-react'
import { useId, type Ref } from 'react'
import { Link } from 'react-router'
import { dimensions, questions } from '../data/questions'
import { diagnosticPaths } from '../paths'
import type { Answer, Assessment } from '../types/diagnostic'

const answerStatus = (answer: Answer | undefined) =>
  answer === undefined ? 'sans réponse' : answer === 'unknown' ? 'je ne sais pas' : answer === 'na' ? 'non applicable' : 'répondu'

interface QuestionMapProps {
  ref: Ref<HTMLDialogElement>
  assessment: Assessment
  currentIndex: number
  onGoTo: (index: number) => void
  /** Present when the current question has an answer to clear. */
  onClear?: () => void
  onFinish: () => void
  onReset: () => void
}

/** Every question with its status, to come back to any answer. Native modal dialog. */
export function QuestionMap({ ref, assessment, currentIndex, onGoTo, onClear, onFinish, onReset }: QuestionMapProps) {
  const titleId = useId()
  const hasAnswers = Object.keys(assessment.answers).length > 0
  const actionClass = 'min-h-11 rounded-md font-semibold text-emerald-700 hover:text-forest-900'

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto max-h-[min(44rem,calc(100dvh-2rem))] w-[min(36rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-ivory-50 p-0 text-ink shadow-lift backdrop:bg-forest-950/50"
    >
      <div className="sticky top-0 flex items-center justify-between gap-4 bg-ivory-50 px-6 py-4">
        <h2 id={titleId} className="text-2xl font-medium text-forest-900">
          Toutes les questions
        </h2>
        <form method="dialog">
          <button className="inline-flex size-11 items-center justify-center rounded-full text-ink-muted hover:bg-sage-200 hover:text-forest-900">
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Fermer</span>
          </button>
        </form>
      </div>

      <div className="space-y-5 px-6 pb-4">
        {dimensions.map((dimension) => (
          <section key={dimension.id} aria-label={dimension.name}>
            <h3 className="font-sans text-sm font-semibold tracking-normal text-emerald-700">{dimension.name}</h3>
            <ol className="mt-1">
              {questions.map((question, i) => {
                if (question.dimension !== dimension.id) return null
                const answer = assessment.answers[question.id]
                const Icon = answer === undefined ? Circle : Check
                return (
                  <li key={question.id}>
                    <button
                      type="button"
                      onClick={() => onGoTo(i)}
                      aria-current={i === currentIndex ? 'step' : undefined}
                      className="-mx-3 flex min-h-11 w-[calc(100%+1.5rem)] items-center gap-3 rounded-lg px-3 py-1.5 text-left text-forest-900 hover:bg-sage-100 aria-[current]:bg-sage-200"
                    >
                      <Icon aria-hidden="true" className={`size-4 shrink-0 ${answer === undefined ? 'text-sage-300' : 'text-emerald-600'}`} />
                      <span className="flex-1 leading-snug">{question.title}</span>
                      <span className={answer === undefined || typeof answer === 'number' ? 'sr-only' : 'text-sm text-ink-muted'}>
                        {answerStatus(answer)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-6 border-t border-forest-900/10 px-6 py-3 text-sm">
        {onClear && (
          <button type="button" onClick={onClear} className={actionClass}>
            Effacer la réponse actuelle
          </button>
        )}
        {hasAnswers && (
          <>
            <button type="button" onClick={onFinish} className={actionClass}>
              Voir mon rapport
            </button>
            <button type="button" onClick={onReset} className={actionClass}>
              Tout recommencer
            </button>
          </>
        )}
        <Link to={diagnosticPaths.history} className={`inline-flex items-center ${actionClass}`}>
          Mes diagnostics
        </Link>
      </div>
    </dialog>
  )
}
