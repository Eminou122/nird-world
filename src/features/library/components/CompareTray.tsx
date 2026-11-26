import { X } from 'lucide-react'
import { ButtonLink } from '../../../components/ui/ButtonLink'
import { getTool } from '../data/software'
import { comparisonActions, useComparison } from '../hooks/useComparison'
import { libraryPaths } from '../paths'
import { MIN_COMPARED } from '../services/comparison'

/** Sticks to the bottom of the page while tools are waiting to be compared. */
export function CompareTray() {
  const selection = useComparison()
  if (selection.length === 0) return null
  const names = selection.map((id) => getTool(id)?.name).filter(Boolean)
  const ready = selection.length >= MIN_COMPARED

  return (
    <div className="sticky bottom-0 z-20 border-t border-forest-900/10 bg-ivory-50/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:px-8">
        <p aria-live="polite" className="min-w-0 flex-1 text-sm text-ink-muted">
          <span className="font-semibold text-forest-900">À comparer&nbsp;:</span> {names.join(', ')}
          {!ready && <span className="block sm:inline"> · choisissez encore un outil</span>}
        </p>
        <button
          type="button"
          onClick={comparisonActions.clear}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-ink-muted hover:text-forest-900"
        >
          <X aria-hidden="true" className="size-4" /> Vider
        </button>
        {ready && (
          <ButtonLink to={libraryPaths.compare(selection)} variant="dark">
            Comparer
          </ButtonLink>
        )}
      </div>
    </div>
  )
}
