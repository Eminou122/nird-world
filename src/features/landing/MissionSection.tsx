import { SectionHeading } from '../../components/ui/SectionHeading'
import { pillars } from '../../data/buildings'

const acronym = [
  { letter: 'N', name: 'Numérique', description: 'Les outils, les données et le matériel dont une école se sert chaque jour.' },
  ...Object.values(pillars),
]

export function MissionSection() {
  return (
    <section id="mission" aria-labelledby="mission-title" className="scroll-mt-16 bg-ivory-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="mission-title" title="NIRD, une démarche en quatre lettres">
          <p>Notre mission&nbsp;: rendre cette démarche concrète, et permettre à chaque équipe d’avancer à son rythme.</p>
        </SectionHeading>

        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {acronym.map((item) => (
            <div key={item.letter}>
              <dt className="font-display text-3xl text-forest-900">
                <span className="text-emerald-600">{item.letter}</span>
                {item.name.slice(1)}
              </dt>
              <dd className="mt-2 leading-relaxed text-ink-muted">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
