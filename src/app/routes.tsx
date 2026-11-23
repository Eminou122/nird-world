import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../components/layout/RootLayout'
import { BuildingPage } from '../features/buildings/BuildingPage'
import { LandingPage } from '../features/landing/LandingPage'
import { NotFoundPage } from '../features/not-found/NotFoundPage'
import { VillagePage } from '../features/village/VillagePage'

/** The diagnostic is loaded on demand so the landing page and village stay light. */
const diagnostic = (page: 'DiagnosticIntroPage' | 'QuestionnairePage' | 'ResultsPage' | 'HistoryPage') => async () => {
  const pages = await import('../features/diagnostic/pages')
  return { Component: pages[page] }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'village', element: <VillagePage /> },
      // The École is the first open building: its own routes take precedence over the generic `village/:slug`.
      { path: 'village/ecole', lazy: diagnostic('DiagnosticIntroPage') },
      { path: 'village/ecole/diagnostic', lazy: diagnostic('QuestionnairePage') },
      { path: 'village/ecole/diagnostic/resultats/:id?', lazy: diagnostic('ResultsPage') },
      { path: 'village/ecole/historique', lazy: diagnostic('HistoryPage') },
      { path: 'village/:slug', element: <BuildingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
