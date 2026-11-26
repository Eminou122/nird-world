/** Rules of the comparison list, kept apart from React so they can be tested. */

export const MIN_COMPARED = 2
export const MAX_COMPARED = 3

/** Keeps known ids only, without duplicates, three at most. Accepts anything (URL or storage content). */
export function cleanSelection(ids: unknown, isKnown: (id: string) => boolean): string[] {
  if (!Array.isArray(ids)) return []
  return [...new Set(ids.filter((id): id is string => typeof id === 'string' && isKnown(id)))].slice(0, MAX_COMPARED)
}

/** Adds or removes one tool. Adding a fourth changes nothing. */
export function toggleSelection(selection: readonly string[], id: string): string[] {
  if (selection.includes(id)) return selection.filter((other) => other !== id)
  return selection.length >= MAX_COMPARED ? [...selection] : [...selection, id]
}
