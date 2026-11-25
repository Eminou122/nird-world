import type { BandId, DimensionId } from '../types/diagnostic.ts'
import type { QuestionId } from './questions.ts'

/** Plain-language help shown around the diagnostic. Presentation only: nothing here is read by the engine. */

export interface QuestionGuide {
  why: string
  /** Technical words used in the question or its answers. */
  terms?: readonly { term: string; meaning: string }[]
}

export const questionGuides: Record<QuestionId, QuestionGuide> = {
  'll-postes': {
    why: 'Un logiciel libre peut être utilisé, étudié et partagé sans demander l’autorisation. Plus il y en a sur les postes, moins l’école dépend d’un éditeur.',
    terms: [
      { term: 'Logiciel propriétaire', meaning: 'logiciel dont un éditeur contrôle seul l’usage, le prix et l’évolution.' },
      { term: 'GNU/Linux', meaning: 'système libre, qui peut remplacer Windows ou macOS.' },
    ],
  },
  'll-bureautique': {
    why: 'Traitement de texte et tableur sont les outils les plus utilisés. S’ils sont libres, chaque élève peut avoir les mêmes chez lui, gratuitement.',
    terms: [{ term: 'LibreOffice', meaning: 'suite bureautique libre : texte, tableur, présentation.' }],
  },
  'll-plateformes': {
    why: 'Une plateforme de cours garde la trace du travail des élèves. Mieux vaut savoir qui la gère, et pouvoir compter sur elle longtemps.',
    terms: [
      { term: 'Moodle', meaning: 'plateforme de cours en ligne, libre.' },
      { term: 'Nextcloud', meaning: 'espace libre de stockage et de partage de fichiers.' },
      { term: 'apps.education.fr', meaning: 'services en ligne publics proposés aux enseignants.' },
    ],
  },
  'll-formats': {
    why: 'Un document dans un format ouvert s’ouvre avec n’importe quel logiciel, aujourd’hui comme dans dix ans.',
    terms: [
      { term: 'ODF', meaning: 'format ouvert des documents bureautiques (.odt, .ods, .odp).' },
      { term: 'Interopérabilité', meaning: 'capacité de plusieurs logiciels à échanger sans difficulté.' },
    ],
  },
  'sd-hebergement': {
    why: 'Vos données sont forcément quelque part, sur l’ordinateur de quelqu’un. Savoir chez qui, c’est savoir quelles règles s’appliquent.',
    terms: [{ term: 'Hébergeur', meaning: 'entreprise ou organisme qui stocke les données et fait fonctionner un service.' }],
  },
  'sd-maitrise': {
    why: 'Maîtriser ses données, c’est pouvoir les récupérer, les déplacer ou les effacer quand on le décide.',
    terms: [
      { term: 'Registre des traitements', meaning: 'liste, prévue par le RGPD, des usages faits des données personnelles.' },
      { term: 'Réversibilité', meaning: 'possibilité de reprendre ses données pour changer de prestataire.' },
    ],
  },
  'sd-sauvegardes': {
    why: 'Une panne, une fausse manœuvre ou un virus, et des années de travail peuvent disparaître. Une sauvegarde ne sert que si l’on sait la restaurer.',
    terms: [
      { term: 'Restauration', meaning: 'remise en place des données à partir d’une sauvegarde.' },
      { term: 'Hors site', meaning: 'dans un autre lieu que les données d’origine.' },
    ],
  },
  'sd-acces': {
    why: 'Un mot de passe partagé ou un compte oublié suffit pour que des données sortent de l’école.',
    terms: [{ term: 'Double authentification', meaning: 'mot de passe complété par une seconde preuve, comme un code reçu sur un téléphone.' }],
  },
  'dm-cycle': {
    why: 'Remplacer un appareil parce qu’il est « vieux » coûte cher et pollue. Regarder son état réel permet souvent de le garder.',
  },
  'dm-reparation': {
    why: 'Une batterie ou un disque usé ne condamne pas un ordinateur. Réparer, c’est aussi apprendre comment il fonctionne.',
  },
  'dm-reemploi': {
    why: 'Trop lent pour un usage, un ordinateur peut être parfait pour un autre, surtout avec un système plus léger.',
    terms: [{ term: 'Reconditionnement', meaning: 'remise en état d’un appareil pour lui donner une seconde vie.' }],
  },
  'dm-deee': {
    why: 'Un vieil appareil contient des matériaux polluants, et parfois encore des données personnelles.',
    terms: [{ term: 'Filière agréée', meaning: 'organisme habilité à collecter et à traiter les déchets électroniques.' }],
  },
  'an-assistance': {
    why: 'Pour certains élèves, ces outils font la différence entre suivre le cours et rester à l’écart.',
    terms: [
      { term: 'Lecteur d’écran', meaning: 'outil qui lit à voix haute ce qui est affiché.' },
      { term: 'Synthèse vocale', meaning: 'transformation d’un texte écrit en parole.' },
    ],
  },
  'an-contenus': {
    why: 'Un document bien structuré aide les élèves malvoyants ou dyslexiques, et se lit mieux pour tout le monde.',
    terms: [{ term: 'Texte alternatif', meaning: 'courte description d’une image, lue par un lecteur d’écran.' }],
  },
  'an-conception': {
    why: 'Il est plus simple de choisir un service accessible que de le corriger une fois qu’il est installé.',
    terms: [{ term: 'RGAA', meaning: 'règles françaises d’accessibilité des services numériques.' }],
  },
  'an-equipements': {
    why: 'Toutes les familles n’ont pas un ordinateur récent ni une bonne connexion. Un service léger n’oublie personne.',
    terms: [{ term: 'Sobriété', meaning: 'n’utiliser que les ressources vraiment nécessaires.' }],
  },
  'gn-politique': {
    why: 'Quand les choix sont écrits et partagés, ils survivent aux départs et restent cohérents.',
  },
  'gn-achats': {
    why: 'Un achat engage l’école pour des années. Regarder au-delà du prix évite bien des mauvaises surprises.',
    terms: [{ term: 'Réparabilité', meaning: 'facilité à démonter un appareil et à trouver ses pièces.' }],
  },
  'gn-formation': {
    why: 'Un outil n’est utile que si l’on sait s’en servir. La formation donne confiance et rend autonome.',
  },
  'gn-evaluation': {
    why: 'Faire le point de temps en temps montre ce qui a changé, et aide à choisir la suite.',
    terms: [{ term: 'Indicateur', meaning: 'chiffre suivi dans le temps, comme l’âge moyen des ordinateurs.' }],
  },
}

/** What each dimension is about, in the words of someone who has never heard of it. */
export const dimensionIntros: Record<DimensionId, string> = {
  'logiciels-libres': 'Les programmes et les formats que l’on utilise chaque jour.',
  'souverainete-donnees': 'Où vont vos données, et qui peut y accéder.',
  'durabilite-materielle': 'La vie des ordinateurs, de l’achat au recyclage.',
  accessibilite: 'Un numérique utilisable par chaque élève.',
  gouvernance: 'Comment les choix numériques se décident et se suivent.',
}

/** One-line reading of the overall score. The full band description stays in the detailed report. */
export const bandLines: Record<BandId, string> = {
  'tres-faible': 'Presque tout reste à construire, et chaque premier pas comptera.',
  fragile: 'Des initiatives existent, mais elles tiennent encore à quelques personnes.',
  'en-developpement': 'La démarche est lancée. Il reste à la généraliser.',
  avance: 'De bonnes pratiques sont en place. Il reste à les consolider.',
  exemplaire: 'Vous maîtrisez vos choix numériques. Votre expérience peut servir à d’autres.',
}
