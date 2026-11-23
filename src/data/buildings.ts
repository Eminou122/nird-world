import {
  BookOpen,
  ChartLine,
  ClipboardList,
  Compass,
  FileText,
  Gauge,
  HardDrive,
  KeyRound,
  Landmark,
  Leaf,
  Library,
  ListChecks,
  Recycle,
  Route,
  ScrollText,
  ShieldCheck,
  Telescope,
  Users,
  Wrench,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

export type BuildingSlug =
  | 'ecole'
  | 'bibliotheque'
  | 'laboratoire'
  | 'atelier'
  | 'hotel-de-ville'
  | 'observatoire'

export type PillarId = 'inclusif' | 'responsable' | 'durable'

export interface Pillar {
  id: PillarId
  letter: string
  name: string
  description: string
}

export interface PlannedFeature {
  title: string
  description: string
  icon: LucideIcon
}

export interface Building {
  slug: BuildingSlug
  number: string
  name: string
  theme: string
  summary: string
  description: string
  icon: LucideIcon
  pillar: PillarId
  missionLink: string
  planned: readonly [PlannedFeature, PlannedFeature, PlannedFeature]
}

export const pillars: Record<PillarId, Pillar> = {
  inclusif: {
    id: 'inclusif',
    letter: 'I',
    name: 'Inclusif',
    description: 'Un numérique accessible à toutes et à tous, qui ne laisse aucun élève ni aucune équipe de côté.',
  },
  responsable: {
    id: 'responsable',
    letter: 'R',
    name: 'Responsable',
    description: 'Des choix éclairés, qui protègent les données et respectent celles et ceux qui les utilisent.',
  },
  durable: {
    id: 'durable',
    letter: 'D',
    name: 'Durable',
    description: 'Un matériel qui dure, des usages sobres et un impact environnemental maîtrisé.',
  },
}

export const buildings: readonly Building[] = [
  {
    slug: 'ecole',
    number: '01',
    name: 'École',
    theme: 'Diagnostic numérique',
    summary: 'Évaluer où en est votre établissement.',
    description:
      'Point de départ du parcours, l’École accueille un diagnostic guidé qui mesure le degré d’indépendance numérique d’un établissement : logiciels, données, matériel, accessibilité et gouvernance.',
    icon: GraduationCap,
    pillar: 'responsable',
    missionLink:
      'Avant de transformer, il faut comprendre. Le diagnostic donne à chaque établissement une image honnête de ses dépendances et oriente la suite du parcours dans le village.',
    planned: [
      {
        title: 'Questionnaire guidé',
        description: 'Des questions claires, adaptées aux équipes de direction, aux enseignants et aux agents.',
        icon: ClipboardList,
      },
      {
        title: 'Profil d’indépendance',
        description: 'Une synthèse lisible des forces et des dépendances de l’établissement.',
        icon: Compass,
      },
      {
        title: 'Pistes prioritaires',
        description: 'Des recommandations concrètes, classées selon l’effort demandé et l’impact attendu.',
        icon: ListChecks,
      },
    ],
  },
  {
    slug: 'bibliotheque',
    number: '02',
    name: 'Bibliothèque',
    theme: 'Logiciels libres et ressources',
    summary: 'Trouver des alternatives libres et éprouvées.',
    description:
      'La Bibliothèque rassemblera des logiciels libres adaptés à l’école, des retours d’expérience et des guides pour accompagner leur adoption en classe comme dans l’administration.',
    icon: Library,
    pillar: 'inclusif',
    missionLink:
      'Les logiciels libres se partagent, s’adaptent et s’étudient. Ils permettent à chaque établissement, quels que soient ses moyens, de choisir ses outils plutôt que de les subir.',
    planned: [
      {
        title: 'Catalogue d’alternatives',
        description: 'Des correspondances claires entre outils propriétaires et logiciels libres, classées par usage.',
        icon: BookOpen,
      },
      {
        title: 'Retours d’expérience',
        description: 'Des témoignages d’établissements qui ont déjà franchi le pas.',
        icon: Users,
      },
      {
        title: 'Guides de prise en main',
        description: 'Des fiches courtes pour accompagner enseignants et élèves au quotidien.',
        icon: FileText,
      },
    ],
  },
  {
    slug: 'laboratoire',
    number: '03',
    name: 'Laboratoire',
    theme: 'Cybersécurité et protection des données',
    summary: 'Protéger les élèves, les équipes et leurs données.',
    description:
      'Le Laboratoire proposera des repères concrets pour sécuriser les usages numériques de l’établissement et protéger les données personnelles des élèves et des personnels.',
    icon: ShieldCheck,
    pillar: 'responsable',
    missionLink:
      'Être indépendant, c’est aussi savoir où sont ses données et qui y a accès. La sécurité devient une compétence partagée, et non une affaire de spécialistes.',
    planned: [
      {
        title: 'Bonnes pratiques essentielles',
        description: 'Mots de passe, mises à jour, sauvegardes : les gestes qui protègent vraiment.',
        icon: KeyRound,
      },
      {
        title: 'Repères RGPD',
        description: 'Une méthode pour recenser les traitements de données et les sécuriser.',
        icon: ShieldCheck,
      },
      {
        title: 'Ateliers de sensibilisation',
        description: 'Des scénarios courts à mener avec les élèves pour comprendre les risques.',
        icon: Users,
      },
    ],
  },
  {
    slug: 'atelier',
    number: '04',
    name: 'Atelier',
    theme: 'Réparation et durabilité',
    summary: 'Faire durer le matériel plutôt que le remplacer.',
    description:
      'L’Atelier aidera les établissements à prolonger la vie de leurs ordinateurs : reconditionnement, installation de systèmes libres plus légers, réparation et filières de réemploi.',
    icon: Wrench,
    pillar: 'durable',
    missionLink:
      'La fabrication du matériel concentre l’essentiel de l’empreinte environnementale du numérique. Réparer et reconditionner, c’est réduire cet impact tout en préservant les budgets.',
    planned: [
      {
        title: 'Bilan du parc informatique',
        description: 'Repérer les postes qui peuvent être reconditionnés plutôt que remplacés.',
        icon: HardDrive,
      },
      {
        title: 'Fiches de réparation',
        description: 'Des procédures pas à pas pour les pannes et les remises à niveau courantes.',
        icon: Wrench,
      },
      {
        title: 'Filières de réemploi',
        description: 'Des pistes pour donner, reconditionner ou recycler le matériel en fin de cycle.',
        icon: Recycle,
      },
    ],
  },
  {
    slug: 'hotel-de-ville',
    number: '05',
    name: 'Hôtel de Ville',
    theme: 'Gouvernance numérique',
    summary: 'Décider ensemble des choix numériques.',
    description:
      'L’Hôtel de Ville accompagnera les décisions collectives : qui décide, selon quelle feuille de route, et avec quels engagements partagés entre établissement, collectivité et communauté éducative.',
    icon: Landmark,
    pillar: 'responsable',
    missionLink:
      'Une transition numérique durable ne repose pas sur une seule personne. Elle s’appuie sur des choix explicites, documentés et portés collectivement.',
    planned: [
      {
        title: 'Feuille de route',
        description: 'Planifier la transition par étapes, sur plusieurs années scolaires.',
        icon: Route,
      },
      {
        title: 'Rôles et responsabilités',
        description: 'Clarifier ce qui relève de l’établissement, de la collectivité et de l’académie.',
        icon: Users,
      },
      {
        title: 'Charte numérique',
        description: 'Un cadre commun pour formaliser les engagements de l’établissement.',
        icon: ScrollText,
      },
    ],
  },
  {
    slug: 'observatoire',
    number: '06',
    name: 'Observatoire',
    theme: 'Indicateurs et impact',
    summary: 'Mesurer les progrès et rendre l’impact visible.',
    description:
      'L’Observatoire réunira les indicateurs qui permettent de suivre la transition dans le temps : niveau d’indépendance, durée de vie du matériel et empreinte environnementale.',
    icon: Telescope,
    pillar: 'durable',
    missionLink:
      'Ce qui se mesure se pilote. L’Observatoire rend les progrès tangibles et aide à rendre compte des efforts accomplis auprès de toute la communauté éducative.',
    planned: [
      {
        title: 'Tableau de bord',
        description: 'Une vue d’ensemble des indicateurs clés de l’établissement.',
        icon: Gauge,
      },
      {
        title: 'Empreinte environnementale',
        description: 'Une estimation de l’impact du parc informatique et des gains obtenus.',
        icon: Leaf,
      },
      {
        title: 'Évolution dans le temps',
        description: 'Comparer les résultats d’une année sur l’autre pour mesurer le chemin parcouru.',
        icon: ChartLine,
      },
    ],
  },
]

export function getBuilding(slug: string | undefined): Building | undefined {
  return buildings.find((building) => building.slug === slug)
}

export const buildingPath = (slug: BuildingSlug) => `/village/${slug}`
