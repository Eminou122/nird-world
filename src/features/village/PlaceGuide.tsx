import { X } from 'lucide-react'
import type { Ref } from 'react'
import { ButtonLink } from '../../components/ui/ButtonLink'
import { buttonClass } from '../../components/ui/buttonClass'
import { buildingPath, type Building } from '../../data/buildings'
import { BuildingIllustration } from './BuildingIllustration'

interface PlaceGuideProps {
  building: Building | undefined
  headingRef: Ref<HTMLHeadingElement>
  onSelectSchool: () => void
  onClose: () => void
}

/** Presents the selected place: what it is, what you find there, why it matters. */
export function PlaceGuide({ building, headingRef, onSelectSchool, onClose }: PlaceGuideProps) {
  if (!building) {
    return (
      <section aria-labelledby="guide-title" className="rounded-3xl bg-ivory-50 p-6 sm:p-8">
        <h2 id="guide-title" className="text-2xl font-medium text-forest-900">
          Par où commencer&nbsp;?
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          Choisissez un bâtiment sur le plan&nbsp;: il vous dira quelle question il aide à résoudre.
        </p>
        <p className="mt-3 leading-relaxed text-ink-muted">Première visite&nbsp;? L’École est le meilleur point de départ.</p>
        <button type="button" onClick={onSelectSchool} className={buttonClass('primary', 'mt-6 w-full')}>
          Me montrer l’École
        </button>
      </section>
    )
  }

  const { slug, name, theme, question, why, open, planned, enterLabel } = building
  return (
    <section
      aria-labelledby="guide-title"
      className="rounded-3xl bg-ivory-50 p-6 sm:p-8"
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <div className="relative flex h-36 items-end justify-center">
        <BuildingIllustration slug={slug} className="building-art h-full w-auto max-w-full" />
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 inline-flex size-11 items-center justify-center rounded-full text-ink-muted hover:bg-sage-200 hover:text-forest-900"
        >
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Fermer la présentation</span>
        </button>
      </div>

      <h2 id="guide-title" ref={headingRef} tabIndex={-1} className="mt-5 scroll-mt-24 text-2xl leading-snug font-medium text-forest-900 outline-none">
        {question}
      </h2>
      <p className="mt-1.5 text-ink-muted">
        {name}&nbsp;: {theme.charAt(0).toLowerCase() + theme.slice(1)}
      </p>

      <h3 className="mt-5 font-sans text-sm font-semibold tracking-normal text-forest-900">
        {open ? 'Vous y trouverez' : 'Vous y trouverez bientôt'}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {planned.map((feature) => (
          <li key={feature.title} className="flex items-center gap-2.5 text-ink-muted">
            <feature.icon aria-hidden="true" className="size-4 shrink-0 text-emerald-700" />
            {feature.title}
          </li>
        ))}
      </ul>

      <h3 className="mt-5 font-sans text-sm font-semibold tracking-normal text-forest-900">Pourquoi c’est important</h3>
      <p className="mt-1 leading-relaxed text-ink-muted">{why}</p>

      <ButtonLink to={buildingPath(slug)} variant={open ? 'primary' : 'dark'} viewTransition className="mt-6 w-full">
        {open && enterLabel ? enterLabel : 'Visiter ce lieu'}
      </ButtonLink>
    </section>
  )
}
