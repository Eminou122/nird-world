import { Link } from 'react-router'
import { buildingPath, type BuildingSlug } from '../../data/buildings'

const principles: { title: string; text: string; slug: BuildingSlug }[] = [
  { title: 'Choisir ses outils', text: 'Des logiciels ouverts, que l’on peut adapter, partager et garder.', slug: 'bibliotheque' },
  { title: 'Protéger ses données', text: 'Savoir où sont celles des élèves, et qui peut les voir.', slug: 'laboratoire' },
  { title: 'Faire durer le matériel', text: 'Réparer et reconditionner avant de remplacer.', slug: 'atelier' },
  { title: 'Décider ensemble', text: 'Des choix explicites, écrits et partagés.', slug: 'hotel-de-ville' },
]

export function IndependenceSection() {
  return (
    <section
      id="independance"
      aria-labelledby="independance-title"
      className="on-dark scroll-mt-16 bg-forest-900 py-20 text-ivory-50 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="independance-title" className="text-3xl leading-[1.12] font-medium sm:text-4xl lg:text-[2.75rem]">
            Un ordinateur qui marche, et qu’il faudrait jeter&nbsp;?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory-100/85">
            En octobre 2025, Windows 10 a cessé d’être pris en charge. Du jour au lendemain, des ordinateurs en bon état
            sont devenus un problème, sans que les écoles aient rien décidé.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory-100/85">
            L’indépendance numérique, c’est pouvoir décider soi-même. Ce n’est pas rejeter le numérique&nbsp;: c’est le
            choisir, sans dépendre d’un fournisseur unique.
          </p>
        </div>

        <ul className="grid content-center gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:grid-cols-1 lg:gap-y-6">
          {principles.map((principle) => (
            <li key={principle.slug}>
              <Link
                to={buildingPath(principle.slug)}
                className="rounded font-display text-2xl text-gold-300 decoration-1 underline-offset-4 hover:underline"
              >
                {principle.title}
              </Link>
              <p className="mt-1 leading-relaxed text-ivory-100/75">{principle.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
