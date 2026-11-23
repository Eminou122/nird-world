import type { Dimension, DimensionId, InstitutionType, MaturityLevel, Question } from '../types/diagnostic.ts'

// Imports in the diagnostic's non-React modules carry `.ts` so `node --test` can run them without a bundler.

export const dimensions = [
  {
    id: 'logiciels-libres',
    letter: 'A',
    name: 'Logiciels libres',
    description: 'La place des logiciels libres, des plateformes ouvertes et des formats interopérables dans les usages.',
  },
  {
    id: 'souverainete-donnees',
    letter: 'B',
    name: 'Souveraineté des données',
    description: 'La connaissance des hébergeurs, la maîtrise des données, les sauvegardes et le contrôle des accès.',
  },
  {
    id: 'durabilite-materielle',
    letter: 'C',
    name: 'Durabilité matérielle',
    description: 'La durée de vie du matériel : renouvellement, réparation, reconditionnement et fin de vie.',
  },
  {
    id: 'accessibilite',
    letter: 'D',
    name: 'Accessibilité numérique',
    description: 'L’accès de toutes et tous au numérique : outils d’assistance, contenus, conception et équipements.',
  },
  {
    id: 'gouvernance',
    letter: 'E',
    name: 'Gouvernance numérique',
    description: 'La manière dont les choix numériques sont décidés, outillés, accompagnés et évalués.',
  },
] as const satisfies readonly Dimension[]

export const maturityLabels: Record<MaturityLevel, string> = {
  0: 'Absent',
  1: 'Initial',
  2: 'En développement',
  3: 'Établi',
  4: 'Avancé',
}

export const institutionTypes: Record<InstitutionType, string> = {
  'ecole-primaire': 'École primaire',
  college: 'Collège',
  lycee: 'Lycée',
  universite: 'Université',
  'centre-formation': 'Centre de formation',
  autre: 'Autre',
}

