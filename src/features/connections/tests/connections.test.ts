import assert from 'node:assert/strict'
import { test } from 'node:test'
import { questions } from '../../diagnostic/data/questions.ts'
import { analyse } from '../../diagnostic/engine/analysis.ts'
import { buildRecommendations } from '../../diagnostic/engine/recommendationEngine.ts'
import { computeResult } from '../../diagnostic/engine/scoring.ts'
import { parseStore } from '../../diagnostic/services/storage.ts'
import type { Recommendation } from '../../diagnostic/types/diagnostic.ts'
import { getTool } from '../../library/data/software.ts'
import { libraryPaths } from '../../library/paths.ts'
import { practicesHelpedBy, readReturnTo, suggestionsFor, toolsForReport } from '../suggest.ts'
import { toolSuggestions, type ToolSuggestion } from '../toolSuggestions.ts'

const allAt = (level: 0 | 1 | 2 | 3 | 4) => Object.fromEntries(questions.map((q) => [q.id, level]))
const recommendationsFor = (answers: Record<string, unknown>) => buildRecommendations(answers)
const actionFor = (questionId: string) =>
  recommendationsFor({ ...allAt(4), [questionId]: 0 }).find((r) => r.questionId === questionId)!

test('1. every practice is mapped, and every mapped tool exists in the catalogue', () => {
  assert.deepEqual(Object.keys(toolSuggestions).sort(), questions.map((q) => q.id).sort())
  for (const [questionId, suggestions] of Object.entries(toolSuggestions)) {
    for (const suggestion of suggestions) {
      assert.ok(getTool(suggestion.toolId), `${questionId} → ${suggestion.toolId}`)
      for (const text of [suggestion.why, suggestion.helps, suggestion.suitsIf, suggestion.lessIf]) assert.ok(text.length > 15, questionId)
    }
  }
})

test('2. one weakness can lead to several tools', () => {
  assert.deepEqual(
    suggestionsFor(actionFor('ll-postes')).map((s) => s.tool.id),
    ['libreoffice', 'firefox'],
  )
  assert.deepEqual(
    suggestionsFor(actionFor('ll-bureautique')).map((s) => s.tool.id),
    ['libreoffice', 'cryptpad'],
  )
})

test('3. a weakness without a fitting tool gets none, but keeps its recommendation', () => {
  const backup = actionFor('sd-sauvegardes')
  assert.equal(backup.kind, 'action')
  assert.deepEqual(suggestionsFor(backup), [])
  for (const questionId of ['sd-hebergement', 'dm-cycle', 'an-assistance', 'gn-politique']) {
    assert.deepEqual(suggestionsFor(actionFor(questionId)), [], questionId)
  }
})

test('4. a report never lists the same tool twice', () => {
  const tools = toolsForReport(recommendationsFor(allAt(0)))
  const ids = tools.map((entry) => entry.tool.id)
  assert.equal(new Set(ids).size, ids.length)
  const libreoffice = tools.find((entry) => entry.tool.id === 'libreoffice')!
  assert.deepEqual(
    libreoffice.reasons.map((reason) => reason.recommendation.questionId).sort(),
    ['ll-bureautique', 'll-formats', 'll-postes'],
  )
})

test('5. links point to the existing tool pages', () => {
  for (const { tool } of toolsForReport(recommendationsFor(allAt(0)))) {
    assert.equal(libraryPaths.tool(tool.id), `/village/bibliotheque/outils/${tool.id}`)
    assert.ok(getTool(tool.id))
  }
})

test('6. unknown practices and unknown tool ids are skipped safely', () => {
  const fake = { ...actionFor('sd-acces'), questionId: 'pratique-inconnue' } as Recommendation
  assert.deepEqual(suggestionsFor(fake), [])

  const list = toolSuggestions['sd-acces'] as ToolSuggestion[]
  const extra = { toolId: 'logiciel-inconnu', why: 'x', helps: 'x', suitsIf: 'x', lessIf: 'x' }
  list.push(extra, { ...list[0]! })
  try {
    assert.deepEqual(
      suggestionsFor(actionFor('sd-acces')).map((s) => s.tool.id),
      ['keepassxc'],
    )
  } finally {
    list.splice(-2, 2)
  }
})

test('only confirmed weaknesses get tools: "Je ne sais pas" and strong practices do not', () => {
  const gap = recommendationsFor({ ...allAt(4), 'll-postes': 'unknown' })
  assert.equal(gap[0]!.kind, 'investigation')
  assert.deepEqual(suggestionsFor(gap[0]!), [])
  assert.deepEqual(toolsForReport(recommendationsFor(allAt(3))), [])
  assert.deepEqual(toolsForReport(recommendationsFor({})), [])
  assert.deepEqual(toolsForReport(recommendationsFor(Object.fromEntries(questions.map((q) => [q.id, 'na'])))), [])
})

test('7. suggestions read the diagnostic without changing answers, scores or recommendations', () => {
  const answers = Object.freeze({ ...allAt(1), 'll-formats': 'na', 'sd-acces': 'unknown', 'gn-achats': 2 })
  const result = computeResult(answers)
  const recommendations = buildRecommendations(answers)
  const before = JSON.stringify({ result, recommendations, analysis: analyse(answers, result) })

  for (const recommendation of recommendations) Object.freeze(recommendation)
  toolsForReport(recommendations)
  recommendations.forEach(suggestionsFor)

  assert.equal(JSON.stringify({ result, recommendations, analysis: analyse(answers, result) }), before)
  assert.equal(JSON.stringify(computeResult(answers)), JSON.stringify(result))
  // By hand: four topics at 25, governance at (1+2+1+1)/16 = 31.25 → mean 26.25 → 26.
  assert.equal(result.overall, 26)
})

test('8. a report saved before this mission loads and gets its suggestions', () => {
  // Shape written by Mission 002 and 002.5 (schema version 1).
  const saved = JSON.stringify({
    version: 1,
    activeId: 'm2',
    assessments: [
      {
        id: 'm2',
        institutionName: 'Lycée des Tilleuls',
        institutionType: 'lycee',
        answers: { ...allAt(3), 'll-postes': 0, 'sd-sauvegardes': 1, 'an-equipements': 'unknown' },
        currentIndex: 19,
        createdAt: '2026-11-20T09:00:00.000Z',
        updatedAt: '2026-11-20T09:30:00.000Z',
        completedAt: '2026-11-20T09:30:00.000Z',
      },
    ],
  })
  const { store, status } = parseStore(saved)
  assert.equal(status, 'ok')
  const tools = toolsForReport(buildRecommendations(store.assessments[0]!.answers))
  assert.deepEqual(
    tools.map((entry) => entry.tool.id),
    ['libreoffice', 'firefox'],
  )
})

test('tool pages know which practices they help with', () => {
  assert.deepEqual(
    practicesHelpedBy('libreoffice').map((q) => q.id),
    ['ll-postes', 'll-bureautique', 'll-formats'],
  )
  assert.deepEqual(practicesHelpedBy('gimp'), [])
  assert.deepEqual(practicesHelpedBy('inconnu'), [])
})

test('the way back only ever leads to a diagnostic report', () => {
  const ok = { returnTo: { to: '/village/ecole/diagnostic/resultats/abc-123', label: 'Retour à votre rapport' } }
  assert.deepEqual(readReturnTo(ok), ok.returnTo)
  for (const state of [null, undefined, 'x', {}, { returnTo: null }, { returnTo: { to: 'https://exemple.com', label: 'x' } }, { returnTo: { to: '/village', label: 'x' } }]) {
    assert.equal(readReturnTo(state), null)
  }
})
