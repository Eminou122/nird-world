import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../../components/ui/ButtonLink'
import { Reveal } from '../../components/ui/Reveal'
import { buildingPath } from '../../data/buildings'
import { HeroSection } from './HeroSection'
import { IndependenceSection } from './IndependenceSection'
import { MissionSection } from './MissionSection'
import { PlacesSection } from './PlacesSection'

export function LandingPage() {
  return (
    <>
      <title>NIRD WORLD — Explorer. Comprendre. Transformer.</title>
      <HeroSection />
      <MissionSection />
      <PlacesSection />
      <IndependenceSection />

      <section aria-labelledby="cta-title" className="bg-ivory-100 py-24 sm:py-28">
        <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 id="cta-title" className="text-4xl leading-tight font-medium text-forest-900 sm:text-5xl">
            Le village vous attend.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Commencez par l’École pour situer votre établissement, ou parcourez librement les six lieux.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/village" variant="dark">
              Explorer le village <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to={buildingPath('ecole')} variant="outline-dark">
              Commencer par l’École
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  )
}
