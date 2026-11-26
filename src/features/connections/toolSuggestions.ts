import type { QuestionId } from '../diagnostic/data/questions.ts'

// Imports carry `.ts` so `node --test` can run this module without a bundler.

/**
 * Why one library tool can help with one diagnostic practice. Written for that pairing, never generic.
 * The tool's own limitations and data notes stay in the catalogue and are shown next to these lines.
 */
export interface ToolSuggestion {
  /** Id of a tool in `src/features/library/data/software.ts`. */
  toolId: string
  /** Why this tool relates to the practice the diagnostic flagged. */
  why: string
  /** What it can help the institution do. */
  helps: string
  /** Context where it tends to fit. */
  suitsIf: string
  /** Context where it fits less well. */
  lessIf: string
}

/**
 * Diagnostic practice (question id, the stable part of every recommendation id) → library tools.
 * Every question is listed, so "no tool" is a decision, not an oversight. A tool is only listed when it acts on the
 * practice itself, never because it belongs to the same broad theme.
 */
export const toolSuggestions: Record<QuestionId, readonly ToolSuggestion[]> = {
  'll-postes': [
    {
      toolId: 'libreoffice',
      why: 'La bureautique est l’usage le plus courant des postes : une suite libre installée localement le couvre.',
      helps: 'Équiper une salle pilote sans frais de licence, puis généraliser.',
      suitsIf: 'vos usages sont surtout du texte, des tableaux et des présentations.',
      lessIf: 'vos documents reposent sur des macros Visual Basic ou des mises en page Microsoft très complexes.',
    },
    {
      toolId: 'firefox',
      why: 'Le navigateur est souvent le premier logiciel libre facile à installer sur tous les postes.',
      helps: 'Faire un premier pas visible, avec un navigateur qui bloque par défaut les pisteurs connus.',
      suitsIf: 'vous cherchez une première étape simple et peu risquée.',
      lessIf: 'vos postes sont sous Windows 8.1 ou plus ancien : seule l’édition à support étendu (ESR) y est proposée.',
    },
  ],
  'll-bureautique': [
    {
      toolId: 'libreoffice',
      why: 'C’est précisément le type de suite bureautique libre visé par cette pratique.',
      helps: 'En faire l’outil par défaut pour les nouveaux documents, en gardant l’ancien pour les cas identifiés.',
      suitsIf: 'chacun rédige surtout sur son propre poste.',
      lessIf: 'vous écrivez souvent à plusieurs en même temps : il faudra un service en ligne en complément.',
    },
    {
      toolId: 'cryptpad',
      why: 'Le niveau le plus avancé de cette pratique inclut l’édition à plusieurs en ligne, hébergée par une structure de confiance.',
      helps: 'Rédiger à plusieurs en temps réel, sur un serveur qui n’a pas accès au contenu des documents.',
      suitsIf: 'vos équipes préparent souvent des documents à plusieurs.',
      lessIf: 'vous comptez sur une réinitialisation des mots de passe : elle n’est pas possible.',
    },
  ],
  'll-plateformes': [
    {
      toolId: 'moodle',
      why: 'Une plateforme de cours libre, que l’établissement peut héberger ou confier à un prestataire.',
      helps: 'Regrouper cours et activités en ligne dans un espace de l’établissement.',
      suitsIf: 'un serveur peut être géré en interne, ou confié à un prestataire.',
      lessIf: 'personne ne peut installer ni tenir à jour un serveur, et aucun budget d’hébergement n’est prévu.',
    },
    {
      toolId: 'bigbluebutton',
      why: 'Les classes virtuelles font partie des activités en ligne visées par cette question.',
      helps: 'Faire cours à distance avec un tableau blanc partagé, des petits groupes et des sondages.',
      suitsIf: 'vous faites régulièrement classe à distance.',
      lessIf: 'vous n’avez ni serveur puissant ni prestataire : il demande beaucoup de ressources.',
    },
  ],
  'll-formats': [
    {
      toolId: 'libreoffice',
      why: 'Une suite libre qui ouvre aussi les documents Microsoft Office aide à passer progressivement aux formats ouverts.',
      helps: 'Rouvrir les anciens documents et préparer de nouveaux modèles dans un format ouvert.',
      suitsIf: 'vos documents circulent entre équipes, élèves et familles.',
      lessIf: 'un partenaire impose un format propriétaire précis pour certains échanges.',
    },
  ],
  // Un inventaire des hébergeurs se construit, il ne s’installe pas.
  'sd-hebergement': [],
  'sd-maitrise': [
    {
      toolId: 'nextcloud',
      why: 'Il offre un espace de fichiers que l’établissement choisit d’héberger lui-même ou chez un prestataire.',
      helps: 'Rapatrier vers un espace de l’établissement les fichiers dispersés dans des comptes personnels.',
      suitsIf: 'vous pouvez assurer, ou confier, l’administration d’un serveur.',
      lessIf: 'personne ne peut sécuriser, mettre à jour et sauvegarder ce serveur.',
    },
  ],
  // Aucun outil du catalogue n’est un logiciel de sauvegarde (la documentation de Syncthing précise qu’il n’en est pas un).
  'sd-sauvegardes': [],
  'sd-acces': [
    {
      toolId: 'keepassxc',
      why: 'Les mots de passe partagés reviennent souvent quand chacun ne peut pas en retenir plusieurs.',
      helps: 'Garder un mot de passe différent pour chaque compte, sans l’envoyer sur un serveur.',
      suitsIf: 'les personnes qui gèrent les accès travaillent sur ordinateur.',
      lessIf: 'vous attendez une gestion des comptes : il ne remplace ni la revue des droits ni la désactivation des comptes au départ.',
    },
  ],
  // Les quatre pratiques suivantes relèvent de l’organisation et du matériel : le catalogue n’a pas d’outil qui les traite.
  'dm-cycle': [],
  'dm-reparation': [],
  'dm-reemploi': [],
  'dm-deee': [],
  // Le catalogue ne contient pas encore de technologie d’assistance (lecteur d’écran, synthèse vocale).
  'an-assistance': [],
  'an-contenus': [],
  'an-conception': [],
  'an-equipements': [
    {
      toolId: 'kolibri',
      why: 'Il est conçu pour fonctionner sans internet, avec des appareils anciens ou peu coûteux.',
      helps: 'Proposer leçons et exercices aux élèves, même quand la connexion manque.',
      suitsIf: 'une partie des élèves ou des salles a une connexion limitée.',
      lessIf: 'vos ressources doivent suivre exactement vos programmes : il faudra les choisir vous-même.',
    },
  ],
  // La gouvernance se décide et s’écrit : aucun logiciel ne la remplace.
  'gn-politique': [],
  'gn-achats': [],
  'gn-formation': [],
  'gn-evaluation': [],
}
