import { categories } from '../data/categories.ts'
import type { CategoryId, Platform, Tool } from '../types/library.ts'

export interface Filters {
  query: string
  category: CategoryId | null
  platform: Platform | null
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')

/** Accent-free words, plural "s"/"x" removed so that "vidéos" finds "vidéo". */
export function words(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((word) => (word.length > 3 ? word.replace(/[sx]$/, '') : word))
}

/**
 * Words that carry no meaning in "je veux faire une affiche pour ma classe", or that only say "instead of"
 * ("remplacer Word", "alternative à Zoom"). Same normalisation as the query.
 */
const STOP_WORDS = new Set(
  words(
    'a ai au aux avec ce ces comment dans de des du en et faire fait il je l la le les leur ma mes mon nos notre nous on ou par pour qu que quel quelle sa sans ses son sur un une utiliser veux voudrais vos votre vous y remplacer remplacement alternative equivalent autre logiciel outil',
  ),
)

const queryWords = (query: string) => {
  const all = words(query)
  const meaningful = all.filter((word) => !STOP_WORDS.has(word))
  return meaningful.length > 0 ? meaningful : all
}

const categoryTitle = (id: CategoryId) => categories.find((category) => category.id === id)?.title ?? ''

/** Points for one query word. A whole word beats the start of one, and the name beats the description. Zero = no match. */
function scoreWord(tool: Tool, word: string): number {
  const exact = (text: string) => words(text).includes(word)
  const starts = (text: string) => words(text).some((candidate) => candidate.startsWith(word))
  const known = [...tool.insteadOf, ...tool.keywords]
  if (exact(tool.name)) return 10
  if (known.some(exact)) return 8
  if (starts(tool.name)) return 6
  if (known.some(starts)) return 4
  if (starts(tool.purpose) || tool.useCases.some(starts)) return 3
  if (starts(tool.summary) || tool.categories.some((id) => starts(categoryTitle(id)))) return 1
  return 0
}

/** A tool used in a browser also works on a computer, whatever its system. */
export function runsOn(tool: Tool, platform: Platform): boolean {
  if (tool.platforms.includes(platform)) return true
  const isComputer = platform === 'windows' || platform === 'macos' || platform === 'linux'
  return isComputer && tool.platforms.includes('navigateur')
}

/** Every query word must match. Best matches first; without a query, the catalogue order is kept. */
export function searchTools(tools: readonly Tool[], { query, category, platform }: Filters): Tool[] {
  const wanted = queryWords(query)
  return tools
    .filter((tool) => (!category || tool.categories.includes(category)) && (!platform || runsOn(tool, platform)))
    .map((tool) => {
      const scores = wanted.map((word) => scoreWord(tool, word))
      return { tool, score: scores.includes(0) ? -1 : scores.reduce((sum, score) => sum + score, 0) }
    })
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ tool }) => tool)
}
