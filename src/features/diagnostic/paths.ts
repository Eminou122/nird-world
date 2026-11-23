export const diagnosticPaths = {
  intro: '/village/ecole',
  questionnaire: '/village/ecole/diagnostic',
  results: (id?: string) => (id ? `/village/ecole/diagnostic/resultats/${id}` : '/village/ecole/diagnostic/resultats'),
  history: '/village/ecole/historique',
} as const
