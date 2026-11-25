import { Link } from 'react-router'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { buildingPath, buildings } from '../../data/buildings'
import { BuildingIllustration } from '../village/BuildingIllustration'

export function PlacesSection() {
  return (
    <section id="lieux" aria-labelledby="lieux-title" className="scroll-mt-16 bg-ivory-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="lieux-title" title="Six questions que toute école finit par se poser">
          <p>Entrez par celle qui vous parle. Si vous hésitez, commencez par l’École.</p>
        </SectionHeading>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3">
          {buildings.map((building) => (
            <li key={building.slug}>
              <Link to={buildingPath(building.slug)} viewTransition className="group block rounded-2xl">
                <span className="flex h-32 items-end justify-center rounded-2xl bg-sage-100 px-4 pb-4 transition-colors duration-300 group-hover:bg-sage-200 sm:h-52 sm:px-10 sm:pb-6">
                  <BuildingIllustration
                    slug={building.slug}
                    className="h-full max-h-28 w-auto max-w-full transition-transform duration-500 group-hover:-translate-y-1.5 sm:max-h-44"
                  />
                </span>
                <span className="mt-4 block font-display text-lg leading-snug text-forest-900 group-hover:text-emerald-700 sm:text-2xl">
                  {building.question}
                </span>
                <span className="mt-1.5 block text-sm text-ink-muted sm:text-base">
                  {building.name}
                  {building.open && <span className="font-semibold text-emerald-700">, ouverte</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
