import { useNavigate } from 'react-router'
import { buildingPath, buildings, type BuildingSlug } from '../../../data/buildings'
import { buildingArt } from './buildings'
import { compareDepth, groundPlane, points, project, viewBoxAttr, type Footprint } from './iso'
import { GRID, VILLAGE_VIEWBOX, garden, paths, placements, plaza, pond, scenery, turbine } from './layout'
import { GroundShadow, palette } from './primitives'
import { Lamp, PineTree, RoundTree, SceneDefs, Slab, WindTurbine } from './scenery'

type SceneItem = Footprint &
  (
    | { type: 'building'; slug: BuildingSlug }
    | { type: 'scenery'; kind: (typeof scenery)[number]['kind']; cx: number; cy: number; scale: number }
    | { type: 'turbine' }
  )

const footprintOf = (slug: BuildingSlug): Footprint => ({ ...placements[slug], w: buildingArt[slug].w, d: buildingArt[slug].d })

// Static scene: sorted once, back to front.
const items: SceneItem[] = [
  ...buildings.map((b): SceneItem => ({ type: 'building', slug: b.slug, ...footprintOf(b.slug) })),
  ...scenery.map(({ kind, x, y, scale = 1 }): SceneItem => {
    const half = 0.3 * scale
    return { type: 'scenery', kind, cx: x, cy: y, scale, x: x - half, y: y - half, w: half * 2, d: half * 2 }
  }),
  { type: 'turbine' as const, x: turbine.x - 0.2, y: turbine.y - 0.2, w: 0.4, d: 0.4 },
].sort(compareDepth)

const gridLines = Array.from({ length: GRID - 1 }, (_, i) => i + 1)

interface VillageSceneProps {
  activeSlug: BuildingSlug | null
  onActiveChange: (slug: BuildingSlug | null) => void
  /** Accessible description; when omitted the drawing is treated as decorative. */
  label?: string
  className?: string
}

export function VillageScene({ activeSlug, onActiveChange, label, className }: VillageSceneProps) {
  const navigate = useNavigate()
  const view = VILLAGE_VIEWBOX

  return (
    <svg
      viewBox={viewBoxAttr(view)}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <SceneDefs />

      {/* Table shadow and wooden base */}
      <polygon
        points={points([0, 0, -0.9], [GRID, 0, -0.9], [GRID, GRID, -0.9], [0, GRID, -0.9])}
        fill="rgba(5, 15, 12, 0.45)"
        filter="url(#village-drop)"
      />
      <Slab w={GRID} d={GRID} />

      {/* Ground */}
      <g transform={groundPlane()}>
        <rect width={GRID} height={GRID} fill={palette.grass} />
        <g stroke={palette.grassLine} strokeWidth={1} vectorEffect="non-scaling-stroke">
          {gridLines.map((i) => (
            <g key={i}>
              <line x1={i} y1={0} x2={i} y2={GRID} vectorEffect="non-scaling-stroke" />
              <line x1={0} y1={i} x2={GRID} y2={i} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </g>

        <rect x={garden.x} y={garden.y} width={garden.w} height={garden.d} rx={0.12} fill={palette.soil} />
        {Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            x={garden.x + 0.15}
            y={garden.y + (garden.d / 5) * (i + 0.3)}
            width={garden.w - 0.3}
            height={(garden.d / 5) * 0.4}
            rx={0.08}
            fill={palette.leaf.light}
          />
        ))}

        {paths.map((r) => (
          <rect
            key={`${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.d}
            fill={palette.path}
            stroke={palette.pathEdge}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle cx={plaza.x} cy={plaza.y} r={plaza.r} fill={palette.plaza} stroke={palette.pathEdge} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <circle cx={plaza.x} cy={plaza.y} r={plaza.r - 0.35} fill="none" stroke={palette.pathEdge} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <circle cx={plaza.x} cy={plaza.y} r={0.75} fill={palette.grass} stroke={palette.pathEdge} strokeWidth={4} vectorEffect="non-scaling-stroke" />

        <circle cx={pond.x} cy={pond.y} r={pond.r + 0.12} fill={palette.pathEdge} />
        <circle cx={pond.x} cy={pond.y} r={pond.r} fill={palette.water} />
        <rect x={pond.x - 0.5} y={pond.y - 0.35} width={0.55} height={0.05} rx={0.025} fill={palette.waterLight} />
        <rect x={pond.x - 0.1} y={pond.y + 0.1} width={0.45} height={0.05} rx={0.025} fill={palette.waterLight} />
      </g>

      {/* Contact shadows */}
      <g filter="url(#village-soft)">
        {buildings.map(({ slug }) => {
          const { w, d } = buildingArt[slug]
          const [X, Y] = project(placements[slug].x, placements[slug].y)
          return (
            <g key={slug} transform={`translate(${X} ${Y})`}>
              <GroundShadow x={0.1} y={0.1} w={w - 0.2} d={d - 0.2} spread={0.8} />
            </g>
          )
        })}
        {scenery.map(({ kind, x, y, scale = 1 }) => {
          const [X, Y] = project(x, y)
          return <ellipse key={`${x}-${y}`} cx={X + 7 * scale} cy={Y + 1} rx={(kind === 'lamp' ? 4 : 12) * scale} ry={(kind === 'lamp' ? 2 : 5) * scale} fill={palette.shadow} />
        })}
      </g>

      {/* Selection rings */}
      <g transform={groundPlane()}>
        {buildings.map(({ slug }) => {
          const f = footprintOf(slug)
          return (
            <rect
              key={slug}
              className={`village-ring${activeSlug === slug ? ' is-active' : ''}`}
              x={f.x - 0.35}
              y={f.y - 0.35}
              width={f.w + 0.7}
              height={f.d + 0.7}
              rx={0.4}
              fill="rgba(214, 168, 95, 0.18)"
              stroke={palette.gold}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </g>

      {/* Objects, back to front */}
      <g stroke={palette.edge} strokeWidth={0.8} strokeLinejoin="round" pointerEvents="none">
        {items.map((item) => {
          if (item.type === 'building') {
            const { slug } = item
            const { Art } = buildingArt[slug]
            const [X, Y] = project(item.x, item.y)
            return (
              <g
                key={slug}
                transform={`translate(${X} ${Y})`}
                className={`village-building${activeSlug === slug ? ' is-active' : ''}`}
                pointerEvents="visiblePainted"
                onPointerEnter={() => onActiveChange(slug)}
                onPointerLeave={() => onActiveChange(null)}
                onClick={() => navigate(buildingPath(slug))}
              >
                <g className="village-building__lift">
                  <Art />
                </g>
              </g>
            )
          }
          if (item.type === 'turbine') return <WindTurbine key="turbine" x={turbine.x} y={turbine.y} />
          const { kind, cx, cy, scale } = item
          const key = `${kind}-${cx}-${cy}`
          if (kind === 'lamp') return <Lamp key={key} x={cx} y={cy} />
          if (kind === 'pine') return <PineTree key={key} x={cx} y={cy} scale={scale} />
          return <RoundTree key={key} x={cx} y={cy} scale={scale} />
        })}
      </g>
    </svg>
  )
}
