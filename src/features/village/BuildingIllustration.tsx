import { useLayoutEffect, useRef, useState } from 'react'
import type { BuildingSlug } from '../../data/buildings'
import { buildingArt } from './scene/buildings'
import { groundPlane } from './scene/iso'
import { GroundShadow, palette } from './scene/primitives'
import { SceneDefs, Slab } from './scene/scenery'

const PAD = 0.45

/** A single village building standing on its own patch of ground. */
export function BuildingIllustration({ slug, className }: { slug: BuildingSlug; className?: string }) {
  const { w, d, Art } = buildingArt[slug]
  const contentRef = useRef<SVGGElement>(null)
  const [viewBox, setViewBox] = useState('-200 -200 400 400')

  // Fit the viewBox to the drawing's real bounds (towers, antennas…).
  useLayoutEffect(() => {
    const box = contentRef.current?.getBBox()
    if (box) setViewBox(`${box.x - 8} ${box.y - 8} ${box.width + 16} ${box.height + 16}`)
  }, [slug])

  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false">
      <SceneDefs />
      <g ref={contentRef}>
        <Slab x={-PAD} y={-PAD} w={w + PAD * 2} d={d + PAD * 2} />
        <g transform={groundPlane()}>
          <rect x={-PAD} y={-PAD} width={w + PAD * 2} height={d + PAD * 2} fill={palette.grass} />
        </g>
        <g filter="url(#village-soft)">
          <GroundShadow x={0.1} y={0.1} w={w - 0.2} d={d - 0.2} spread={0.4} />
        </g>
        <g stroke={palette.edge} strokeWidth={0.8} strokeLinejoin="round">
          <Art />
        </g>
      </g>
    </svg>
  )
}
