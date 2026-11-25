import { ArrowRight, Signpost } from 'lucide-react'
import { ButtonLink } from '../../components/ui/ButtonLink'

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-title" className="bg-sage-100">
      <title>Page introuvable — NIRD WORLD</title>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
        <span className="grid size-16 place-items-center rounded-2xl bg-forest-900 text-gold-300">
          <Signpost aria-hidden="true" className="size-7" />
        </span>
        <h1 id="not-found-title" className="mt-8 text-4xl leading-tight font-medium text-forest-900 sm:text-5xl">
          Ce chemin ne mène nulle part.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
          Cette page n’existe pas, ou elle a changé d’adresse. Le village, lui, est toujours là.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/village" variant="dark">
            Explorer le village <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="/" variant="outline-dark">
            Retour à l’accueil
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
