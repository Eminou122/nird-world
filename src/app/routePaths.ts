/** Every route of the app, in one place, so tests can check that each generated link leads to a real page. */
export const routePaths = {
  village: 'village',
  ecole: 'village/ecole',
  questionnaire: 'village/ecole/diagnostic',
  results: 'village/ecole/diagnostic/resultats/:id?',
  history: 'village/ecole/historique',
  library: 'village/bibliotheque',
  tool: 'village/bibliotheque/outils/:id',
  compare: 'village/bibliotheque/comparer',
  building: 'village/:slug',
} as const
