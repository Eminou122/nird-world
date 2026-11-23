import type { ComponentType } from 'react'
import type { BuildingSlug } from '../../../data/buildings'
import { UNIT_Z, points, project } from './iso'
import { Box, Cylinder, FaceX, FaceY, Gable, Pyramid, WindowRow, ellipseRadii, palette as p } from './primitives'

/* Each building is drawn in local tile units with its footprint starting at (0, 0). */

function TownHall() {
  return (
    <g>
      <Box x={0.05} y={0.25} w={3.9} d={3.0} h={0.1} shade={p.plinth} />
      <Box x={0.2} y={0.4} z={0.1} w={3.6} d={1.6} h={1.4} shade={p.stone} />
      <FaceY x={0.2} y={2} z={0.1}>
        <WindowRow at={[0.15, 0.5, 0.85, 2.53, 2.88, 3.23]} v={0.22} w={0.22} h={0.4} lit={[1, 4]} />
        <WindowRow at={[0.15, 0.5, 0.85, 2.53, 2.88, 3.23]} v={0.82} w={0.22} h={0.4} lit={[5]} />
      </FaceY>
      <FaceX x={3.8} y={2} z={0.1}>
        <WindowRow at={[0.3, 0.72, 1.14]} v={0.22} w={0.22} h={0.4} />
        <WindowRow at={[0.3, 0.72, 1.14]} v={0.82} w={0.22} h={0.4} lit={[0]} />
      </FaceX>
      <Box x={0.12} y={0.32} z={1.5} w={3.76} d={1.76} h={0.1} shade={p.plinth} />
      <Gable x={0.2} y={0.4} z={1.6} w={3.6} d={1.6} rise={0.55} axis="x" roof={p.roofSlate} wall={p.stone} overhang={0.08} />

      {/* Central clock tower */}
      <Box x={1.4} y={2} z={0.1} w={1.2} d={1} h={2.5} shade={p.wall} />
      <FaceY x={1.4} y={3} z={0.1}>
        <rect x={0.4} y={0} width={0.4} height={0.72} fill={p.door} />
        <circle cx={0.6} cy={0.72} r={0.2} fill={p.door} />
        <rect x={0.47} y={1.08} width={0.26} height={0.5} fill={p.glassLit} />
        <circle cx={0.6} cy={2.02} r={0.25} fill={p.gold} />
        <circle cx={0.6} cy={2.02} r={0.19} fill={p.wall.top} />
        <rect x={0.585} y={2.02} width={0.03} height={0.15} fill={p.door} />
        <rect x={0.6} y={2.005} width={0.12} height={0.03} fill={p.door} />
      </FaceY>
      <FaceX x={2.6} y={3} z={0.1}>
        <WindowRow at={[0.39]} v={0.3} w={0.22} h={0.45} />
        <WindowRow at={[0.39]} v={1.08} w={0.22} h={0.5} lit={[0]} />
      </FaceX>
      <Box x={1.34} y={1.94} z={2.6} w={1.32} d={1.12} h={0.1} shade={p.plinth} />
      <Pyramid x={1.34} y={1.94} z={2.7} w={1.32} d={1.12} rise={0.75} roof={p.roofSlate} />
      <Finial x={2} y={2.5} z={3.45} />
      <Box x={1.5} y={3.25} w={1} d={0.2} h={0.06} shade={p.plinth} />
    </g>
  )
}

function Finial({ x, y, z }: { x: number; y: number; z: number }) {
  const [bx, by] = project(x, y, z)
  const [, ty] = project(x, y, z + 0.32)
  return (
    <g>
      <line x1={bx} y1={by} x2={bx} y2={ty} stroke={p.goldDeep} strokeWidth={1.6} />
      <circle cx={bx} cy={ty} r={2.6} fill={p.gold} stroke="none" />
    </g>
  )
}

