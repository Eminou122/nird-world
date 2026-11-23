import { dimensions, questions, questionsOf } from '../data/questions.ts'
import type { Answer, Band, DiagnosticResult, DimensionResult, MaturityLevel } from '../types/diagnostic.ts'

/** A dimension needs at least this many numeric answers (out of 4) to be scored. */
export const MIN_SCORED_PER_DIMENSION = 3

export const bands: readonly Band[] = [
  {
    id: 'tres-faible',
    label: 'Très faible',
    min: 0,
    max: 24,
    description:
      'Les pratiques d’indépendance numérique sont encore absentes ou très ponctuelles. Les premières actions auront un effet rapide et visible.',
  },
  {
    id: 'fragile',
    label: 'Fragile',
    min: 25,
    max: 49,
    description:
      'Des initiatives existent, mais elles reposent sur quelques personnes et restent peu formalisées. L’enjeu est de les structurer.',
  },
  {
    id: 'en-developpement',
    label: 'En développement',
    min: 50,
    max: 74,
    description:
      'L’établissement a engagé une démarche réelle. Il s’agit maintenant de la généraliser et de l’inscrire dans la durée.',
  },
  {
    id: 'avance',
    label: 'Avancé',
    min: 75,
    max: 89,
    description:
      'Les pratiques sont établies dans la plupart des domaines. Les marges de progrès portent sur la consolidation et le suivi.',
  },
  {
    id: 'exemplaire',
    label: 'Exemplaire',
    min: 90,
    max: 100,
    description:
      'L’établissement maîtrise ses choix numériques et peut partager son expérience avec d’autres structures.',
  },
]

export const isMaturityLevel = (value: unknown): value is MaturityLevel =>
  value === 0 || value === 1 || value === 2 || value === 3 || value === 4

export const isAnswer = (value: unknown): value is Answer => isMaturityLevel(value) || value === 'unknown' || value === 'na'

/** Band of a rounded score; null for anything outside 0–100. */
export function bandFor(score: number | null): Band | null {
  if (score === null || !Number.isFinite(score) || score < 0 || score > 100) return null
  return bands.find((band) => score >= band.min && score <= band.max) ?? null
}

/**
 * Scores one dimension's answers: (sum / (4 × scored answers)) × 100.
 * "Non applicable" and "Je ne sais pas" are counted but excluded from the score; anything else invalid counts as unanswered.
 */
export function scoreAnswers(values: readonly unknown[]): Omit<DimensionResult, 'dimension'> {
  let sum = 0
  let scored = 0
  let unknown = 0
  let na = 0
  let unanswered = 0
  for (const value of values) {
    if (isMaturityLevel(value)) {
      sum += value
      scored += 1
    } else if (value === 'unknown') unknown += 1
    else if (value === 'na') na += 1
    else unanswered += 1
  }
  const valid = scored >= MIN_SCORED_PER_DIMENSION
  const exact = valid ? (sum / (4 * scored)) * 100 : null
  return { scored, unknown, na, unanswered, exact, score: exact === null ? null : Math.round(exact), valid }
}

/** Arithmetic mean, rounded to the nearest integer. Null for an empty list. */
export function averageScores(scores: readonly number[]): number | null {
  if (scores.length === 0) return null
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
}

/**
 * Full result. Rounding rule: every displayed score is rounded to the nearest integer, and the overall score is the
 * mean of the unrounded dimension scores (rounded once, at the end). The overall score exists only when all five
 * dimensions are valid — a missing dimension is never counted as zero.
 */
export function computeResult(answers: Readonly<Record<string, unknown>> | null | undefined): DiagnosticResult {
  const source = answers ?? {}
  const results: DimensionResult[] = dimensions.map((dimension) => ({
    dimension: dimension.id,
    ...scoreAnswers(questionsOf(dimension.id).map((question) => source[question.id])),
  }))

  const valid = results.every((result) => result.valid)
  const overall = valid ? averageScores(results.map((result) => result.exact ?? 0)) : null

  const total = questions.length
  const sumOf = (key: 'scored' | 'unknown' | 'na' | 'unanswered') => results.reduce((n, result) => n + result[key], 0)
  const scored = sumOf('scored')
  const na = sumOf('na')
  const applicable = total - na

  return {
    dimensions: results,
    valid,
    overall,
    band: bandFor(overall),
    coverage: {
      total,
      scored,
      unknown: sumOf('unknown'),
      na,
      unanswered: sumOf('unanswered'),
      percent: applicable > 0 ? Math.round((scored / applicable) * 100) : 0,
    },
  }
}
