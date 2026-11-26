import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ToolCover } from '../library/components/visuals'
import { libraryPaths } from '../library/paths'
import type { Tool } from '../library/types/library'
import type { ResolvedSuggestion, ReturnTo, ToolInReport } from './suggest'

/** Link to the existing tool page, carrying the way back to the report. */
export function ToolLink({ tool, returnTo, children, className }: { tool: Tool; returnTo: ReturnTo; children: ReactNode; className?: string }) {
  return (
    <Link to={libraryPaths.tool(tool.id)} state={{ returnTo }} className={className}>
      {children}
    </Link>
  )
}

const linkClass = 'rounded font-semibold text-emerald-700 underline-offset-4 hover:text-forest-900 hover:underline'

/** Level 2: for the next step, at most two tools, one sentence each. */
export function NextStepTools({ suggestions, returnTo }: { suggestions: readonly ResolvedSuggestion[]; returnTo: ReturnTo }) {
  if (suggestions.length === 0) return null
  return (
    <div className="mt-5">
      <p className="font-semibold text-forest-900">Des outils libres pour vous lancer</p>
      <ul className="mt-2 space-y-2">
        {suggestions.slice(0, 2).map(({ tool, why }) => (
          <li key={tool.id} className="leading-relaxed text-forest-900/85">
            <ToolLink tool={tool} returnTo={returnTo} className={linkClass}>
              {tool.name}
            </ToolLink>{' '}
            : {why}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Level 3, inside one recommendation: why each tool, when it fits, what to know. */
export function RecommendationTools({ suggestions, returnTo }: { suggestions: readonly ResolvedSuggestion[]; returnTo: ReturnTo }) {
  if (suggestions.length === 0) return null
  return (
    <div>
      <dt className="font-semibold text-forest-900">Des outils qui peuvent aider</dt>
      <dd className="mt-1">
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <li key={suggestion.tool.id}>
              <ToolLink tool={suggestion.tool} returnTo={returnTo} className={linkClass}>
                {suggestion.tool.name}
              </ToolLink>{' '}
              : {suggestion.why}
              <Fit suggestion={suggestion} />
            </li>
          ))}
        </ul>
      </dd>
    </div>
  )
}

function Fit({ suggestion }: { suggestion: ResolvedSuggestion }) {
  return (
    <span className="mt-1 block text-sm">
      <span className="block">
        <span className="font-semibold text-forest-900">Convient si</span> {suggestion.suitsIf}
      </span>
      <span className="block">
        <span className="font-semibold text-forest-900">Moins adapté si</span> {suggestion.lessIf}
      </span>
    </span>
  )
}

/** Level 2–3, the report's practical section: every suggested tool once, with the findings it answers. */
export function ReportTools({ tools, returnTo }: { tools: readonly ToolInReport[]; returnTo: ReturnTo }) {
  return (
    <>
      <p className="max-w-2xl leading-relaxed text-ink-muted">
        Ces logiciels libres répondent à des pratiques que vos réponses montrent absentes ou à développer. Aucun n’est une
        solution universelle&nbsp;: lisez ce qu’il faut savoir, et essayez d’abord avec un petit groupe.
      </p>
      <ul className="mt-6 space-y-8" data-report-tools>
        {tools.map(({ tool, reasons }) => {
          const first = reasons[0]!.suggestion
          return (
            <li key={tool.id} className="flex gap-4 break-inside-avoid sm:gap-5">
              <ToolCover tool={tool} size="sm" />
              <div className="min-w-0 flex-1 leading-relaxed text-ink-muted">
                <h4 className="font-display text-xl text-forest-900">{tool.name}</h4>
                <p className="text-forest-900">{tool.purpose}</p>
                <ul className="mt-2 space-y-1.5">
                  {reasons.map(({ recommendation, suggestion }) => (
                    <li key={recommendation.id}>
                      <span className="font-semibold text-forest-900">Pour «&nbsp;{recommendation.title}&nbsp;»&nbsp;:</span>{' '}
                      {suggestion.why}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">
                  <span className="font-semibold text-forest-900">Ce qu’il permet&nbsp;:</span> {first.helps}
                </p>
                <Fit suggestion={first} />
                <p className="mt-1 text-sm">
                  <span className="font-semibold text-forest-900">À savoir&nbsp;:</span> {tool.limitations[0]}
                </p>
                <ToolLink tool={tool} returnTo={returnTo} className={`mt-2 inline-flex min-h-11 items-center gap-1.5 ${linkClass}`}>
                  Voir la fiche de {tool.name} <ArrowRight aria-hidden="true" className="size-4" />
                </ToolLink>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
