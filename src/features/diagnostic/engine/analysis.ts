import { questions } from '../data/questions.ts'
import type { DiagnosticResult, DimensionResult, MaturityLevel, Question } from '../types/diagnostic.ts'
import { isMaturityLevel } from './scoring.ts'

export interface PracticeFinding {
  question: Question
  level: MaturityLevel
}

export interface Analysis {
  /** Valid dimensions scoring 50+, best first (max 2). */
  strongest: DimensionResult[]
  /** Valid dimensions scoring under 75, weakest first (max 2), never overlapping `strongest`. */
  weakest: DimensionResult[]
  /** True when all valid dimensions are within 10 points: no meaningful strongest/weakest. */
  balanced: boolean
  /** Practices answered "Établi" or "Avancé". */
  strengths: PracticeFinding[]
  /** Practices answered "Absent" or "Initial". */
  weaknesses: PracticeFinding[]
  /** Practices answered "Je ne sais pas". */
  informationGaps: Question[]
}

const BALANCED_SPREAD = 10

export function analyse(answers: Readonly<Record<string, unknown>>, result: DiagnosticResult): Analysis {
  const scored = result.dimensions
    .filter((dimension): dimension is DimensionResult & { exact: number; score: number } => dimension.exact !== null)
    .sort((a, b) => b.exact - a.exact)

  const spread = scored.length > 1 ? scored[0]!.exact - scored[scored.length - 1]!.exact : 0
  const balanced = scored.length > 1 && spread < BALANCED_SPREAD

  const strongest = balanced ? [] : scored.filter((dimension) => dimension.score >= 50).slice(0, 2)
  const weakest = balanced
    ? []
    : [...scored]
        .reverse()
        .filter((dimension) => dimension.score < 75 && !strongest.includes(dimension))
        .slice(0, 2)

  const findings = questions.flatMap((question) => {
    const level = answers[question.id]
    return isMaturityLevel(level) ? [{ question, level }] : []
  })

  return {
    strongest,
    weakest,
    balanced,
    strengths: findings.filter((finding) => finding.level >= 3),
    weaknesses: findings.filter((finding) => finding.level <= 1),
    informationGaps: questions.filter((question) => answers[question.id] === 'unknown'),
  }
}
