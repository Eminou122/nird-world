import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '../../components/ui/Reveal'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { buildingPath, type BuildingSlug } from '../../data/buildings'

const principles: { title: string; text: string; slug: BuildingSlug; cta: string }[] = [
  {
    title: 'Choisir ses outils',
    text: 'Privilégier des logiciels ouverts, que l’on peut adapter, partager et conserver.',
    slug: 'bibliotheque',
    cta: 'Voir la Bibliothèque',
  },
  {
    title: 'Protéger ses données',
    text: 'Savoir où sont les données des élèves, qui y accède et comment elles sont sécurisées.',
    slug: 'laboratoire',
    cta: 'Voir le Laboratoire',
  },
  {
    title: 'Faire durer le matériel',
    text: 'Réparer, reconditionner et réemployer plutôt que remplacer.',
    slug: 'atelier',
    cta: 'Voir l’Atelier',
  },
  {
    title: 'Décider collectivement',
    text: 'Faire des choix numériques explicites, documentés et partagés.',
    slug: 'hotel-de-ville',
    cta: 'Voir l’Hôtel de Ville',
  },
]

export function IndependenceSection() {
  return (
    <section id="independance" aria-labelledby="independance-title" className="scroll-mt-16 bg-forest-900 py-24 text-ivory-50 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading id="independance-title" onDark eyebrow="Indépendance numérique" title="Choisir ses outils plutôt que les subir.">
            <p>
              L’indépendance numérique, c’est la capacité d’un établissement à maîtriser ses outils, ses données et son
              matériel, sans dépendre d’un fournisseur unique.
            </p>
            <p className="mt-4">
              Ce n’est pas un rejet du numérique : c’est la condition pour faire des choix éclairés. La fin du support de
              Windows 10, en octobre 2025, l’a rappelé — des ordinateurs encore fonctionnels peuvent devenir obsolètes
              du jour au lendemain.
            </p>
          </SectionHeading>
        </Reveal>

        <ol className="divide-y divide-ivory-50/10 border-y border-ivory-50/10 lg:col-span-6 lg:col-start-7">
          {principles.map((principle, index) => {
            return (
              <li key={principle.slug}>
                <Reveal delay={index * 0.06} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-7 sm:grid-cols-[3.5rem_1fr]">
                  <span aria-hidden="true" className="font-display text-2xl text-gold-400 tabular-nums">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-medium">{principle.title}</h3>
                    <p className="mt-2 leading-relaxed text-ivory-100/70">{principle.text}</p>
                    <Link
                      to={buildingPath(principle.slug)}
                      className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-400"
                    >
                      {principle.cta}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
