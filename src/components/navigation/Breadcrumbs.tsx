import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d’Ariane">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 opacity-50" />}
            {item.to ? (
              <Link to={item.to} className="rounded py-1 text-ink-muted transition-colors hover:text-forest-900">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-forest-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
