import { UNIT_Z, points, project } from './iso'
import { palette as p } from './primitives'

/** Gradients and filters shared by every village drawing. */
export function SceneDefs() {
  return (
    <defs>
      <linearGradient id="village-cylinder" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#FBF9F3" />
        <stop offset="0.45" stopColor="#EEE8DA" />
        <stop offset="1" stopColor="#CBC1A9" />
      </linearGradient>
      <linearGradient id="village-dome" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#F6F4EC" />
        <stop offset="0.55" stopColor="#D9DFD6" />
        <stop offset="1" stopColor="#A4B2AA" />
      </linearGradient>
      <filter id="village-soft" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="village-drop" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16" />
      </filter>
    </defs>
  )
}

export function RoundTree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const [X, Y] = project(x, y)
  const r = 11 * scale
  const cy = Y - 15 * scale - r * 0.6
  return (
    <g>
      <rect x={X - 1.5} y={Y - 15 * scale} width={3} height={15 * scale} fill={p.trunk} stroke="none" />
      <circle cx={X} cy={cy} r={r} fill={p.leaf.mid} />
      <path d={`M${X} ${cy - r} A${r} ${r} 0 0 0 ${X} ${cy + r} Z`} fill={p.leaf.light} stroke="none" />
      <path d={`M${X + r * 0.35} ${cy + r * 0.94} A${r} ${r} 0 0 0 ${X + r} ${cy} L${X} ${cy} Z`} fill={p.leaf.dark} stroke="none" opacity={0.55} />
    </g>
  )
}

export function PineTree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const [X, Y] = project(x, y)
  const r = 9 * scale
  const base = Y - 5 * scale
  const top = Y - 40 * scale
  return (
    <g>
      <rect x={X - 1.5} y={base - 2} width={3} height={7 * scale} fill={p.trunk} stroke="none" />
      <polygon points={`${X},${top} ${X - r},${base} ${X},${base + r * 0.35}`} fill={p.pine.light} />
      <polygon points={`${X},${top} ${X},${base + r * 0.35} ${X + r},${base}`} fill={p.pine.dark} />
    </g>
  )
}

export function Lamp({ x, y }: { x: number; y: number }) {
  const [X, Y] = project(x, y)
  const top = Y - 0.75 * UNIT_Z
  return (
    <g>
      <line x1={X} y1={Y} x2={X} y2={top} stroke={p.door} strokeWidth={1.4} />
      <circle cx={X} cy={top} r={5} fill={p.gold} opacity={0.25} stroke="none" />
      <circle cx={X} cy={top} r={2.2} fill={p.gold} stroke="none" />
    </g>
  )
}

export function WindTurbine({ x, y }: { x: number; y: number }) {
  const [X, Y] = project(x, y)
  const hubY = Y - 3 * UNIT_Z
  const blade = 'M0 0 C 3 -8 3 -30 0 -38 C -2 -30 -2 -8 0 0 Z'
  return (
    <g>
      <polygon points={`${X - 2.6},${Y} ${X + 2.6},${Y} ${X + 1.1},${hubY} ${X - 1.1},${hubY}`} fill={p.wall.left} />
      <g transform={`translate(${X} ${hubY})`}>
        <g className="turbine-rotor">
          {[0, 120, 240].map((angle) => (
            <path key={angle} d={blade} transform={`rotate(${angle})`} fill={p.wall.top} />
          ))}
        </g>
        <circle r={3} fill={p.wall.right} />
      </g>
    </g>
  )
}

/** Wooden base of the model, seen from its two visible sides. */
export function Slab({ x = 0, y = 0, w, d }: { x?: number; y?: number; w: number; d: number }) {
  const x1 = x + w
  const y1 = y + d
  const side = (z0: number, z1: number, left: string, right: string) => (
    <>
      <polygon points={points([x, y1, z0], [x1, y1, z0], [x1, y1, z1], [x, y1, z1])} fill={left} />
      <polygon points={points([x1, y, z0], [x1, y1, z0], [x1, y1, z1], [x1, y, z1])} fill={right} />
    </>
  )
  return (
    <g stroke="rgba(20,45,39,0.35)" strokeWidth={0.8} strokeLinejoin="round">
      {side(-0.55, -0.14, '#CDB993', '#AD9A75')}
      {side(-0.14, 0, '#86A576', '#6E8D60')}
    </g>
  )
}