function School() {
  const [fx, fy] = project(2.95, 1.05, 0)
  const [, topY] = project(2.95, 1.05, 2.05)
  return (
    <g>
      <Box x={0.3} y={0.2} w={2} d={3.6} h={1.3} shade={p.wall} />
      <FaceX x={2.3} y={3.8}>
        <WindowRow at={[0.2, 0.72, 2.58, 3.1]} v={0.34} w={0.32} h={0.68} lit={[2]} />
        <WindowRow at={[0.2, 0.72, 2.58, 3.1]} v={0.72} w={0.32} h={0.035} fill={p.wall.right} />
      </FaceX>
      <FaceY x={0.3} y={3.8}>
        <WindowRow at={[0.3, 1.38]} v={0.34} w={0.32} h={0.68} lit={[0]} />
      </FaceY>
      <Gable x={0.3} y={0.2} z={1.3} w={2} d={3.6} rise={0.8} axis="y" roof={p.roofClay} wall={p.wall} />
      <FaceY x={0.3} y={3.8}>
        <circle cx={1} cy={1.6} r={0.17} fill={p.gold} />
        <circle cx={1} cy={1.6} r={0.11} fill={p.glass} />
      </FaceY>

      {/* Entrance porch with pediment */}
      <Box x={2.3} y={1.4} w={0.6} d={1.2} h={0.9} shade={p.wall} />
      <FaceX x={2.9} y={2.6}>
        <rect x={0.36} y={0} width={0.48} height={0.62} fill={p.door} />
        <rect x={0.36} y={0.67} width={0.48} height={0.1} fill={p.glassLit} />
      </FaceX>
      <Gable x={2.3} y={1.4} z={0.9} w={0.6} d={1.2} rise={0.38} axis="x" roof={p.roofClay} wall={p.wall} overhang={0.08} />

      {/* Flagpole with a gold pennant */}
      <line x1={fx} y1={fy} x2={fx} y2={topY} stroke={p.door} strokeWidth={1.4} />
      <path d={`M${fx} ${topY + 1} l15 4 l-15 4 Z`} fill={p.gold} stroke="none" />
    </g>
  )
}

function Library() {
  const columns = [0.4, 0.95, 1.5, 2.05, 2.6, 3.15]
  return (
    <g>
      <Box w={3.6} d={2.8} h={0.18} shade={p.plinth} />
      <Box x={1.3} y={2.8} w={1} d={0.2} h={0.09} shade={p.plinth} />
      <Box x={0.3} y={0.3} z={0.18} w={3} d={1.8} h={1.32} shade={p.stone} />
      <FaceY x={0.3} y={2.1} z={0.18}>
        <WindowRow at={[0.35, 0.9, 2.35, 2.9]} v={0.25} w={0.22} h={0.8} lit={[1, 3]} />
        <rect x={1.3} y={0} width={0.4} height={0.85} fill={p.door} />
      </FaceY>
      <FaceX x={3.3} y={2.1} z={0.18}>
        <WindowRow at={[0.3, 0.8, 1.3]} v={0.25} w={0.22} h={0.8} lit={[1]} />
      </FaceX>
      {columns.map((x) => (
        <Box key={x} x={x} y={2.25} z={0.18} w={0.16} d={0.18} h={1.32} shade={p.wall} />
      ))}
      <Box x={0.22} y={0.22} z={1.5} w={3.16} d={2.3} h={0.2} shade={p.stone} />
      <FaceY x={0.22} y={2.52} z={1.5}>
        <rect x={0} y={0.07} width={3.16} height={0.04} fill={p.gold} />
      </FaceY>
      <Gable x={0.22} y={0.22} z={1.7} w={3.16} d={2.3} rise={0.85} axis="y" roof={p.roofCopper} wall={p.stone} overhang={0.1} />
      <FaceY x={0.22} y={2.52} z={1.7}>
        <circle cx={1.58} cy={0.3} r={0.14} fill={p.gold} />
        <circle cx={1.58} cy={0.3} r={0.09} fill={p.glass} />
      </FaceY>
    </g>
  )
}

