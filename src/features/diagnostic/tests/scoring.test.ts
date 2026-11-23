import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dimensions, questions, questionsOf } from '../data/questions.ts'
import { averageScores, bandFor, computeResult, scoreAnswers } from '../engine/scoring.ts'
import type { Answer, DimensionId } from '../types/diagnostic.ts'

/** Builds an answers object giving each dimension's four questions the listed answers. */
function answersFor(byDimension: Partial<Record<DimensionId, readonly (Answer | undefined)[]>>) {
  const answers: Record<string, Answer> = {}
  for (const [dimension, values] of Object.entries(byDimension)) {
    questionsOf(dimension as DimensionId).forEach((question, i) => {
      const value = values[i]
      if (value !== undefined) answers[question.id] = value
    })
  }
  return answers
}

const allDimensions = (values: readonly Answer[]) =>
  answersFor(Object.fromEntries(dimensions.map((d) => [d.id, values])))

test('the questionnaire has 20 questions, four per dimension', () => {
  assert.equal(questions.length, 20)
  for (const dimension of dimensions) assert.equal(questionsOf(dimension.id).length, 4)
  assert.equal(new Set(questions.map((q) => q.id)).size, 20)
  for (const question of questions) assert.equal(new Set(question.levels).size, 5, `${question.id} has 5 distinct levels`)
})

test('1. four answers of 0 score 0', () => {
  assert.equal(scoreAnswers([0, 0, 0, 0]).score, 0)
})

test('2. four answers of 4 score 100', () => {
  assert.equal(scoreAnswers([4, 4, 4, 4]).score, 100)
})

test('3. two answers of 4 and two of 0 score 50', () => {
  assert.equal(scoreAnswers([4, 0, 4, 0]).score, 50)
})

test('4. non-applicable answers are excluded from the denominator', () => {
  const result = scoreAnswers([4, 4, 4, 'na'])
  assert.equal(result.score, 100) // 12 / (4 × 3), not 12 / 16
  assert.equal(result.na, 1)
  assert.equal(result.scored, 3)
})

test('5. unknown answers are not scored', () => {
  const result = scoreAnswers([4, 0, 4, 'unknown'])
  assert.equal(result.score, 67) // 8 / 12 = 66.67 → 67, not 8 / 16 = 50
  assert.equal(result.unknown, 1)
})

test('6. a dimension with fewer than three scored answers is invalid', () => {
  for (const values of [[4, 4, 'unknown', 'na'], [4, 4], [], [4, 'na', 'na', 'na']] as const) {
    const result = scoreAnswers(values)
    assert.equal(result.valid, false)
    assert.equal(result.score, null)
  }
})

test('7. an incomplete dimension prevents an overall score', () => {
  const answers = allDimensions([4, 4, 4, 4])
  delete answers[questionsOf('gouvernance')[0]!.id]
  delete answers[questionsOf('gouvernance')[1]!.id]
  const result = computeResult(answers)
  assert.equal(result.valid, false)
  assert.equal(result.overall, null)
  assert.equal(result.band, null)
  assert.equal(result.dimensions.find((d) => d.dimension === 'gouvernance')?.valid, false)
})

test('8. five valid dimension scores are averaged', () => {
  const result = computeResult(
    answersFor({
      'logiciels-libres': [0, 0, 0, 0], // 0
      'souverainete-donnees': [1, 1, 1, 1], // 25
      'durabilite-materielle': [2, 2, 2, 2], // 50
      accessibilite: [3, 3, 3, 3], // 75
      gouvernance: [4, 4, 4, 'na'], // 100
    }),
  )
  assert.equal(result.valid, true)
  assert.deepEqual(
    result.dimensions.map((d) => d.score),
    [0, 25, 50, 75, 100],
  )
  assert.equal(result.overall, 50)
  assert.equal(result.band?.label, 'En développement')
})

test('overall uses unrounded dimension scores and rounds once', () => {
  // Each dimension: [4, 0, 4, unknown] = 66.67, so the overall is 66.67 → 67
  assert.equal(computeResult(allDimensions([4, 0, 4, 'unknown'])).overall, 67)
  assert.equal(averageScores([]), null)
  assert.equal(averageScores([10, 20]), 15)
})

test('coverage counts each kind of response', () => {
  const answers = allDimensions([4, 'unknown', 'na', 2])
  const { coverage } = computeResult(answers)
  assert.deepEqual(coverage, { total: 20, scored: 10, unknown: 5, na: 5, unanswered: 0, percent: 67 })
})

test('empty, null and invalid answers are handled safely', () => {
  for (const input of [{}, null, undefined, { 'll-postes': 7, 'll-formats': 'peut-être', 'sd-acces': -1 }]) {
    const result = computeResult(input as Record<string, unknown>)
    assert.equal(result.valid, false)
    assert.equal(result.overall, null)
    assert.equal(result.coverage.scored, 0)
    assert.equal(result.coverage.percent, 0)
  }
  assert.equal(computeResult({}).coverage.unanswered, 20)
})

test('maturity bands follow the published thresholds', () => {
  const cases: [number, string][] = [
    [0, 'Très faible'],
    [24, 'Très faible'],
    [25, 'Fragile'],
    [49, 'Fragile'],
    [50, 'En développement'],
    [74, 'En développement'],
    [75, 'Avancé'],
    [89, 'Avancé'],
    [90, 'Exemplaire'],
    [100, 'Exemplaire'],
  ]
  for (const [score, label] of cases) assert.equal(bandFor(score)?.label, label, `score ${score}`)
  assert.equal(bandFor(null), null)
  assert.equal(bandFor(101), null)
  assert.equal(bandFor(Number.NaN), null)
})
