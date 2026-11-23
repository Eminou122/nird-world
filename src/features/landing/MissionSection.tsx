import { Reveal } from '../../components/ui/Reveal'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { pillars } from '../../data/buildings'

const acronym = [
  {
    letter: 'N',
    name: 'Numérique',
    description: 'Le point de départ : les outils, les données et le matériel dont dépend chaque établissement.',
  },
  ...Object.values(pillars),
]

export function MissionSection() {
  return (
    <section id="mission" aria-labelledby="mission-title" className="scroll-mt-16 bg-ivory-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="mission-title" eyebrow="Notre mission" title="Rendre l’indépendance numérique concrète, lisible et atteignable.">
            <p>
              Les écoles dépendent souvent d’outils, de services et de matériels qu’elles ne maîtrisent pas. NIRD WORLD
              transforme cette question complexe en un parcours clair, que chaque équipe peut explorer à son rythme.
            </p>
          </SectionHeading>
        </Reveal>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-ivory-300/70 ring-1 ring-ivory-300/70 sm:grid-cols-2 lg:grid-cols-4">
          {acronym.map((item, index) => (
            <li key={item.letter} className="bg-ivory-50">
              <Reveal delay={index * 0.08} className="flex h-full flex-col p-7 sm:p-8">
                <span aria-hidden="true" className="font-display text-7xl leading-none font-medium text-emerald-600">
                  {item.letter}
                </span>
                <h3 className="mt-6 text-2xl font-medium text-forest-900">{item.name}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
