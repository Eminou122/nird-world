import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  const muted = onDark ? 'text-ivory-100/65 hover:text-ivory-50' : 'text-ink-muted hover:text-forest-900'
  const current = onDark ? 'text-ivory-50' : 'text-forest-900'
  return (
    <nav aria-label="Fil d’Ariane">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 opacity-50" />}
            {item.to ? (
              <Link to={item.to} className={`rounded transition-colors ${muted}`}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={`font-medium ${current}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
