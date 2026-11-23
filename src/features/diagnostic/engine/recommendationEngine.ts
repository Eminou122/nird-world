import { questions } from '../data/questions.ts'
import { recommendationTemplates } from '../data/recommendations.ts'
import type { Horizon, MaturityLevel, Priority, Recommendation } from '../types/diagnostic.ts'
import { isMaturityLevel } from './scoring.ts'

/** Practices at or below this level get an improvement recommendation. */
export const ACTION_THRESHOLD: MaturityLevel = 2

const priorityRank: Record<Priority, number> = { haute: 0, moyenne: 1, basse: 2 }

export const horizonOf: Record<Priority, Horizon> = {
  haute: 'immediat',
  moyenne: 'moyen-terme',
  basse: 'long-terme',
}

/**
 * Priority = gap to the top level × seriousness of the practice (impact 1–3).
 * e.g. no backups at all (gap 4 × impact 3 = 12) → haute; no repair process (4 × 2 = 8) → moyenne;
 * repair "en développement" (2 × 2 = 4) → basse.
 */
export function priorityFor(level: MaturityLevel, impact: 1 | 2 | 3): Priority {
  const weight = (4 - level) * impact
  if (weight >= 9) return 'haute'
  if (weight >= 5) return 'moyenne'
  return 'basse'
}

const INVESTIGATION_DESCRIPTION =
  'Vous avez indiqué ne pas connaître la situation. Il ne s’agit pas d’un constat de faiblesse, mais d’une information à obtenir avant de décider d’une action.'

/**
 * Maps each individual answer to at most one recommendation:
 * - level 0–2 → an improvement action (confirmed weakness), with the observed practice as the finding;
 * - "Je ne sais pas" → an investigation step, never a claim that the practice is absent;
 * - level 3–4, "Non applicable" and unanswered → nothing.
 * One template per question, so recommendations cannot be duplicated.
 */
export function buildRecommendations(answers: Readonly<Record<string, unknown>>): Recommendation[] {
  const recommendations: Recommendation[] = []

  for (const question of questions) {
    const answer = answers[question.id]
    const template = recommendationTemplates[question.id]

    if (isMaturityLevel(answer) && answer <= ACTION_THRESHOLD) {
      const priority = priorityFor(answer, template.impact)
      recommendations.push({
        id: `action:${question.id}`,
        kind: 'action',
        questionId: question.id,
        dimension: question.dimension,
        title: template.title,
        description: template.description,
        observation: question.levels[answer],
        level: answer,
        priority,
        horizon: horizonOf[priority],
        steps: template.steps,
        benefit: template.benefit,
      })
    } else if (answer === 'unknown') {
      recommendations.push({
        id: `investigation:${question.id}`,
        kind: 'investigation',
        questionId: question.id,
        dimension: question.dimension,
        title: `Documenter la situation : ${question.title.charAt(0).toLowerCase()}${question.title.slice(1)}`,
        description: INVESTIGATION_DESCRIPTION,
        observation: 'Information non disponible au moment du diagnostic.',
        level: null,
        // Not knowing about a high-stakes practice (backups, access, hosting…) is itself urgent to clarify.
        priority: template.impact === 3 ? 'haute' : 'moyenne',
        horizon: 'immediat',
        steps: [
          'Identifier la personne qui détient l’information (direction, référent numérique, intendance ou collectivité).',
          template.investigate,
          'Consigner la réponse dans un document partagé avec l’équipe de direction.',
          'Mettre à jour ce diagnostic pour obtenir un résultat plus fiable.',
        ],
        benefit: 'Un diagnostic plus complet et des décisions fondées sur des faits vérifiés.',
      })
    }
  }

  // Stable sort: priority, then confirmed weaknesses before information gaps, then lowest level first.
  return recommendations.sort(
    (a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      Number(a.kind === 'investigation') - Number(b.kind === 'investigation') ||
      (a.level ?? 0) - (b.level ?? 0),
  )
}

export function buildRoadmap(recommendations: readonly Recommendation[]): Record<Horizon, Recommendation[]> {
  return {
    immediat: recommendations.filter((r) => r.horizon === 'immediat'),
    'moyen-terme': recommendations.filter((r) => r.horizon === 'moyen-terme'),
    'long-terme': recommendations.filter((r) => r.horizon === 'long-terme'),
  }
}
