import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../components/layout/RootLayout'
import { BuildingPage } from '../features/buildings/BuildingPage'
import { LandingPage } from '../features/landing/LandingPage'
import { NotFoundPage } from '../features/not-found/NotFoundPage'
import { VillagePage } from '../features/village/VillagePage'
import { routePaths } from './routePaths'

/** The diagnostic is loaded on demand so the landing page and village stay light. */
const diagnostic = (page: 'DiagnosticIntroPage' | 'QuestionnairePage' | 'ResultsPage' | 'HistoryPage') => async () => {
  const pages = await import('../features/diagnostic/pages')
  return { Component: pages[page] }
}

const library = (page: 'LibraryPage' | 'ToolPage' | 'ComparePage') => async () => {
  const pages = await import('../features/library/pages')
  return { Component: pages[page] }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: routePaths.village, element: <VillagePage /> },
      // Open buildings have their own routes, which take precedence over the generic `village/:slug`.
      { path: routePaths.ecole, lazy: diagnostic('DiagnosticIntroPage') },
      { path: routePaths.questionnaire, lazy: diagnostic('QuestionnairePage') },
      { path: routePaths.results, lazy: diagnostic('ResultsPage') },
      { path: routePaths.history, lazy: diagnostic('HistoryPage') },
      { path: routePaths.library, lazy: library('LibraryPage') },
      { path: routePaths.tool, lazy: library('ToolPage') },
      { path: routePaths.compare, lazy: library('ComparePage') },
      { path: routePaths.building, element: <BuildingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
