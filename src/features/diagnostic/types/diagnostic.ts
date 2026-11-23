/** Core types of the digital independence diagnostic. Framework-free: shared by the engine, storage and UI. */

export type DimensionId =
  | 'logiciels-libres'
  | 'souverainete-donnees'
  | 'durabilite-materielle'
  | 'accessibilite'
  | 'gouvernance'

/** 0 Absent · 1 Initial · 2 En développement · 3 Établi · 4 Avancé */
export type MaturityLevel = 0 | 1 | 2 | 3 | 4

/** "Je ne sais pas" and "Non applicable": never converted to a number. */
export type SpecialAnswer = 'unknown' | 'na'

export type Answer = MaturityLevel | SpecialAnswer

export type Answers = Readonly<Partial<Record<string, Answer>>>

export interface Dimension {
  id: DimensionId
  letter: string
  name: string
  description: string
}

export interface Question {
  id: string
  dimension: DimensionId
  /** Short label of the assessed practice, used in reports. */
  title: string
  prompt: string
  /** Observable practice for each maturity level, index = level. */
  levels: readonly [string, string, string, string, string]
}

export type InstitutionType = 'ecole-primaire' | 'college' | 'lycee' | 'universite' | 'centre-formation' | 'autre'

export interface Assessment {
  id: string
  institutionName: string
  institutionType: InstitutionType | null
  answers: Answers
  /** Question the user was on, to resume after a refresh. */
  currentIndex: number
  createdAt: string
  updatedAt: string
  /** Set when the user reached the report with a valid assessment. */
  completedAt: string | null
}

export type BandId = 'tres-faible' | 'fragile' | 'en-developpement' | 'avance' | 'exemplaire'

export interface Band {
  id: BandId
  label: string
  min: number
  max: number
  description: string
}

export interface DimensionResult {
  dimension: DimensionId
  scored: number
  unknown: number
  na: number
  unanswered: number
  /** Unrounded score, used for averaging. Null when the dimension is invalid. */
  exact: number | null
  /** Rounded to the nearest integer. Null when the dimension is invalid. */
  score: number | null
  valid: boolean
}

export interface Coverage {
  total: number
  scored: number
  unknown: number
  na: number
  unanswered: number
  /** Scored answers / applicable questions (total − non applicable), as a rounded percentage. */
  percent: number
}

export interface DiagnosticResult {
  dimensions: DimensionResult[]
  valid: boolean
  overall: number | null
  band: Band | null
  coverage: Coverage
}

export type Priority = 'haute' | 'moyenne' | 'basse'
export type Horizon = 'immediat' | 'moyen-terme' | 'long-terme'

export interface RecommendationTemplate {
  title: string
  description: string
  steps: readonly string[]
  benefit: string
  /** How serious a weakness on this practice is: 3 = risk of data loss, exclusion or legal exposure. */
  impact: 1 | 2 | 3
  /** What to find out when the answer is "Je ne sais pas". */
  investigate: string
}

export interface Recommendation {
  id: string
  /** "action" = confirmed weakness; "investigation" = information gap ("Je ne sais pas"). */
  kind: 'action' | 'investigation'
  questionId: string
  dimension: DimensionId
  title: string
  description: string
  /** What the answer told us about the current situation. */
  observation: string
  level: MaturityLevel | null
  priority: Priority
  horizon: Horizon
  steps: readonly string[]
  benefit: string
}
