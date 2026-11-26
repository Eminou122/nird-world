import { useState, type SyntheticEvent } from 'react'

const PREFIX = 'nird-world.ouvert.'

/**
 * Remembers whether a <details> was open, for the browser tab (sessionStorage), so that coming back from another page
 * finds the reader where they left. Without a key it behaves like a plain <details>.
 */
export function useRememberedOpen(key: string | undefined, defaultOpen = false) {
  const [initial] = useState(() => {
    if (!key) return defaultOpen
    try {
      const stored = sessionStorage.getItem(PREFIX + key)
      return stored === null ? defaultOpen : stored === '1'
    } catch {
      return defaultOpen
    }
  })

  const onToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (!key) return
    try {
      sessionStorage.setItem(PREFIX + key, event.currentTarget.open ? '1' : '0')
    } catch {
      // Private mode or full storage: the section simply starts closed next time.
    }
  }

  return { open: initial, onToggle }
}
