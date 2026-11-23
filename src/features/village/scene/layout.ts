import type { BuildingSlug } from '../../../data/buildings'
import type { ViewBox } from './iso'

/** The village is a 16 × 16 tile model. */
export const GRID = 16

export const VILLAGE_VIEWBOX: ViewBox = { x: -540, y: -70, width: 1080, height: 630 }

/** World origin of each building's footprint (see buildingArt for sizes). */
export const placements: Record<BuildingSlug, { x: number; y: number }> = {
  'hotel-de-ville': { x: 2.4, y: 2.4 },
  bibliotheque: { x: 9, y: 3 },
  observatoire: { x: 13, y: 0.6 },
  ecole: { x: 3.4, y: 9 },
  laboratoire: { x: 0.4, y: 12.6 },
  atelier: { x: 10.2, y: 10.4 },
}

export interface Rect {
  x: number
  y: number
  w: number
  d: number
}

const rect = (x0: number, y0: number, x1: number, y1: number): Rect => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 })

/** Paved paths, in ground tiles. */
export const paths: Rect[] = [
  rect(0, 7.4, GRID, 8.6), // main avenue (x)
  rect(7.4, 0, 8.6, GRID), // main avenue (y)
  rect(4, 5.9, 4.8, 7.4), // Hôtel de Ville
  rect(10.4, 6, 11.2, 7.4), // Bibliothèque
  rect(13.9, 3.2, 14.7, 7.4), // Observatoire
  rect(6.3, 10.6, 7.4, 11.4), // École
  rect(3.2, 13.6, 12.2, 14.4), // street: Laboratoire ↔ Atelier
  rect(10.8, 13.2, 11.8, 13.6), // Atelier forecourt
]

export const plaza = { x: 8, y: 8, r: 1.9 }
export const pond = { x: 14.4, y: 14.6, r: 1.05 }
export const garden = rect(0.6, 9.2, 2.8, 11.6)
export const turbine = { x: 15, y: 9.8 }

export type SceneryKind = 'tree' | 'pine' | 'lamp'

export const scenery: { kind: SceneryKind; x: number; y: number; scale?: number }[] = [
  // Back quarter
  { kind: 'pine', x: 1, y: 1 },
  { kind: 'tree', x: 2.3, y: 0.8 },
  { kind: 'pine', x: 3.8, y: 1 },
  { kind: 'tree', x: 5.2, y: 1 },
  { kind: 'pine', x: 7, y: 1.2 },
  { kind: 'tree', x: 0.9, y: 2.8 },
  { kind: 'pine', x: 1.1, y: 4.6 },
  { kind: 'tree', x: 1.4, y: 6.4 },
  { kind: 'tree', x: 3, y: 6.7 },
  { kind: 'tree', x: 6.9, y: 3.6 },
  { kind: 'tree', x: 6, y: 6.6 },
  // Right quarter
  { kind: 'tree', x: 9.4, y: 1.2 },
  { kind: 'pine', x: 10.8, y: 1 },
  { kind: 'tree', x: 12.1, y: 1.5 },
  { kind: 'tree', x: 9.3, y: 6.8 },
  { kind: 'tree', x: 12.3, y: 6.8 },
  { kind: 'pine', x: 13.2, y: 5 },
  { kind: 'tree', x: 15.3, y: 4.3 },
  { kind: 'pine', x: 15.4, y: 6.5 },
  // Left quarter
  { kind: 'tree', x: 6.9, y: 12.6 },
  { kind: 'pine', x: 1.8, y: 12.1 },
  { kind: 'tree', x: 4.6, y: 15.2 },
  { kind: 'pine', x: 6.1, y: 15.3 },
  { kind: 'tree', x: 0.6, y: 8.9 },
  // Front quarter
  { kind: 'tree', x: 9.6, y: 10 },
  { kind: 'tree', x: 9.2, y: 12.2 },
  { kind: 'pine', x: 13, y: 9.3 },
  { kind: 'tree', x: 15.2, y: 12 },
  { kind: 'tree', x: 12.8, y: 15.3 },
  { kind: 'pine', x: 9.6, y: 15.2 },
  { kind: 'tree', x: 11.2, y: 15.4 },
  // Plaza
  { kind: 'tree', x: 8, y: 8, scale: 1.45 },
  { kind: 'lamp', x: 6.8, y: 6.8 },
  { kind: 'lamp', x: 9.2, y: 6.8 },
  { kind: 'lamp', x: 6.8, y: 9.2 },
  { kind: 'lamp', x: 9.2, y: 9.2 },
]
