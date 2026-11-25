import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ButtonLink } from '../../components/ui/ButtonLink'
import { buildingPath, getBuilding, type BuildingSlug } from '../../data/buildings'
import { VillageScene } from '../village/scene/VillageScene'

export function HeroSection() {
  const navigate = useNavigate()
  const [activeSlug, setActiveSlug] = useState<BuildingSlug | null>(null)
  const active = getBuilding(activeSlug ?? undefined)

  return (
    <section aria-labelledby="hero-title" className="overflow-hidden bg-sage-100">
      <div className="mx-auto grid max-w-[88rem] gap-8 px-5 pt-12 pb-12 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-4 lg:py-16">
        <div className="lg:col-span-5">
          <h1 id="hero-title" className="text-[2.6rem] leading-[1.06] font-medium text-forest-900 sm:text-6xl">
            Et si l’école reprenait la main sur son numérique&nbsp;?
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            NIRD WORLD est un village à explorer. Chaque bâtiment répond à une question simple sur les outils, les
            données et le matériel de votre établissement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/village">Explorer le village</ButtonLink>
            <ButtonLink to={buildingPath('ecole')} variant="outline-dark">
              Faire le diagnostic
            </ButtonLink>
          </div>
        </div>

        <figure className="-mx-3 sm:mx-0 lg:col-span-7">
          <VillageScene
            className="block h-auto w-full"
            activeSlug={activeSlug}
            onActiveChange={setActiveSlug}
            onSelect={(slug) => navigate(buildingPath(slug), { viewTransition: true })}
          />
          <figcaption className="flex min-h-14 flex-col items-center justify-center px-4 text-center">
            {active ? (
              <>
                <span className="font-display text-xl text-forest-900">{active.question}</span>
                <span className="text-sm text-ink-muted">{active.name}</span>
              </>
            ) : (
              <span className="text-ink-muted">Promenez-vous&nbsp;: chaque bâtiment a quelque chose à vous demander.</span>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
