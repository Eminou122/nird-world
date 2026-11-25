import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function RootLayout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  // Move focus to the new page's content after client-side navigation (screen readers, keyboard users).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!hash) mainRef.current?.focus({ preventScroll: true })
  }, [pathname, hash])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only z-50 rounded-full bg-gold-400 px-4 py-2 font-semibold text-forest-900 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <SiteHeader />
      <main id="contenu" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      {/* Every direct page load shares the key "default": keep one scroll position per page instead. */}
      <ScrollRestoration getKey={({ key, pathname }) => (key === 'default' ? pathname : key)} />
    </div>
  )
}
