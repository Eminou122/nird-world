import type { ReactNode } from 'react'
import { HALF_H, HALF_W, UNIT_Z, planeX, planeY, points, project } from './iso'

/** Shared material palette — light comes from the upper left. */
export const palette = {
  edge: 'rgba(20, 45, 39, 0.42)',
  wall: { top: '#FBF9F3', left: '#EFEADD', right: '#D6CDB7' },
  stone: { top: '#F2E9D6', left: '#E4D7BB', right: '#C8B895' },
  plinth: { top: '#E3DAC6', left: '#CFC3A8', right: '#B2A485' },
  slate: { top: '#5B6B65', left: '#4C5C56', right: '#38453F' },
  roofSlate: { light: '#5D6E67', dark: '#3F4D47' },
  roofCopper: { light: '#55987B', dark: '#336F58' },
  roofClay: { light: '#C88C66', dark: '#A56A4B' },
  solar: '#2E3F45',
  solarLine: '#4F6670',
  glass: '#2E4C46',
  glassLit: '#E9C687',
  gold: '#D6A85F',
  goldDeep: '#A87C3C',
  door: '#3A4A44',
  grass: '#A6C396',
  grassLine: 'rgba(20, 45, 39, 0.07)',
  path: '#EDE6D3',
  pathEdge: '#D7CAAB',
  plaza: '#E6DBC2',
  water: '#7FB4AC',
  waterLight: '#A9D0C9',
  soil: '#9A8262',
  leaf: { light: '#62A582', mid: '#438868', dark: '#2D684E' },
  pine: { light: '#4C8D6E', dark: '#2A5E47' },
  trunk: '#6E5A42',
  shadow: 'rgba(14, 33, 28, 0.2)',
} as const

export interface Shade {
  top: string
  left: string
  right: string
}

interface BoxProps {
  x?: number
  y?: number
  z?: number
  w: number
  d: number
  h: number
  shade: Shade
}

/** Axis-aligned prism: draws the three faces visible from the camera. */
export function Box({ x = 0, y = 0, z = 0, w, d, h, shade }: BoxProps) {
  const x1 = x + w
  const y1 = y + d
  const z1 = z + h
  return (
    <g>
      <polygon points={points([x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1])} fill={shade.left} />
      <polygon points={points([x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1])} fill={shade.right} />
      <polygon points={points([x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1])} fill={shade.top} />
    </g>
  )
}

interface RoofColors {
  light: string
  dark: string
}

interface GableProps {
  x?: number
  y?: number
  z: number
  w: number
  d: number
  rise: number
  axis: 'x' | 'y'
  roof: RoofColors
  wall: Shade
  overhang?: number
}

/** Pitched roof with its ridge along `axis`; the visible gable end gets the wall colour. */
export function Gable({ x = 0, y = 0, z, w, d, rise, axis, roof, wall, overhang = 0.12 }: GableProps) {
  const o = overhang
  const top = z + rise
  if (axis === 'x') {
    const ym = y + d / 2
    const eave = z - (rise * o) / (d / 2)
    return (
      <g>
        <polygon points={points([x - o, y - o, eave], [x + w + o, y - o, eave], [x + w + o, ym, top], [x - o, ym, top])} fill={roof.dark} />
        <polygon points={points([x + w, y, z], [x + w, y + d, z], [x + w, ym, top])} fill={wall.right} />
        <polygon points={points([x - o, y + d + o, eave], [x + w + o, y + d + o, eave], [x + w + o, ym, top], [x - o, ym, top])} fill={roof.light} />
      </g>
    )
  }
  const xm = x + w / 2
  const eave = z - (rise * o) / (w / 2)
  return (
    <g>
      <polygon points={points([x - o, y - o, eave], [x - o, y + d + o, eave], [xm, y + d + o, top], [xm, y - o, top])} fill={roof.light} />
      <polygon points={points([x, y + d, z], [x + w, y + d, z], [xm, y + d, top])} fill={wall.left} />
      <polygon points={points([x + w + o, y - o, eave], [x + w + o, y + d + o, eave], [xm, y + d + o, top], [xm, y - o, top])} fill={roof.dark} />
    </g>
  )
}

interface PyramidProps {
  x?: number
  y?: number
  z: number
  w: number
  d: number
  rise: number
  roof: RoofColors
  overhang?: number
}

/** Hipped roof rising to a single apex. */
export function Pyramid({ x = 0, y = 0, z, w, d, rise, roof, overhang = 0.08 }: PyramidProps) {
  const o = overhang
  const x0 = x - o
  const y0 = y - o
  const x1 = x + w + o
  const y1 = y + d + o
  const apex = [x + w / 2, y + d / 2, z + rise] as const
  return (
    <g>
      <polygon points={points([x0, y0, z], [x1, y0, z], apex)} fill={roof.dark} />
      <polygon points={points([x0, y0, z], [x0, y1, z], apex)} fill={roof.light} />
      <polygon points={points([x0, y1, z], [x1, y1, z], apex)} fill={roof.light} />
      <polygon points={points([x1, y0, z], [x1, y1, z], apex)} fill={roof.dark} />
    </g>
  )
}

interface FaceProps {
  children: ReactNode
  x: number
  y: number
  z?: number
}

/** Draw flat details (windows, doors…) in local face units on the right face (x = const). */
export function FaceX({ x, y, z = 0, children }: FaceProps) {
  return (
    <g transform={planeX(x, y, z)} stroke="none">
      {children}
    </g>
  )
}

/** Draw flat details in local face units on the left face (y = const). */
export function FaceY({ x, y, z = 0, children }: FaceProps) {
  return (
    <g transform={planeY(x, y, z)} stroke="none">
      {children}
    </g>
  )
}

interface WindowRowProps {
  at: readonly number[]
  v: number
  w: number
  h: number
  lit?: readonly number[]
  fill?: string
}

/** A row of rectangular openings in face-local units; indices listed in `lit` glow warm. */
export function WindowRow({ at, v, w, h, lit = [], fill = palette.glass }: WindowRowProps) {
  return (
    <>
      {at.map((u, i) => (
        <rect key={u} x={u} y={v} width={w} height={h} fill={lit.includes(i) ? palette.glassLit : fill} />
      ))}
    </>
  )
}

interface CylinderProps {
  cx: number
  cy: number
  z: number
  r: number
  h: number
  bodyFill: string
  topFill: string
}

export const ellipseRadii = (r: number) => ({ rx: r * HALF_W * Math.SQRT2, ry: r * HALF_H * Math.SQRT2 })

export function Cylinder({ cx, cy, z, r, h, bodyFill, topFill }: CylinderProps) {
  const [X, bottom] = project(cx, cy, z)
  const top = bottom - h * UNIT_Z
  const { rx, ry } = ellipseRadii(r)
  return (
    <g>
      <path
        d={`M${X - rx} ${top} L${X - rx} ${bottom} A${rx} ${ry} 0 0 0 ${X + rx} ${bottom} L${X + rx} ${top} Z`}
        fill={bodyFill}
      />
      <ellipse cx={X} cy={top} rx={rx} ry={ry} fill={topFill} />
    </g>
  )
}

/** Soft contact shadow cast toward the lower right (light comes from the upper left). */
export function GroundShadow({ x = 0, y = 0, w, d, spread = 0.5 }: { x?: number; y?: number; w: number; d: number; spread?: number }) {
  return (
    <polygon
      points={points([x, y, 0], [x + w + spread, y - spread * 0.4, 0], [x + w + spread, y + d, 0], [x + w, y + d, 0], [x, y + d, 0])}
      fill={palette.shadow}
      stroke="none"
    />
  )
}
