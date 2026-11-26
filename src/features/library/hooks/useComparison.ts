import { useSyncExternalStore } from 'react'
import { getTool } from '../data/software'
import { cleanSelection, toggleSelection } from '../services/comparison'

/** Tools picked for comparison, kept for the browser tab (sessionStorage): a draft, not data worth keeping. */
const KEY = 'nird-world.bibliotheque.comparaison'
const isKnown = (id: string) => getTool(id) !== undefined

function read(): string[] {
  try {
    return cleanSelection(JSON.parse(sessionStorage.getItem(KEY) ?? '[]'), isKnown)
  } catch {
    return []
  }
}

let selection = read()
const listeners = new Set<() => void>()

function commit(next: string[]) {
  selection = next
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Private mode or full storage: the selection simply lasts for this page.
  }
  listeners.forEach((listener) => listener())
}

export function useComparison(): readonly string[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selection,
  )
}

export const comparisonActions = {
  toggle: (id: string) => commit(toggleSelection(selection, id)),
  set: (ids: unknown) => commit(cleanSelection(ids, isKnown)),
  clear: () => commit([]),
}
