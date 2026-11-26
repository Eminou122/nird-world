import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRememberedOpen } from './useRememberedOpen'

interface DisclosureProps {
  /** What the reader gets by opening it. */
  title: ReactNode
  /** One short line, visible while closed. */
  hint?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  /** "row" = full-width section of a page; "inline" = a small aside next to content. */
  variant?: 'row' | 'inline'
  /** When set, the open state is kept for the browser tab, e.g. while visiting a linked page. */
  rememberAs?: string
}

/** Level 2–3 information: native <details>, so it works with the keyboard, find-in-page and without motion. */
export function Disclosure({ title, hint, children, defaultOpen = false, variant = 'row', rememberAs }: DisclosureProps) {
  const { open, onToggle } = useRememberedOpen(rememberAs, defaultOpen)
  if (variant === 'inline') {
    return (
      <details className="disclosure" open={open} onToggle={onToggle}>
        <summary className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-700 hover:text-forest-900">
          {title}
          <ChevronDown aria-hidden="true" className="disclosure__chevron size-4" />
        </summary>
        <div className="pb-2">{children}</div>
      </details>
    )
  }
  return (
    <details className="disclosure border-b border-forest-900/12" open={open} onToggle={onToggle}>
      <summary className="flex min-h-16 items-center gap-4 rounded-md py-4 text-forest-900 hover:text-emerald-700">
        <div className="flex-1">
          <h3 className="text-xl leading-snug font-normal">{title}</h3>
          {hint && <span className="mt-0.5 block text-sm text-ink-muted">{hint}</span>}
        </div>
        <ChevronDown aria-hidden="true" className="disclosure__chevron size-5 shrink-0" />
      </summary>
      <div className="pt-1 pb-8">{children}</div>
    </details>
  )
}