function Laboratory() {
  const glass = { top: p.glass, left: '#3C6159', right: '#2A4640' }
  const bays = [0, 0.44, 0.88, 1.32, 1.76, 2.2]
  const [ax, ay] = project(2.15, 0.75, 1.8)
  const [, aTop] = project(2.15, 0.75, 2.85)
  return (
    <g>
      <Box x={0.3} y={0.3} w={2.2} d={2.2} h={0.85} shade={glass} />
      <FaceY x={0.3} y={2.5}>
        <rect x={0.44} y={0} width={0.88} height={0.85} fill={p.glassLit} opacity={0.75} />
        {bays.map((u) => (
          <rect key={u} x={u - 0.02} y={0} width={0.04} height={0.85} fill={p.wall.left} />
        ))}
      </FaceY>
      <FaceX x={2.5} y={2.5}>
        <rect x={0.88} y={0} width={0.44} height={0.62} fill={p.wall.right} />
        <rect x={0.92} y={0} width={0.36} height={0.58} fill={p.glassLit} />
        {bays.map((u) => (
          <rect key={u} x={u - 0.02} y={0} width={0.04} height={0.85} fill={p.wall.right} />
        ))}
      </FaceX>
      <Box x={0.15} y={0.15} z={0.85} w={2.5} d={2.5} h={0.95} shade={p.wall} />
      <FaceY x={0.15} y={2.65} z={0.85}>
        <rect x={0.15} y={0.3} width={2.2} height={0.32} fill={p.glass} />
        <rect x={1.1} y={0.3} width={0.7} height={0.32} fill={p.glassLit} />
        <rect x={0.15} y={0.14} width={2.2} height={0.035} fill={p.gold} />
      </FaceY>
      <FaceX x={2.65} y={2.65} z={0.85}>
        <rect x={0.15} y={0.3} width={2.2} height={0.32} fill={p.glass} />
        <rect x={0.15} y={0.14} width={2.2} height={0.035} fill={p.gold} />
      </FaceX>
      <Box x={0.45} y={0.45} z={1.8} w={0.9} d={0.8} h={0.32} shade={p.slate} />
      <line x1={ax} y1={ay} x2={ax} y2={aTop} stroke={p.door} strokeWidth={1.4} />
      <line x1={ax - 6} y1={aTop + 10} x2={ax + 6} y2={aTop + 10} stroke={p.door} strokeWidth={1.2} />
      <circle cx={ax} cy={aTop} r={2.8} fill={p.gold} stroke="none" />
    </g>
  )
}

function Workshop() {
  const x0 = 0.2
  const y0 = 0.3
  const y1 = 2.4
  const z = 0.95
  const rise = 0.55
  const step = 3.2 / 3
  const crate = { top: '#C9A774', left: '#B89462', right: '#9A7A4D' }
  return (
    <g>
      <Box x={x0} y={y0} w={3.2} d={2.1} h={z} shade={p.stone} />
      <FaceY x={x0} y={y1}>
        <rect x={0.35} y={0} width={1.05} height={0.3} fill={p.glassLit} />
        <rect x={0.35} y={0.3} width={1.05} height={0.45} fill={p.slate.left} />
        {[0.42, 0.54, 0.66].map((v) => (
          <rect key={v} x={0.35} y={v} width={1.05} height={0.02} fill={p.slate.right} />
        ))}
        <WindowRow at={[1.75, 2.2, 2.65]} v={0.36} w={0.3} h={0.36} lit={[0]} />
      </FaceY>
      <FaceX x={x0 + 3.2} y={y1}>
        <WindowRow at={[0.3, 0.88, 1.46]} v={0.36} w={0.3} h={0.36} />
      </FaceX>
      {[0, 1, 2].map((i) => {
        const a = x0 + i * step
        const b = a + step
        return (
          <g key={i}>
            <polygon points={points([a, y0, z], [b, y0, z + rise], [b, y1, z + rise], [a, y1, z])} fill={p.solar} />
            {[0.34, 0.67].map((t) => (
              <line
                key={t}
                x1={project(a + t * step, y0, z + t * rise)[0]}
                y1={project(a + t * step, y0, z + t * rise)[1]}
                x2={project(a + t * step, y1, z + t * rise)[0]}
                y2={project(a + t * step, y1, z + t * rise)[1]}
                stroke={p.solarLine}
                strokeWidth={0.8}
              />
            ))}
            <polygon points={points([a, y1, z], [b, y1, z], [b, y1, z + rise])} fill={p.stone.left} />
            <polygon points={points([b, y0, z], [b, y1, z], [b, y1, z + rise], [b, y0, z + rise])} fill={i === 2 ? p.glassLit : p.glass} />
          </g>
        )
      })}
      <Box x={2.75} y={2.5} w={0.3} d={0.26} h={0.2} shade={crate} />
      <Box x={3.12} y={2.52} w={0.26} d={0.24} h={0.16} shade={crate} />
    </g>
  )
}

