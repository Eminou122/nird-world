import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Logo } from '../ui/Logo'

const navItems = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/village', label: 'Le village', end: false },
  { to: '/#mission', label: 'Notre mission' },
  { to: '/#independance', label: 'Indépendance numérique' },
] as const

const linkBase = 'rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  const renderLinks = (mobile: boolean) =>
    navItems.map((item) => {
      const className = mobile ? 'block rounded-lg px-3 py-3 text-base font-medium' : linkBase
      if ('end' in item) {
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={close}
              className={({ isActive }) =>
                `${className} ${isActive ? 'bg-ivory-50/10 text-gold-300' : 'text-ivory-100/80 hover:bg-ivory-50/5 hover:text-ivory-50'}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        )
      }
      return (
        <li key={item.to}>
          <Link to={item.to} onClick={close} className={`${className} text-ivory-100/80 hover:bg-ivory-50/5 hover:text-ivory-50`}>
            {item.label}
          </Link>
        </li>
      )
    })

  return (
    <header className="sticky top-0 z-40 print:hidden border-b border-ivory-50/10 bg-forest-900/95 backdrop-blur supports-[backdrop-filter]:bg-forest-900/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" onClick={close} className="rounded-md" aria-label="NIRD WORLD — accueil">
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">{renderLinks(false)}</ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/village"
            className="hidden min-h-10 items-center gap-2 rounded-full bg-gold-400 px-4 text-sm font-semibold text-forest-900 transition-colors hover:bg-gold-300 sm:inline-flex"
          >
            Explorer le village <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ivory-50 hover:bg-ivory-50/10 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation principale" className="border-t border-ivory-50/10 px-5 pt-2 pb-5 sm:px-8 lg:hidden">
          <ul className="space-y-1">{renderLinks(true)}</ul>
          <Link
            to="/village"
            onClick={close}
            className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold-400 px-4 font-semibold text-forest-900 sm:hidden"
          >
            Explorer le village <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      )}
    </header>
  )
}
