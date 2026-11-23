import assert from 'node:assert/strict'
import { test } from 'node:test'
import { questions } from '../data/questions.ts'
import { recommendationTemplates } from '../data/recommendations.ts'
import { analyse } from '../engine/analysis.ts'
import { buildRecommendations, buildRoadmap, priorityFor } from '../engine/recommendationEngine.ts'
import { computeResult } from '../engine/scoring.ts'

const allAt = (level: 0 | 1 | 2 | 3 | 4) => Object.fromEntries(questions.map((q) => [q.id, level]))

test('every question has a complete recommendation template', () => {
  for (const question of questions) {
    const template = recommendationTemplates[question.id]
    assert.ok(template.title && template.description && template.benefit && template.investigate, question.id)
    assert.ok(template.steps.length >= 3, question.id)
  }
})

test('9. recommendations correspond to the actual weak answers', () => {
  const answers = { ...allAt(4), 'sd-sauvegardes': 0, 'll-formats': 2, 'dm-cycle': 3 }
  const recommendations = buildRecommendations(answers)

  assert.deepEqual(
    recommendations.map((r) => r.questionId).sort(),
    ['ll-formats', 'sd-sauvegardes'],
  )
  const backup = recommendations.find((r) => r.questionId === 'sd-sauvegardes')!
  assert.equal(backup.kind, 'action')
  assert.equal(backup.title, 'Mettre en place une stratégie de sauvegarde')
  assert.equal(backup.observation, questions.find((q) => q.id === 'sd-sauvegardes')!.levels[0])
  assert.equal(backup.priority, 'haute')
  assert.equal(recommendations[0], backup, 'highest priority first')
})

test('strong, non-applicable and unanswered practices produce no recommendation', () => {
  assert.deepEqual(buildRecommendations(allAt(3)), [])
  assert.deepEqual(buildRecommendations(allAt(4)), [])
  assert.deepEqual(buildRecommendations(Object.fromEntries(questions.map((q) => [q.id, 'na']))), [])
  assert.deepEqual(buildRecommendations({}), [])
})

test('10. "Je ne sais pas" produces information-gap guidance, not a weakness', () => {
  const recommendations = buildRecommendations({ ...allAt(4), 'sd-sauvegardes': 'unknown' })
  assert.equal(recommendations.length, 1)
  const [gap] = recommendations
  assert.equal(gap!.kind, 'investigation')
  assert.equal(gap!.level, null)
  assert.notEqual(gap!.title, recommendationTemplates['sd-sauvegardes'].title)
  assert.match(gap!.description, /pas d’un constat de faiblesse/)
  assert.ok(gap!.steps.includes(recommendationTemplates['sd-sauvegardes'].investigate))
  assert.equal(gap!.horizon, 'immediat')

  const analysis = analyse({ 'sd-sauvegardes': 'unknown' }, computeResult({ 'sd-sauvegardes': 'unknown' }))
  assert.deepEqual(analysis.weaknesses, [])
  assert.deepEqual(
    analysis.informationGaps.map((q) => q.id),
    ['sd-sauvegardes'],
  )
})

test('recommendations are never duplicated', () => {
  const mixed = Object.fromEntries(questions.map((q, i) => [q.id, i % 2 ? 'unknown' : 0]))
  const ids = buildRecommendations(mixed).map((r) => r.id)
  assert.equal(ids.length, 20)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(new Set(buildRecommendations(mixed).map((r) => r.questionId)).size, 20)
})

test('priority grows with the gap and the seriousness of the practice', () => {
  assert.equal(priorityFor(0, 3), 'haute') // e.g. no backups at all
  assert.equal(priorityFor(1, 3), 'haute')
  assert.equal(priorityFor(0, 2), 'moyenne')
  assert.equal(priorityFor(2, 3), 'moyenne')
  assert.equal(priorityFor(2, 2), 'basse')
  assert.equal(priorityFor(0, 1), 'basse')
  assert.equal(priorityFor(2, 1), 'basse')
})

test('the roadmap places every recommendation exactly once', () => {
  const recommendations = buildRecommendations({ ...allAt(1), 'll-formats': 2, 'gn-evaluation': 'unknown' })
  const roadmap = buildRoadmap(recommendations)
  const placed = [...roadmap.immediat, ...roadmap['moyen-terme'], ...roadmap['long-terme']]
  assert.equal(placed.length, recommendations.length)
  assert.ok(roadmap.immediat.some((r) => r.questionId === 'gn-evaluation'))
  assert.ok(roadmap['long-terme'].some((r) => r.questionId === 'll-formats'))
})

test('analysis separates strongest and weakest dimensions', () => {
  const answers = {
    ...allAt(2),
    'll-postes': 4, 'll-bureautique': 4, 'll-plateformes': 4, 'll-formats': 4, // 100
    'gn-politique': 0, 'gn-achats': 0, 'gn-formation': 0, 'gn-evaluation': 0, // 0
  }
  const analysis = analyse(answers, computeResult(answers))
  assert.equal(analysis.balanced, false)
  assert.equal(analysis.strongest[0]?.dimension, 'logiciels-libres')
  assert.equal(analysis.weakest[0]?.dimension, 'gouvernance')
  assert.ok(analysis.strongest.every((d) => !analysis.weakest.includes(d)))

  const flat = analyse(allAt(2), computeResult(allAt(2)))
  assert.equal(flat.balanced, true)
  assert.deepEqual([flat.strongest, flat.weakest], [[], []])
})
