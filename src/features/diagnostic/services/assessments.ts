import { questions } from '../data/questions.ts'
import type { Answer, Assessment, InstitutionType } from '../types/diagnostic.ts'
import { MAX_NAME_LENGTH, type DiagnosticStore } from './storage.ts'

/**
 * Every change the diagnostic makes to its saved data, as pure functions: same input, same output, no storage.
 * The React store (hooks/useDiagnosticStore.ts) applies them and saves the result. Kept apart so they can be tested.
 */

function update(store: DiagnosticStore, id: string, now: string, change: (assessment: Assessment) => Partial<Assessment>): DiagnosticStore {
  return {
    ...store,
    assessments: store.assessments.map((assessment) =>
      assessment.id === id ? { ...assessment, ...change(assessment), updatedAt: now } : assessment,
    ),
  }
}

/** Creates a new assessment and makes it the active one. Earlier assessments stay in the history. */
export function startAssessment(
  store: DiagnosticStore,
  input: { id: string; now: string; institutionName: string; institutionType: InstitutionType | null },
): DiagnosticStore {
  const assessment: Assessment = {
    id: input.id,
    institutionName: input.institutionName.trim().slice(0, MAX_NAME_LENGTH),
    institutionType: input.institutionType,
    answers: {},
    currentIndex: 0,
    createdAt: input.now,
    updatedAt: input.now,
    completedAt: null,
  }
  return { ...store, activeId: assessment.id, assessments: [assessment, ...store.assessments] }
}

/** `null` clears the answer (the question becomes unanswered again). */
export const setAnswer = (store: DiagnosticStore, id: string, questionId: string, answer: Answer | null, now: string) =>
  update(store, id, now, ({ answers }) => {
    const next = { ...answers }
    if (answer === null) delete next[questionId]
    else next[questionId] = answer
    return { answers: next }
  })

export const goToQuestion = (store: DiagnosticStore, id: string, index: number, now: string) =>
  update(store, id, now, () => ({ currentIndex: Math.min(Math.max(index, 0), questions.length - 1) }))

/** Makes an assessment the one shown by the questionnaire (resume, or review answers from a report). */
export const openAssessment = (store: DiagnosticStore, id: string): DiagnosticStore => ({ ...store, activeId: id })

export const markCompleted = (store: DiagnosticStore, id: string, now: string) =>
  update(store, id, now, (assessment) => ({ completedAt: assessment.completedAt ?? now }))

export const resetAnswers = (store: DiagnosticStore, id: string, now: string) =>
  update(store, id, now, () => ({ answers: {}, currentIndex: 0, completedAt: null }))

export const removeAssessment = (store: DiagnosticStore, id: string): DiagnosticStore => ({
  ...store,
  activeId: store.activeId === id ? null : store.activeId,
  assessments: store.assessments.filter((assessment) => assessment.id !== id),
})
