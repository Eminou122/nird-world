import { getQuestion, type QuestionId } from '../diagnostic/data/questions.ts'
import type { Question, Recommendation } from '../diagnostic/types/diagnostic.ts'
import { getTool } from '../library/data/software.ts'
import type { Tool } from '../library/types/library.ts'
import { toolSuggestions, type ToolSuggestion } from './toolSuggestions.ts'

/** Reads the existing diagnostic output; never changes it. */

export interface ResolvedSuggestion extends ToolSuggestion {
  tool: Tool
}

const isQuestionId = (id: string): id is QuestionId => Object.hasOwn(toolSuggestions, id)

/** Tools for one practice. Unknown tool ids are skipped, duplicates removed. */
function resolve(questionId: string): ResolvedSuggestion[] {
  if (!isQuestionId(questionId)) return []
  const seen = new Set<string>()
  return toolSuggestions[questionId].flatMap((suggestion) => {
    const tool = getTool(suggestion.toolId)
    if (!tool || seen.has(tool.id)) return []
    seen.add(tool.id)
    return [{ ...suggestion, tool }]
  })
}

/**
 * Tools for one recommendation. Only confirmed weaknesses ("action") get tools: a "Je ne sais pas" calls for finding
 * out, not for a new tool. Unanswered and "Non applicable" questions produce no recommendation in the first place.
 */
export function suggestionsFor(recommendation: Recommendation): ResolvedSuggestion[] {
  return recommendation.kind === 'action' ? resolve(recommendation.questionId) : []
}

export interface ToolInReport {
  tool: Tool
  /** Each recommendation of the report this tool relates to, in report order. */
  reasons: { recommendation: Recommendation; suggestion: ResolvedSuggestion }[]
}

/** Every suggested tool once, in the order of the recommendations that call for it (most urgent first). */
export function toolsForReport(recommendations: readonly Recommendation[]): ToolInReport[] {
  const byTool = new Map<string, ToolInReport>()
  for (const recommendation of recommendations) {
    for (const suggestion of suggestionsFor(recommendation)) {
      const entry = byTool.get(suggestion.tool.id) ?? { tool: suggestion.tool, reasons: [] }
      entry.reasons.push({ recommendation, suggestion })
      byTool.set(suggestion.tool.id, entry)
    }
  }
  return [...byTool.values()]
}

/** The other direction: diagnostic practices a tool can help with. */
export function practicesHelpedBy(toolId: string): Question[] {
  return (Object.keys(toolSuggestions) as QuestionId[])
    .filter((questionId) => toolSuggestions[questionId].some((suggestion) => suggestion.toolId === toolId))
    .flatMap((questionId) => {
      const question = getQuestion(questionId)
      return question ? [question] : []
    })
}

/** Where a tool link from the report leads back to. Only report addresses are accepted. */
export interface ReturnTo {
  to: string
  label: string
}

export function readReturnTo(state: unknown): ReturnTo | null {
  if (typeof state !== 'object' || state === null || !('returnTo' in state)) return null
  const value = (state as { returnTo: unknown }).returnTo
  if (typeof value !== 'object' || value === null) return null
  const { to, label } = value as Record<string, unknown>
  return typeof to === 'string' && typeof label === 'string' && /^\/village\/ecole\/diagnostic\/resultats\/[\w-]+$/.test(to)
    ? { to, label }
    : null
}