function Observatory() {
  const [X, baseY] = project(1.3, 1.3, 1.58)
  const { rx, ry } = ellipseRadii(0.92)
  const domeH = rx * 0.85
  const apexY = baseY - domeH
  const [, cylTop] = project(1.3, 1.3, 1.5)
  const cylH = 1.05 * UNIT_Z
  return (
    <g>
      <Box x={0.1} y={0.1} w={2.4} d={2.4} h={0.45} shade={p.stone} />
      <FaceY x={0.1} y={2.5}>
        <WindowRow at={[0.35, 1.87]} v={0.14} w={0.18} h={0.18} />
        <rect x={1} y={0} width={0.4} height={0.34} fill={p.door} />
      </FaceY>
      <FaceX x={2.5} y={2.5}>
        <WindowRow at={[0.35, 1.87]} v={0.14} w={0.18} h={0.18} />
      </FaceX>
      <Cylinder cx={1.3} cy={1.3} z={0.45} r={0.95} h={1.05} bodyFill="url(#village-cylinder)" topFill={p.wall.top} />
      {[-0.5, 0.05, 0.6].map((k) => (
        <rect
          key={k}
          x={X + k * ellipseRadii(0.95).rx - 2.5}
          y={cylTop + cylH * 0.35 + ry * Math.sqrt(1 - k * k) * 0.9}
          width={5}
          height={cylH * 0.32}
          rx={2.5}
          fill={k === 0.05 ? p.glassLit : p.glass}
          stroke="none"
        />
      ))}
      <Cylinder cx={1.3} cy={1.3} z={1.5} r={1} h={0.08} bodyFill={p.plinth.right} topFill={p.plinth.top} />
      <path
        d={`M${X - rx} ${baseY} A${rx} ${domeH} 0 0 1 ${X + rx} ${baseY} A${rx} ${ry} 0 0 1 ${X - rx} ${baseY} Z`}
        fill="url(#village-dome)"
      />
      <polygon
        points={`${X - 3},${apexY + 3} ${X + 5},${apexY + 3} ${X + 9},${baseY + ry - 1} ${X - 3},${baseY + ry - 1}`}
        fill={p.door}
        stroke="none"
      />
      <line x1={X + 1} y1={apexY + 8} x2={X + 5} y2={baseY + ry - 4} stroke={p.gold} strokeWidth={1.4} />
    </g>
  )
}

export interface BuildingArtSpec {
  /** Footprint in tiles (x × y) and tallest point in height units. */
  w: number
  d: number
  h: number
  Art: ComponentType
}

export const buildingArt: Record<BuildingSlug, BuildingArtSpec> = {
  ecole: { w: 3, d: 4, h: 2.15, Art: School },
  bibliotheque: { w: 3.6, d: 3, h: 2.55, Art: Library },
  laboratoire: { w: 2.8, d: 2.8, h: 2.85, Art: Laboratory },
  atelier: { w: 3.6, d: 2.8, h: 1.5, Art: Workshop },
  'hotel-de-ville': { w: 4, d: 3.5, h: 3.75, Art: TownHall },
  observatoire: { w: 2.6, d: 2.6, h: 2.5, Art: Observatory },
}
