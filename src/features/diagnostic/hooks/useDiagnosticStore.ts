import { useSyncExternalStore } from 'react'
import {
  goToQuestion,
  markCompleted,
  openAssessment,
  removeAssessment,
  resetAnswers,
  setAnswer,
  startAssessment,
} from '../services/assessments'
import {
  STORAGE_KEY,
  browserStorage,
  loadStore,
  parseStore,
  saveStore,
  type DiagnosticStore,
  type LoadStatus,
} from '../services/storage'
import type { Answer, InstitutionType } from '../types/diagnostic'

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

export const diagnosticActions = {
  /** Creates a new assessment and makes it the active one. Earlier assessments stay in the history. */
  start(institutionName: string, institutionType: InstitutionType | null): string {
    const id = crypto.randomUUID()
    commit(startAssessment(state, { id, now: now(), institutionName, institutionType }))
    return id
  },

  /** `null` clears the answer (the question becomes unanswered again). */
  answer(id: string, questionId: string, answer: Answer | null) {
    commit(setAnswer(state, id, questionId, answer, now()))
  },

  goTo(id: string, index: number) {
    commit(goToQuestion(state, id, index, now()))
  },

  /** Makes an assessment the one shown by the questionnaire (resume, or review answers from a report). */
  open(id: string, index?: number) {
    commit(openAssessment(state, id))
    if (index !== undefined) diagnosticActions.goTo(id, index)
  },

  markCompleted(id: string) {
    commit(markCompleted(state, id, now()))
  },

  reset(id: string) {
    commit(resetAnswers(state, id, now()))
  },

  remove(id: string) {
    commit(removeAssessment(state, id))
  },
}
