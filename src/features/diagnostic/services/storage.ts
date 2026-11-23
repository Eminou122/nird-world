import { institutionTypes, questions } from '../data/questions.ts'
import { isAnswer } from '../engine/scoring.ts'
import type { Answer, Assessment, InstitutionType } from '../types/diagnostic.ts'

/**
 * Versioned LocalStorage schema. Only answers and an optional institution name/type are stored —
 * no personal data, credentials or identifiers of people.
 */
export const STORAGE_KEY = 'nird-world.diagnostic'
/** Where unreadable or outdated data is copied before being replaced, so nothing is silently destroyed. */
export const BACKUP_KEY = `${STORAGE_KEY}.sauvegarde-illisible`
export const SCHEMA_VERSION = 1

export interface DiagnosticStore {
  version: typeof SCHEMA_VERSION
  activeId: string | null
  assessments: Assessment[]
}

/** `ok` = read as is; `empty` = nothing stored; `recovered` = some or all stored data was unreadable and set aside. */
export type LoadStatus = 'ok' | 'empty' | 'recovered'

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>

export const MAX_NAME_LENGTH = 120
const questionIds = new Set<string>(questions.map((question) => question.id))

export const emptyStore = (): DiagnosticStore => ({ version: SCHEMA_VERSION, activeId: null, assessments: [] })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isDateString = (value: unknown): value is string => typeof value === 'string' && !Number.isNaN(Date.parse(value))

const isInstitutionType = (value: unknown): value is InstitutionType =>
  typeof value === 'string' && Object.hasOwn(institutionTypes, value)

/** Returns a clean assessment, or null when the essentials (id, dates) are missing. Unknown answers are dropped. */
export function sanitizeAssessment(value: unknown): Assessment | null {
  if (!isRecord(value)) return null
  const { id, createdAt, updatedAt, completedAt, institutionName, institutionType, currentIndex, answers } = value
  if (typeof id !== 'string' || id.length === 0 || !isDateString(createdAt)) return null

  const cleanAnswers: Record<string, Answer> = {}
  if (isRecord(answers)) {
    for (const [questionId, answer] of Object.entries(answers)) {
      if (questionIds.has(questionId) && isAnswer(answer)) cleanAnswers[questionId] = answer
    }
  }

  const index = typeof currentIndex === 'number' && Number.isInteger(currentIndex) ? currentIndex : 0

  return {
    id,
    institutionName: typeof institutionName === 'string' ? institutionName.slice(0, MAX_NAME_LENGTH) : '',
    institutionType: isInstitutionType(institutionType) ? institutionType : null,
    answers: cleanAnswers,
    currentIndex: Math.min(Math.max(index, 0), questions.length - 1),
    createdAt,
    updatedAt: isDateString(updatedAt) ? updatedAt : createdAt,
    completedAt: isDateString(completedAt) ? completedAt : null,
  }
}

export function parseStore(raw: string | null): { store: DiagnosticStore; status: LoadStatus } {
  if (raw === null || raw === '') return { store: emptyStore(), status: 'empty' }

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { store: emptyStore(), status: 'recovered' }
  }
  // ponytail: no older schema exists yet; add migrations here when version 2 ships.
  if (!isRecord(data) || data.version !== SCHEMA_VERSION || !Array.isArray(data.assessments)) {
    return { store: emptyStore(), status: 'recovered' }
  }

  const seen = new Set<string>()
  const assessments = data.assessments.flatMap((item) => {
    const assessment = sanitizeAssessment(item)
    if (!assessment || seen.has(assessment.id)) return []
    seen.add(assessment.id)
    return [assessment]
  })
  const activeId = typeof data.activeId === 'string' && seen.has(data.activeId) ? data.activeId : null

  return {
    store: { version: SCHEMA_VERSION, activeId, assessments },
    status: assessments.length === data.assessments.length ? 'ok' : 'recovered',
  }
}

export function loadStore(storage: KeyValueStorage | null): { store: DiagnosticStore; status: LoadStatus } {
  if (!storage) return { store: emptyStore(), status: 'empty' }
  let raw: string | null = null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return { store: emptyStore(), status: 'empty' }
  }
  const result = parseStore(raw)
  if (result.status === 'recovered' && raw !== null) {
    try {
      storage.setItem(BACKUP_KEY, raw)
    } catch {
      // Quota or privacy mode: the app keeps working with what could be read.
    }
  }
  return result
}

/** Returns false when the browser refuses to store (quota, privacy mode). */
export function saveStore(storage: KeyValueStorage | null, store: DiagnosticStore): boolean {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

/** LocalStorage when usable, otherwise null (the diagnostic then works for the current visit only). */
export function browserStorage(): KeyValueStorage | null {
  try {
    const storage = globalThis.localStorage
    storage.getItem(STORAGE_KEY)
    return storage
  } catch {
    return null
  }
}
