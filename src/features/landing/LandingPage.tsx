import { ButtonLink } from '../../components/ui/ButtonLink'
import { buildingPath } from '../../data/buildings'
import { BuildingIllustration } from '../village/BuildingIllustration'
import { HeroSection } from './HeroSection'
import { IndependenceSection } from './IndependenceSection'
import { MissionSection } from './MissionSection'
import { PlacesSection } from './PlacesSection'

export function LandingPage() {
  return (
    <>
      <title>NIRD WORLD — Explorer. Comprendre. Transformer.</title>
      <HeroSection />
      <PlacesSection />
      <IndependenceSection />
      <MissionSection />

      <section aria-labelledby="cta-title" className="bg-sage-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 sm:px-8 md:grid-cols-[1fr_18rem]">
          <div>
            <h2 id="cta-title" className="text-3xl leading-tight font-medium text-forest-900 sm:text-4xl">
              Et votre école, où en est-elle&nbsp;?
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-muted">
              Quinze minutes, vingt questions, et vous repartez avec un premier pas concret.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink to={buildingPath('ecole')} variant="dark">
                Commencer par l’École
              </ButtonLink>
              <ButtonLink to="/village" variant="outline-dark">
                Explorer le village
              </ButtonLink>
            </div>
          </div>
          <BuildingIllustration slug="ecole" className="mx-auto h-44 w-auto md:h-52" />
        </div>
      </section>
    </>
  )
}
