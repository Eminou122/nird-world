import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { buildingPath, buildings, type Building, type BuildingSlug } from '../../data/buildings'
import { buildingArt } from './scene/buildings'
import { toPercent } from './scene/iso'
import { VILLAGE_VIEWBOX, placements } from './scene/layout'
import { VillageScene } from './scene/VillageScene'

interface VillageMapProps {
  activeSlug: BuildingSlug | null
  onActiveChange: (slug: BuildingSlug | null) => void
}

/** The interactive village: illustration plus keyboard-accessible pins with tooltips. */
export function VillageMap({ activeSlug, onActiveChange }: VillageMapProps) {
  return (
    <div className="relative">
      <VillageScene
        className="block h-auto w-full"
        label="Plan illustré du village NIRD WORLD : six lieux reliés par des allées autour d’une place centrale."
        activeSlug={activeSlug}
        onActiveChange={onActiveChange}
      />
      <ul className="pointer-events-none absolute inset-0" aria-label="Bâtiments du village">
        {buildings.map((building) => (
          <MapPin
            key={building.slug}
            building={building}
            active={activeSlug === building.slug}
            onActiveChange={onActiveChange}
          />
        ))}
      </ul>
    </div>
  )
}

interface MapPinProps {
  building: Building
  active: boolean
  onActiveChange: (slug: BuildingSlug | null) => void
}

function MapPin({ building, active, onActiveChange }: MapPinProps) {
  const { slug, number, name, theme, summary } = building
  const { w, d, h } = buildingArt[slug]
  const { x, y } = placements[slug]
  const { left, top } = toPercent(VILLAGE_VIEWBOX, x + w / 2, y + d / 2, h + 0.2)
  const tooltipId = `village-tooltip-${slug}`

  // Keep tooltips inside the map: beside the pin near the top edge, otherwise above it.
  const placement =
    top < 25
      ? 'left-full top-1/2 ml-3 -translate-y-1/2'
      : left < 28
        ? 'bottom-full left-0 mb-3'
        : left > 72
          ? 'bottom-full right-0 mb-3'
          : 'bottom-full left-1/2 mb-3 -translate-x-1/2'

  const activate = () => onActiveChange(slug)
  const deactivate = () => onActiveChange(null)

  return (
    <li className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
      <div className="relative flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <Link
          to={buildingPath(slug)}
          aria-describedby={tooltipId}
          onPointerEnter={activate}
          onPointerLeave={deactivate}
          onFocus={activate}
          onBlur={deactivate}
          className={`pointer-events-auto inline-flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-full border p-1 text-sm font-semibold shadow-soft transition-colors duration-200 sm:pr-3.5 ${
            active
              ? 'border-gold-400 bg-gold-400 text-forest-900'
              : 'border-ivory-50/70 bg-ivory-50/95 text-forest-900 hover:bg-ivory-50'
          }`}
        >
          <span
            className={`grid size-7 place-items-center rounded-full text-xs tabular-nums transition-colors ${
              active ? 'bg-forest-900 text-gold-300' : 'bg-forest-900 text-ivory-50'
            }`}
          >
            {number}
          </span>
          <span className="sr-only sm:not-sr-only">{name}</span>
        </Link>
        <span aria-hidden="true" className={`h-3 w-px transition-colors ${active ? 'bg-gold-400' : 'bg-ivory-50/80'}`} />

        <div
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute z-10 hidden w-64 rounded-xl bg-ivory-50 p-4 text-left shadow-lift ring-1 ring-forest-900/10 transition duration-200 md:block ${placement} ${
            active ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">{theme}</p>
          <p className="mt-1 font-display text-xl text-forest-900">{name}</p>
          <p className="mt-1.5 text-sm leading-snug text-ink-muted">{summary}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            Découvrir ce lieu <ArrowRight aria-hidden="true" className="size-4" />
          </p>
        </div>
      </div>
    </li>
  )
}
