import assert from 'node:assert/strict'
import { test } from 'node:test'
import { questions } from '../data/questions.ts'
import { buildRecommendations } from '../engine/recommendationEngine.ts'
import { computeResult } from '../engine/scoring.ts'
import {
  goToQuestion,
  markCompleted,
  openAssessment,
  removeAssessment,
  resetAnswers,
  setAnswer,
  startAssessment,
} from '../services/assessments.ts'
import { emptyStore, loadStore, saveStore, type KeyValueStorage } from '../services/storage.ts'
import type { Answer } from '../types/diagnostic.ts'

const T0 = '2026-11-26T09:00:00.000Z'
const T1 = '2026-11-26T09:20:00.000Z'
const memory = (): KeyValueStorage => {
  const data = new Map<string, string>()
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => void data.set(key, value) }
}

// The pattern used in every manual check since Mission 002: 53/100, dimensions 75/25/50/92/25, 12 recommendations.
const PATTERN: Answer[] = [3, 4, 2, 'na', 0, 'unknown', 1, 2, 2, 2, 3, 1, 4, 4, 3, 'na', 1, 0, 2, 'unknown']

test('a diagnostic can be started, answered question by question, completed and reloaded', () => {
  let store = startAssessment(emptyStore(), { id: 'a1', now: T0, institutionName: '  Lycée des Tilleuls  ', institutionType: 'lycee' })
  assert.equal(store.activeId, 'a1')
  assert.equal(store.assessments[0]!.institutionName, 'Lycée des Tilleuls')

  questions.forEach((question, index) => {
    store = setAnswer(store, 'a1', question.id, PATTERN[index]!, T1)
    store = goToQuestion(store, 'a1', index + 1, T1)
  })
  assert.equal(store.assessments[0]!.currentIndex, questions.length - 1, 'never past the last question')

  const result = computeResult(store.assessments[0]!.answers)
  assert.equal(result.valid, true)
  store = markCompleted(store, 'a1', T1)
  assert.equal(store.assessments[0]!.completedAt, T1)

  const storage = memory()
  saveStore(storage, store)
  const reloaded = loadStore(storage).store
  const again = computeResult(reloaded.assessments[0]!.answers)
  assert.deepEqual(again, result)
  assert.equal(again.overall, 53)
  assert.deepEqual(
    again.dimensions.map((d) => d.score),
    [75, 25, 50, 92, 25],
  )
  assert.equal(buildRecommendations(reloaded.assessments[0]!.answers).length, 12)
})

test('completing twice keeps the first completion date', () => {
  let store = startAssessment(emptyStore(), { id: 'a1', now: T0, institutionName: '', institutionType: null })
  store = markCompleted(store, 'a1', T0)
  store = markCompleted(store, 'a1', T1)
  assert.equal(store.assessments[0]!.completedAt, T0)
})

test('clearing an answer makes the question unanswered, not zero', () => {
  let store = startAssessment(emptyStore(), { id: 'a1', now: T0, institutionName: '', institutionType: null })
  store = setAnswer(store, 'a1', 'll-postes', 0, T1)
  store = setAnswer(store, 'a1', 'll-postes', null, T1)
  assert.equal('ll-postes' in store.assessments[0]!.answers, false)
  assert.equal(computeResult(store.assessments[0]!.answers).coverage.unanswered, 20)
})

test('history: several diagnostics, resume one, delete one, reset one', () => {
  let store = startAssessment(emptyStore(), { id: 'old', now: T0, institutionName: 'A', institutionType: null })
  store = setAnswer(store, 'old', 'll-postes', 2, T0)
  store = startAssessment(store, { id: 'new', now: T1, institutionName: 'B', institutionType: null })
  assert.deepEqual(
    store.assessments.map((a) => a.id),
    ['new', 'old'],
    'newest first, the earlier one kept',
  )
  assert.equal(store.activeId, 'new')

  store = openAssessment(store, 'old')
  assert.equal(store.activeId, 'old')

  store = resetAnswers(store, 'old', T1)
  assert.deepEqual(store.assessments.find((a) => a.id === 'old')!.answers, {})

  store = removeAssessment(store, 'new')
  assert.deepEqual(
    store.assessments.map((a) => a.id),
    ['old'],
  )
  assert.equal(store.activeId, 'old', 'deleting another diagnostic keeps the active one')
  store = removeAssessment(store, 'old')
  assert.equal(store.activeId, null)
})

test('changes never touch other diagnostics', () => {
  let store = startAssessment(emptyStore(), { id: 'a', now: T0, institutionName: 'A', institutionType: null })
  store = startAssessment(store, { id: 'b', now: T0, institutionName: 'B', institutionType: null })
  const before = JSON.stringify(store.assessments.find((x) => x.id === 'a'))
  store = setAnswer(store, 'b', 'sd-acces', 4, T1)
  store = resetAnswers(store, 'b', T1)
  assert.equal(JSON.stringify(store.assessments.find((x) => x.id === 'a')), before)
})
