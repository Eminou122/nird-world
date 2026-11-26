/** Types of the open-source discovery catalogue. Framework-free: shared by the data, search and UI. */

export type CategoryId = 'documents' | 'enseigner' | 'collaborer' | 'partager' | 'creer' | 'proteger'

export interface Category {
  id: CategoryId
  /** The user's goal, as a verb. */
  title: string
  description: string
}

export type Platform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'navigateur'

/** Where the tool runs. "installe": on each device. "serveur": on a server, used from a browser. "les-deux": both. */
export type HostingModel = 'installe' | 'serveur' | 'les-deux'

/**
 * Who can host it. "oui": you can run your own server. "sans-objet": there is no server to host.
 * "partiel": only part of the service.
 */
export type SelfHosting = 'oui' | 'sans-objet' | 'partiel'

export interface Source {
  label: string
  url: string
}

export interface Tool {
  id: string
  name: string
  categories: readonly [CategoryId, ...CategoryId[]]
  /** What it is for, in one line, without naming the technology. */
  purpose: string
  summary: string
  /** Typical uses in a school. */
  useCases: readonly string[]
  /** Extra words people may type; never displayed. */
  keywords: readonly string[]
  /** Proprietary products people often use today for the same need. */
  insteadOf: readonly string[]
  platforms: readonly [Platform, ...Platform[]]
  platformNote?: string
  /** Every tool listed is open source: its licence is approved by the Open Source Initiative. */
  license: { name: string; note?: string }
  /** Every tool listed can be used free of charge. Paid services around it, when there are some. */
  paidServices?: string
  hosting: HostingModel
  /** Only when it adds something to the hosting model. */
  hostingNote?: string
  selfHosting: SelfHosting
  advantages: readonly string[]
  limitations: readonly string[]
  /** What to know before entrusting it with data. Open source alone guarantees nothing. */
  dataNote: string
  website: string
  alternatives: readonly string[]
  sources: readonly [Source, ...Source[]]
}

export interface Explanation {
  id: string
  question: string
  paragraphs: readonly string[]
  sources: readonly Source[]
}