export const questions = [
  // A. Logiciels libres
  {
    id: 'll-postes',
    dimension: 'logiciels-libres',
    title: 'Logiciels libres sur les postes de travail',
    prompt: 'Quelle place occupent les logiciels libres sur les postes de travail de l’établissement ?',
    levels: [
      'Aucun logiciel libre n’est installé : les postes fonctionnent exclusivement avec des logiciels propriétaires.',
      'Quelques logiciels libres (navigateur, lecteur multimédia) sont installés ponctuellement, à l’initiative de personnes isolées.',
      'Une liste de logiciels libres est déployée sur une partie des postes, sans plan d’ensemble.',
      'Les logiciels libres sont installés par défaut sur la majorité des postes ; chaque exception propriétaire est justifiée.',
      'Les postes reposent majoritairement sur un système libre (GNU/Linux par exemple) et un socle d’applications libres maintenu et documenté.',
    ],
  },
  {
    id: 'll-bureautique',
    dimension: 'logiciels-libres',
    title: 'Outils bureautiques libres',
    prompt: 'Quels outils bureautiques les équipes et les élèves utilisent-ils au quotidien ?',
    levels: [
      'Seule une suite bureautique propriétaire est installée et utilisée.',
      'Une suite libre (LibreOffice ou équivalent) est installée sur quelques postes, mais rarement utilisée.',
      'Une suite libre est disponible sur tous les postes, mais la suite propriétaire reste l’outil principal.',
      'La suite libre est l’outil de référence ; une suite propriétaire n’est conservée que pour des besoins identifiés.',
      'Tous les usages bureautiques reposent sur des outils libres, y compris l’édition collaborative en ligne, hébergée par une structure de confiance.',
    ],
  },
  {
    id: 'll-plateformes',
    dimension: 'logiciels-libres',
    title: 'Plateformes pédagogiques ouvertes',
    prompt:
      'Sur quelles plateformes reposent les activités pédagogiques en ligne (espace de cours, exercices, classes virtuelles) ?',
    levels: [
      'Les activités reposent sur des plateformes commerciales choisies individuellement, sans cadre d’établissement.',
      'Quelques enseignants utilisent des plateformes libres ou publiques, de manière isolée.',
      'Des plateformes libres ou publiques sont proposées officiellement, mais coexistent avec de nombreux services commerciaux.',
      'Des plateformes libres ou publiques (Moodle, Nextcloud, services apps.education.fr…) sont la référence pour la majorité des activités.',
      'Toutes les activités en ligne s’appuient sur des plateformes libres ou publiques, administrées et documentées pour l’établissement.',
    ],
  },
  {
    id: 'll-formats',
    dimension: 'logiciels-libres',
    title: 'Formats ouverts et interopérables',
    prompt: 'Dans quels formats les documents sont-ils produits, échangés et archivés ?',
    levels: [
      'Les documents circulent uniquement dans des formats propriétaires (.docx, .xlsx, .pptx), sans réflexion sur l’interopérabilité.',
      'Le PDF est utilisé pour la diffusion, mais les documents de travail restent dans des formats propriétaires.',
      'Les formats ouverts (ODF, PDF, CSV, PNG) sont connus et utilisés par une partie des équipes.',
      'Une consigne écrite recommande les formats ouverts, appliquée dans la plupart des échanges.',
      'Les formats ouverts sont la règle pour la production, l’archivage et la diffusion ; les exceptions sont documentées.',
    ],
  },

  // B. Souveraineté des données
  {
    id: 'sd-hebergement',
    dimension: 'souverainete-donnees',
    title: 'Connaissance des hébergeurs',
    prompt: 'L’établissement sait-il qui héberge ses services numériques et où sont stockées ses données ?',
    levels: [
      'Personne ne sait précisément quels prestataires hébergent les services utilisés, ni dans quels pays.',
      'Les principaux services sont connus, mais pas leurs hébergeurs ni la localisation des données.',
      'Une liste partielle des services et de leurs hébergeurs existe, sans vérification des conditions contractuelles.',
      'Un inventaire à jour recense chaque service, son hébergeur et le pays de stockage des données.',
      'Les services sont hébergés par des acteurs publics ou de confiance dans l’Union européenne, avec un inventaire tenu à jour et des engagements contractuels vérifiés.',
    ],
  },
  {
    id: 'sd-maitrise',
    dimension: 'souverainete-donnees',
    title: 'Maîtrise des données de l’établissement',
    prompt: 'L’établissement garde-t-il la maîtrise des données qu’il produit (élèves, personnels, contenus pédagogiques) ?',
    levels: [
      'Les données sont dispersées dans des comptes personnels ou des services gratuits ; l’établissement ne peut ni les récupérer ni les supprimer.',
      'Une partie des données est stockée sur des espaces de l’établissement, mais beaucoup de contenus restent sur des comptes personnels.',
      'Les données principales sont sur des espaces de l’établissement ; leur récupération en cas de changement de prestataire n’a pas été envisagée.',
      'Les données sont stockées sur des espaces maîtrisés, un registre des traitements existe et les conditions de récupération sont connues.',
      'L’établissement peut exporter toutes ses données dans des formats ouverts, tient son registre des traitements à jour et a contractualisé la réversibilité.',
    ],
  },
  {
    id: 'sd-sauvegardes',
    dimension: 'souverainete-donnees',
    title: 'Sauvegarde et restauration des données',
    prompt: 'Comment les données importantes de l’établissement sont-elles sauvegardées et restaurées ?',
    levels: [
      'Aucune sauvegarde n’est organisée : une panne ou une erreur peut entraîner une perte définitive.',
      'Des sauvegardes sont faites ponctuellement, à l’initiative d’une personne, sans calendrier.',
      'Des sauvegardes régulières existent, mais elles sont stockées au même endroit que les données d’origine ou ne sont jamais testées.',
      'Des sauvegardes automatiques sont conservées dans un lieu distinct, et une restauration a déjà été réalisée avec succès.',
      'Une procédure écrite définit les données critiques, la fréquence, la conservation hors site et des tests de restauration planifiés.',
    ],
  },
  {
    id: 'sd-acces',
    dimension: 'souverainete-donnees',
    title: 'Contrôle des accès et protection des données',
    prompt: 'Comment les accès aux données et aux services numériques sont-ils attribués et contrôlés ?',
    levels: [
      'Des comptes et des mots de passe sont partagés entre plusieurs personnes ; aucun suivi des accès n’existe.',
      'Chaque personne a son compte, mais les droits ne sont jamais revus et les comptes des personnes parties restent actifs.',
      'Les droits sont attribués selon la fonction ; les départs sont traités, mais de façon irrégulière.',
      'Les comptes sont nominatifs, les droits sont revus chaque année et les départs sont traités systématiquement.',
      'Les accès sensibles sont protégés par une double authentification, les droits sont revus régulièrement et une procédure encadre les incidents.',
    ],
  },

  // C. Durabilité matérielle
  {
    id: 'dm-cycle',
    dimension: 'durabilite-materielle',
    title: 'Gestion du cycle de vie du matériel',
    prompt: 'Comment le renouvellement du matériel informatique est-il décidé ?',
    levels: [
      'Le matériel est remplacé dès qu’il ralentit ou à l’occasion d’une dotation, sans inventaire.',
      'Un inventaire existe, mais il n’indique ni l’âge ni l’état des équipements.',
      'L’inventaire suit l’âge et l’état du matériel, mais le renouvellement reste fixé à une durée standard.',
      'Le renouvellement est décidé selon l’état réel de chaque équipement, avec un objectif explicite d’allongement de la durée d’usage.',
      'Le parc est piloté sur tout son cycle de vie (achat, maintenance, réemploi, fin de vie) avec un indicateur de durée d’usage suivi chaque année.',
    ],
  },
  {
    id: 'dm-reparation',
    dimension: 'durabilite-materielle',
    title: 'Réparation et maintenance',
    prompt: 'Que se passe-t-il lorsqu’un équipement tombe en panne ?',
    levels: [
      'L’équipement est mis de côté ou jeté, sans diagnostic de la panne.',
      'Une personne volontaire tente parfois une réparation.',
      'Un prestataire ou un référent répare les pannes courantes, sans suivi des interventions.',
      'Les pannes sont diagnostiquées et suivies ; les pièces d’usure (batterie, disque, mémoire) sont remplacées plutôt que l’appareil.',
      'Une organisation de maintenance préventive et de réparation existe (référents formés, atelier, élèves impliqués) et les interventions sont documentées.',
    ],
  },
  {
    id: 'dm-reemploi',
    dimension: 'durabilite-materielle',
    title: 'Réemploi et reconditionnement',
    prompt: 'Le matériel ancien est-il réemployé ou reconditionné ?',
    levels: [
      'Le matériel ancien est stocké ou évacué sans évaluation de son potentiel de réemploi.',
      'Quelques appareils sont donnés ou réutilisés de manière informelle.',
      'Des postes anciens sont réinstallés ponctuellement, par exemple avec un système plus léger, pour prolonger leur usage.',
      'Le reconditionnement est une pratique régulière et l’établissement achète aussi du matériel reconditionné.',
      'Une filière organisée de reconditionnement et de réemploi fonctionne avec des partenaires (associations, collectivité, ateliers d’élèves).',
    ],
  },
  {
    id: 'dm-deee',
    dimension: 'durabilite-materielle',
    title: 'Gestion des déchets électroniques',
    prompt: 'Comment les équipements hors d’usage sont-ils pris en charge ?',
    levels: [
      'Les équipements hors d’usage sont jetés avec les déchets courants ou s’accumulent sans solution.',
      'Les équipements sont stockés en attendant une solution ; aucune filière n’est identifiée.',
      'Une filière de collecte agréée est utilisée de temps en temps.',
      'Une filière agréée est utilisée systématiquement, après effacement sécurisé des données des supports.',
      'La fin de vie est tracée (bordereaux, quantités), les données sont effacées de façon certifiée et le réemploi est toujours étudié avant le recyclage.',
    ],
  },

  // D. Accessibilité numérique
  {
    id: 'an-assistance',
    dimension: 'accessibilite',
    title: 'Technologies d’assistance',
    prompt: 'Les élèves et les personnels peuvent-ils utiliser des technologies d’assistance (lecteur d’écran, synthèse vocale, loupe) ?',
    levels: [
      'Aucune technologie d’assistance n’est disponible ni prise en compte.',
      'Des outils sont installés au cas par cas, quand une famille ou un personnel le demande.',
      'Quelques outils d’assistance sont disponibles sur certains postes.',
      'Les outils d’assistance sont disponibles sur tous les postes et des personnes savent les configurer.',
      'Les besoins sont recensés avec les équipes de suivi, les outils sont déployés et maintenus, et les utilisateurs sont accompagnés.',
    ],
  },
  {
    id: 'an-contenus',
    dimension: 'accessibilite',
    title: 'Accessibilité des contenus pédagogiques',
    prompt: 'Les contenus numériques produits pour les élèves sont-ils accessibles ?',
    levels: [
      'L’accessibilité n’est pas prise en compte : images sans description, documents scannés, vidéos sans sous-titres.',
      'Quelques personnes appliquent des bonnes pratiques, de leur propre initiative.',
      'Des consignes d’accessibilité existent, mais elles sont peu connues ou peu appliquées.',
      'Les principaux contenus respectent des règles connues : titres structurés, textes alternatifs, contrastes, sous-titres.',
      'L’accessibilité est vérifiée avant chaque diffusion et les équipes sont formées à produire des contenus accessibles.',
    ],
  },
  {
    id: 'an-conception',
    dimension: 'accessibilite',
    title: 'Conception numérique inclusive',
    prompt: 'Les besoins de tous les publics sont-ils pris en compte lors du choix ou de la conception des services numériques ?',
    levels: [
      'Les besoins des personnes en situation de handicap ou éloignées du numérique ne sont pas considérés.',
      'Ces besoins sont pris en compte seulement après un problème signalé.',
      'L’accessibilité est évoquée lors des choix, sans vérification concrète.',
      'La conformité au RGAA ou des tests avec des utilisateurs variés font partie des critères de choix.',
      'Les services sont choisis ou conçus avec les publics concernés, et leur accessibilité est réévaluée régulièrement.',
    ],
  },
  {
    id: 'an-equipements',
    dimension: 'accessibilite',
    title: 'Compatibilité avec les équipements et la connectivité',
    prompt: 'Les services numériques restent-ils utilisables avec un équipement ancien ou une connexion limitée ?',
    levels: [
      'Les services exigent un équipement récent et une connexion rapide ; les familles moins équipées sont exclues.',
      'Les difficultés d’équipement ou de connexion sont connues, mais aucune solution n’est prévue.',
      'Des solutions ponctuelles existent, comme le prêt de matériel ou des documents imprimés sur demande.',
      'Les services choisis fonctionnent sur des appareils anciens, sur mobile et en connexion lente ; des alternatives hors ligne existent.',
      'La compatibilité et la sobriété (pages légères, usage hors ligne) sont des critères formalisés, et un dispositif de prêt de matériel est organisé.',
    ],
  },

  // E. Gouvernance numérique
  {
    id: 'gn-politique',
    dimension: 'gouvernance',
    title: 'Politique numérique de l’établissement',
    prompt: 'L’établissement dispose-t-il d’une politique numérique formalisée ?',
    levels: [
      'Aucune orientation numérique n’est formalisée ; les choix dépendent d’initiatives individuelles.',
      'Des orientations existent oralement ou dans des documents dispersés.',
      'Un volet numérique figure dans le projet d’établissement, sans objectifs mesurables.',
      'Une politique numérique écrite fixe des objectifs, des responsables et des échéances.',
      'La politique numérique, construite avec la communauté éducative, intègre l’indépendance, la sobriété et l’accessibilité, et elle est révisée régulièrement.',
    ],
  },
  {
    id: 'gn-achats',
    dimension: 'gouvernance',
    title: 'Critères d’achat numérique',
    prompt: 'Quels critères guident les achats numériques (matériel, logiciels, services en ligne) ?',
    levels: [
      'Seul le prix d’achat est pris en compte.',
      'Quelques critères techniques s’ajoutent au prix, au cas par cas.',
      'Des critères de durabilité ou d’interopérabilité sont parfois pris en compte.',
      'Une grille écrite intègre la réparabilité, les formats ouverts, la localisation des données et l’accessibilité.',
      'Cette grille est appliquée à tous les achats, partagée avec la collectivité, et chaque choix est documenté.',
    ],
  },
  {
    id: 'gn-formation',
    dimension: 'gouvernance',
    title: 'Formation et culture numérique des équipes',
    prompt: 'Les personnels sont-ils formés aux usages numériques responsables ?',
    levels: [
      'Aucune formation n’est proposée.',
      'Des formations sont suivies individuellement, sans lien avec les orientations de l’établissement.',
      'Des formations collectives ont lieu ponctuellement.',
      'Un plan de formation annuel couvre les logiciels libres, la protection des données et l’accessibilité.',
      'Le plan de formation part des besoins recensés, s’appuie sur des personnes ressources internes et ses effets sont évalués.',
    ],
  },
  {
    id: 'gn-evaluation',
    dimension: 'gouvernance',
    title: 'Évaluation périodique des pratiques',
    prompt: 'Les pratiques numériques de l’établissement sont-elles évaluées périodiquement ?',
    levels: [
      'Aucune évaluation n’est réalisée.',
      'Un bilan informel est fait de temps en temps.',
      'Un bilan est réalisé, sans indicateurs définis ni suivi des actions décidées.',
      'Un bilan annuel s’appuie sur des indicateurs définis et donne lieu à un plan d’action.',
      'Les indicateurs sont suivis dans le temps, partagés avec la communauté éducative et utilisés pour ajuster la politique numérique.',
    ],
  },
] as const satisfies readonly Question[]

export type QuestionId = (typeof questions)[number]['id']

export const questionsOf = (dimension: DimensionId): readonly Question[] =>
  questions.filter((question) => question.dimension === dimension)

export const getDimension = (id: DimensionId): Dimension =>
  dimensions.find((dimension) => dimension.id === id) ?? dimensions[0]

export const getQuestion = (id: string): Question | undefined => questions.find((question) => question.id === id)
