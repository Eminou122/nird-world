/**
 * Isometric (2:1 dimetric) projection helpers.
 *
 * World units: x runs toward the screen's lower-right, y toward the lower-left,
 * z is height. One tile is 1×1 on the ground. The viewer looks from +x/+y, so the
 * visible faces of a box are its top, its +y face (left) and its +x face (right).
 */

export const HALF_W = 32
export const HALF_H = 16
export const UNIT_Z = 36

export type Vec3 = readonly [x: number, y: number, z?: number]

const round = (value: number) => Math.round(value * 10) / 10

export function project(x: number, y: number, z = 0): [number, number] {
  return [round((x - y) * HALF_W), round((x + y) * HALF_H - z * UNIT_Z)]
}

export function points(...vertices: Vec3[]): string {
  return vertices.map(([x, y, z = 0]) => project(x, y, z).join(',')).join(' ')
}

const matrix = (a: number, b: number, c: number, d: number, [e, f]: [number, number]) =>
  `matrix(${a} ${b} ${c} ${d} ${e} ${f})`

/** Local (u, v) = world (x, y) on the horizontal plane at height z. */
export const groundPlane = (z = 0) => matrix(HALF_W, HALF_H, -HALF_W, HALF_H, project(0, 0, z))

/** Vertical plane x = const. Origin at (x, y, z); u runs toward −y (screen right), v runs up. */
export const planeX = (x: number, y: number, z = 0) => matrix(HALF_W, -HALF_H, 0, -UNIT_Z, project(x, y, z))

/** Vertical plane y = const. Origin at (x, y, z); u runs toward +x (screen right), v runs up. */
export const planeY = (x: number, y: number, z = 0) => matrix(HALF_W, HALF_H, 0, -UNIT_Z, project(x, y, z))

export interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

export const viewBoxAttr = ({ x, y, width, height }: ViewBox) => `${x} ${y} ${width} ${height}`

/** Position of a world point as percentages of a viewBox, for HTML overlays. */
export function toPercent(view: ViewBox, x: number, y: number, z = 0) {
  const [sx, sy] = project(x, y, z)
  return {
    left: ((sx - view.x) / view.width) * 100,
    top: ((sy - view.y) / view.height) * 100,
  }
}

export interface Footprint {
  x: number
  y: number
  w: number
  d: number
}

/**
 * Painter's order for objects standing on non-overlapping footprints: an object that is
 * entirely behind another along x or y is drawn first.
 * ponytail: pairwise comparator, not a topological sort — fine for a hand-placed scene.
 */
export function compareDepth(a: Footprint, b: Footprint): number {
  if (a.x + a.w <= b.x || a.y + a.d <= b.y) return -1
  if (b.x + b.w <= a.x || b.y + b.d <= a.y) return 1
  return a.x + a.w / 2 + a.y + a.d / 2 - (b.x + b.w / 2 + b.y + b.d / 2)
}
