import type { CategoryId } from './types/library'

export const libraryPaths = {
  home: '/village/bibliotheque',
  category: (id: CategoryId) => `/village/bibliotheque?besoin=${id}`,
  tool: (id: string) => `/village/bibliotheque/outils/${id}`,
  compare: (ids: readonly string[] = []) =>
    ids.length > 0 ? `/village/bibliotheque/comparer?outils=${ids.join(',')}` : '/village/bibliotheque/comparer',
} as const
