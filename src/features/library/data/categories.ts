import type { Category, HostingModel, Platform, SelfHosting } from '../types/library.ts'

// Imports in the library's non-React modules carry `.ts` so `node --test` can run them without a bundler.

export const categories = [
  { id: 'documents', title: 'Créer des documents', description: 'Écrire, calculer, présenter, citer ses sources.' },
  { id: 'enseigner', title: 'Enseigner et apprendre', description: 'Proposer des cours, en classe ou à distance.' },
  { id: 'collaborer', title: 'Collaborer et communiquer', description: 'Se parler, s’écrire et travailler à plusieurs.' },
  { id: 'partager', title: 'Partager et stocker des fichiers', description: 'Garder ses fichiers, ses vidéos et ses pages à portée de main.' },
  { id: 'creer', title: 'Créer et concevoir', description: 'Images, dessins, sons, vidéos et sites.' },
  { id: 'proteger', title: 'Protéger son environnement numérique', description: 'Naviguer plus tranquillement et garder ses mots de passe en sécurité.' },
] as const satisfies readonly Category[]

/** Searches suggested on the Library's home page; each one is tested to return results. */
export const searchExamples = ['faire un podcast', 'remplacer Word', 'cours sans internet', 'mots de passe'] as const

export const platformLabels: Record<Platform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iPhone et iPad',
  navigateur: 'Navigateur web',
}

export const hostingLabels: Record<HostingModel, string> = {
  installe: 'S’installe sur chaque appareil',
  serveur: 'Fonctionne sur un serveur, dans le navigateur',
  'les-deux': 'Un serveur, et des applications à installer',
}

export const selfHostingLabels: Record<SelfHosting, string> = {
  oui: 'Oui, sur votre propre serveur',
  'sans-objet': 'Sans objet : il n’y a pas de serveur à héberger',
  partiel: 'En partie seulement',
}
