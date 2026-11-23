import { Link } from 'react-router'
import { buildingPath, buildings } from '../../data/buildings'
import { Logo } from '../ui/Logo'

const linkClass = 'rounded text-ivory-100/70 transition-colors hover:text-ivory-50'

export function SiteFooter() {
  return (
    <footer className="bg-forest-950 text-ivory-100">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 font-display text-xl text-ivory-50 italic">Explorer. Comprendre. Transformer.</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory-100/65">
            Un village numérique pour accompagner les établissements scolaires vers un numérique inclusif, responsable et
            durable.
          </p>
        </div>

        <nav aria-labelledby="footer-village" className="md:col-span-4">
          <h2 id="footer-village" className="font-sans text-xs font-semibold tracking-[0.18em] text-gold-400 uppercase">
            Le village
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {buildings.map((building) => (
              <li key={building.slug}>
                <Link to={buildingPath(building.slug)} className={linkClass}>
                  {building.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-projet" className="md:col-span-3">
          <h2 id="footer-projet" className="font-sans text-xs font-semibold tracking-[0.18em] text-gold-400 uppercase">
            Le projet
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/village" className={linkClass}>
                Explorer le village
              </Link>
            </li>
            <li>
              <Link to="/#mission" className={linkClass}>
                Notre mission
              </Link>
            </li>
            <li>
              <Link to="/#independance" className={linkClass}>
                Indépendance numérique
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-ivory-50/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-ivory-100/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2025 NIRD WORLD — Projet réalisé dans le cadre de la Nuit de l’Info 2025.</p>
          <p>Démarche NIRD : Numérique Inclusif, Responsable et Durable.</p>
        </div>
      </div>
    </footer>
  )
}
