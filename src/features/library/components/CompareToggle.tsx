import { Check, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClass } from '../../../components/ui/buttonClass'
import { comparisonActions, useComparison } from '../hooks/useComparison'
import { libraryPaths } from '../paths'
import { MAX_COMPARED } from '../services/comparison'
import type { Tool } from '../types/library'

/** Adds a tool to the comparison, or removes it. */
export function CompareToggle({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  const selection = useComparison()
  const selected = selection.includes(tool.id)
  const full = !selected && selection.length >= MAX_COMPARED
  const label = selected ? 'Ajouté à la comparaison' : full ? 'Comparaison complète (3 outils)' : 'Comparer'

  const button = (
    <button
      type="button"
      aria-pressed={selected}
      disabled={full}
      aria-label={`Comparer ${tool.name}`}
      title={full ? 'La comparaison compte déjà 3 outils' : undefined}
      onClick={() => comparisonActions.toggle(tool.id)}
      className={
        compact
          ? `inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-sm font-semibold transition-colors disabled:opacity-50 ${
              selected ? 'text-emerald-700' : 'text-ink-muted hover:text-forest-900'
            }`
          : buttonClass(selected ? 'dark' : 'outline-dark')
      }
    >
      {selected ? <Check aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
      {compact ? (selected ? 'Ajouté' : 'Comparer') : label}
    </button>
  )

  if (compact || !full) return button
  return (
    <span className="flex flex-wrap items-center gap-3">
      {button}
      <Link to={libraryPaths.compare(selection)} className="rounded text-sm font-semibold text-emerald-700 hover:text-forest-900">
        Voir la comparaison
      </Link>
    </span>
  )
}
