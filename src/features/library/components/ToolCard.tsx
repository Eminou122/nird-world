import { Link } from 'react-router'
import { platformLabels } from '../data/categories'
import { libraryPaths } from '../paths'
import type { Tool } from '../types/library'
import { CompareToggle } from './CompareToggle'
import { ToolCover } from './visuals'

export const platformSummary = (tool: Tool) => {
  const native = tool.platforms.filter((platform) => platform !== 'navigateur').map((platform) => platformLabels[platform])
  const inBrowser = tool.platforms.includes('navigateur')
  if (native.length === 0) return 'Dans le navigateur, sans rien installer'
  return inBrowser ? `Navigateur, ${native.join(', ')}` : native.join(', ')
}

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="group relative flex h-full gap-4 rounded-2xl bg-ivory-50 p-4 ring-1 ring-forest-900/8 transition duration-200 hover:shadow-soft hover:ring-emerald-600/40 sm:p-5">
      <ToolCover tool={tool} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-xl leading-tight font-medium text-forest-900">
          <Link to={libraryPaths.tool(tool.id)} className="rounded after:absolute after:inset-0 after:rounded-2xl group-hover:text-emerald-700">
            {tool.name}
          </Link>
        </h3>
        <p className="mt-1 leading-snug text-forest-900">{tool.purpose}</p>
        <p className="mt-1.5 text-sm text-ink-muted">{platformSummary(tool)}</p>
        <div className="relative z-10 mt-auto pt-3">
          <CompareToggle tool={tool} compact />
        </div>
      </div>
    </article>
  )
}
