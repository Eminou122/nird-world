import { buildings, type Building, type BuildingSlug } from '../../data/buildings'
import { buildingArt } from './scene/buildings'
import { toPercent } from './scene/iso'
import { VILLAGE_VIEWBOX, placements } from './scene/layout'
import { VillageScene } from './scene/VillageScene'

export const pinId = (slug: BuildingSlug) => `village-pin-${slug}`

interface VillageMapProps {
  activeSlug: BuildingSlug | null
  selectedSlug: BuildingSlug | null
  onActiveChange: (slug: BuildingSlug | null) => void
  onSelect: (slug: BuildingSlug) => void
}

/** The interactive village: illustration plus keyboard-accessible pins. Selecting a place presents it; entering is a second step. */
export function VillageMap({ activeSlug, selectedSlug, onActiveChange, onSelect }: VillageMapProps) {
  return (
    <div className="relative">
      <VillageScene
        className="block h-auto w-full"
        label="Plan illustré du village NIRD WORLD : six lieux reliés par des allées autour d’une place centrale."
        activeSlug={activeSlug}
        selectedSlug={selectedSlug}
        onActiveChange={onActiveChange}
        onSelect={onSelect}
      />
      <ul className="pointer-events-none absolute inset-0" aria-label="Bâtiments du village">
        {buildings.map((building) => (
          <MapPin
            key={building.slug}
            building={building}
            active={activeSlug === building.slug}
            selected={selectedSlug === building.slug}
            suggested={selectedSlug === null && building.slug === 'ecole'}
            onActiveChange={onActiveChange}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  )
}

interface MapPinProps {
  building: Building
  active: boolean
  selected: boolean
  suggested: boolean
  onActiveChange: (slug: BuildingSlug | null) => void
  onSelect: (slug: BuildingSlug) => void
}

function MapPin({ building, active, selected, suggested, onActiveChange, onSelect }: MapPinProps) {
  const { slug, name, question, icon: Icon } = building
  const { w, d, h } = buildingArt[slug]
  const { x, y } = placements[slug]
  const { left, top } = toPercent(VILLAGE_VIEWBOX, x + w / 2, y + d / 2, h + 0.2)
  const tooltipId = `village-tooltip-${slug}`

  // Keep the question inside the map: beside the pin near the top edge, otherwise above it.
  // Even hidden, a tooltip takes up room: near the right edge it opens to the left, or the page would scroll sideways.
  const placement =
    top < 25
      ? left > 60
        ? 'right-full top-1/2 mr-3 -translate-y-1/2'
        : 'left-full top-1/2 ml-3 -translate-y-1/2'
      : left < 28
        ? 'bottom-full left-0 mb-2'
        : left > 72
          ? 'bottom-full right-0 mb-2'
          : 'bottom-full left-1/2 mb-2 -translate-x-1/2'

  const activate = () => onActiveChange(slug)
  const deactivate = () => onActiveChange(null)

  const tone = selected
    ? 'bg-forest-900 text-ivory-50'
    : active || suggested
      ? 'bg-gold-400 text-forest-900'
      : 'bg-ivory-50 text-forest-900'

  return (
    // A zero-size anchor: the pin is positioned from it, so its box never widens the page.
    <li className={`absolute size-0 ${active ? 'z-10' : ''}`} style={{ left: `${left}%`, top: `${top}%` }}>
      <div className="absolute bottom-0 left-0 flex w-max -translate-x-1/2 flex-col items-center">
        <button
          type="button"
          id={pinId(slug)}
          aria-pressed={selected}
          aria-describedby={tooltipId}
          onClick={() => onSelect(slug)}
          onPointerEnter={activate}
          onPointerLeave={deactivate}
          onFocus={activate}
          onBlur={deactivate}
          className={`pointer-events-auto inline-flex size-11 items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-soft transition-colors duration-200 sm:h-10 sm:w-auto sm:px-3.5 ${tone}`}
        >
          <Icon aria-hidden="true" className="size-4.5 sm:size-4" />
          <span className="sr-only sm:not-sr-only">{name}</span>
        </button>
        <span aria-hidden="true" className={`h-2.5 w-0.5 transition-colors sm:h-3 ${selected ? 'bg-forest-900' : active || suggested ? 'bg-gold-400' : 'bg-ivory-50'}`} />

        <p
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute z-10 hidden w-max max-w-64 rounded-xl bg-forest-900 px-4 py-2.5 font-display text-lg leading-snug text-ivory-50 shadow-lift transition duration-200 md:block ${placement} ${
            active && !selected ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          {question}
        </p>
      </div>
    </li>
  )
}
