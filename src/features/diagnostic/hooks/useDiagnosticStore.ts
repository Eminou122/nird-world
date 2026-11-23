import { useSyncExternalStore } from 'react'
import { questions } from '../data/questions'
import {
  MAX_NAME_LENGTH,
  STORAGE_KEY,
  browserStorage,
  loadStore,
  parseStore,
  saveStore,
  type DiagnosticStore,
  type LoadStatus,
} from '../services/storage'
import type { Answer, Assessment, InstitutionType } from '../types/diagnostic'

/** One shared store for every diagnostic page, persisted to LocalStorage on each change. */
const storage = browserStorage()
const initial = loadStore(storage)
let state: DiagnosticStore = initial.store
let persisted = storage !== null
export const loadStatus: LoadStatus = initial.status

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

function commit(next: DiagnosticStore) {
  state = next
  persisted = saveStore(storage, next)
  notify()
}

// Keep several open tabs in sync instead of letting one overwrite the other.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    state = parseStore(event.newValue).store
    notify()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useDiagnosticStore(): DiagnosticStore {
  return useSyncExternalStore(subscribe, () => state)
}

/** False when the browser refuses LocalStorage: answers then only last for the current visit. */
export const isPersisted = () => persisted

const now = () => new Date().toISOString()

function update(id: string, change: (assessment: Assessment) => Partial<Assessment>) {
  commit({
    ...state,
    assessments: state.assessments.map((assessment) =>
      assessment.id === id ? { ...assessment, ...change(assessment), updatedAt: now() } : assessment,
    ),
  })
}

export const diagnosticActions = {
  /** Creates a new assessment and makes it the active one. Earlier assessments stay in the history. */
  start(institutionName: string, institutionType: InstitutionType | null): string {
    const timestamp = now()
    const assessment: Assessment = {
      id: crypto.randomUUID(),
      institutionName: institutionName.trim().slice(0, MAX_NAME_LENGTH),
      institutionType,
      answers: {},
      currentIndex: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null,
    }
    commit({ ...state, activeId: assessment.id, assessments: [assessment, ...state.assessments] })
    return assessment.id
  },

  /** `null` clears the answer (the question becomes unanswered again). */
  answer(id: string, questionId: string, answer: Answer | null) {
    update(id, ({ answers }) => {
      const next = { ...answers }
      if (answer === null) delete next[questionId]
      else next[questionId] = answer
      return { answers: next }
    })
  },

  goTo(id: string, index: number) {
    update(id, () => ({ currentIndex: Math.min(Math.max(index, 0), questions.length - 1) }))
  },

  /** Makes an assessment the one shown by the questionnaire (resume, or review answers from a report). */
  open(id: string, index?: number) {
    commit({ ...state, activeId: id })
    if (index !== undefined) diagnosticActions.goTo(id, index)
  },

  markCompleted(id: string) {
    update(id, (assessment) => ({ completedAt: assessment.completedAt ?? now() }))
  },

  reset(id: string) {
    update(id, () => ({ answers: {}, currentIndex: 0, completedAt: null }))
  },

  remove(id: string) {
    commit({
      ...state,
      activeId: state.activeId === id ? null : state.activeId,
      assessments: state.assessments.filter((assessment) => assessment.id !== id),
    })
  },
}
