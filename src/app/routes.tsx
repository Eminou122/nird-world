import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../components/layout/RootLayout'
import { BuildingPage } from '../features/buildings/BuildingPage'
import { LandingPage } from '../features/landing/LandingPage'
import { NotFoundPage } from '../features/not-found/NotFoundPage'
import { VillagePage } from '../features/village/VillagePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'village', element: <VillagePage /> },
      { path: 'village/:slug', element: <BuildingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
