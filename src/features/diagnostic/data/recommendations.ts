import type { RecommendationTemplate } from '../types/diagnostic.ts'
import type { QuestionId } from './questions.ts'

/** One concrete action per assessed practice. The Record type guarantees every question has one. */
export const recommendationTemplates: Record<QuestionId, RecommendationTemplate> = {
  'll-postes': {
    title: 'Installer un socle de logiciels libres sur les postes',
    description:
      'Remplacer progressivement les logiciels propriétaires par des équivalents libres éprouvés, en commençant par les usages les plus courants.',
    steps: [
      'Recenser les logiciels installés sur les postes et leurs usages réels.',
      'Choisir des équivalents libres pour les usages courants (navigateur, bureautique, image, son).',
      'Déployer ce socle dans une salle pilote et recueillir les retours des utilisateurs.',
      'Généraliser le socle et documenter les exceptions propriétaires restantes.',
    ],
    benefit: 'Moins de licences à financer et des postes que l’établissement configure librement.',
    impact: 2,
    investigate: 'Faire l’inventaire des logiciels installés sur les postes et des licences associées.',
  },
  'll-bureautique': {
    title: 'Faire d’une suite bureautique libre l’outil de référence',
    description:
      'Une suite bureautique libre couvre l’essentiel des besoins de l’établissement et permet aux élèves d’utiliser les mêmes outils chez eux, gratuitement.',
    steps: [
      'Installer LibreOffice (ou une suite libre équivalente) sur tous les postes.',
      'Proposer un court temps de prise en main aux équipes.',
      'Définir la suite libre comme outil par défaut pour les nouveaux documents.',
      'Réserver la suite propriétaire aux besoins précisément identifiés.',
    ],
    benefit: 'Des économies de licences et une continuité entre l’établissement et le domicile des élèves.',
    impact: 2,
    investigate: 'Identifier les suites bureautiques installées et celles que les équipes utilisent réellement.',
  },
  'll-plateformes': {
    title: 'Privilégier des plateformes pédagogiques libres ou publiques',
    description:
      'Les plateformes libres ou publiques limitent l’exposition des données des élèves aux services commerciaux et ne dépendent pas d’un modèle économique changeant.',
    steps: [
      'Recenser les plateformes en ligne utilisées en classe.',
      'Identifier pour chacune un équivalent libre ou public (Moodle, ENT, services apps.education.fr).',
      'Accompagner les enseignants dans la migration de leurs activités.',
      'Inscrire ces plateformes comme référence dans la politique numérique.',
    ],
    benefit: 'Des données d’élèves mieux protégées et des outils pérennes.',
    impact: 3,
    investigate: 'Lister les plateformes en ligne réellement utilisées par les enseignants et les élèves.',
  },
  'll-formats': {
    title: 'Adopter les formats ouverts pour les documents',
    description:
      'Les formats ouverts garantissent que les documents restent lisibles dans le temps et avec n’importe quel logiciel.',
    steps: [
      'Rédiger une consigne courte sur les formats à privilégier (ODF, PDF, CSV, PNG).',
      'Configurer les logiciels pour enregistrer par défaut dans un format ouvert.',
      'Convertir les modèles de documents de l’établissement.',
      'Diffuser la consigne aux équipes et l’appliquer aux documents envoyés aux familles.',
    ],
    benefit: 'Des documents lisibles par tous, quel que soit le logiciel, et archivables durablement.',
    impact: 1,
    investigate: 'Observer dans quels formats circulent les documents internes et ceux envoyés aux familles.',
  },

  'sd-hebergement': {
    title: 'Cartographier l’hébergement des services numériques',
    description:
      'Savoir qui héberge quoi, et dans quel pays, est la première condition de la souveraineté des données.',
    steps: [
      'Lister tous les services en ligne utilisés, administratifs comme pédagogiques.',
      'Identifier pour chacun l’hébergeur et le pays de stockage des données.',
      'Repérer les services hébergés hors de l’Union européenne et étudier des alternatives.',
      'Confier la mise à jour de cet inventaire au référent numérique.',
    ],
    benefit: 'Une vision claire des dépendances et des risques liés au transfert des données.',
    impact: 3,
    investigate: 'Demander au référent numérique ou à la collectivité la liste des prestataires d’hébergement.',
  },
  'sd-maitrise': {
    title: 'Reprendre la maîtrise des données de l’établissement',
    description:
      'Les données des élèves et des personnels doivent rester sous le contrôle de l’établissement, et non de comptes personnels ou de prestataires.',
    steps: [
      'Mettre à jour le registre des traitements avec le délégué à la protection des données.',
      'Rapatrier les contenus des comptes personnels vers des espaces de l’établissement.',
      'Vérifier les conditions d’export et de suppression des données de chaque service.',
      'Prévoir une clause de réversibilité dans les prochains contrats.',
    ],
    benefit: 'Une conformité au RGPD renforcée et la liberté de changer de service sans perdre de données.',
    impact: 3,
    investigate: 'Vérifier auprès du délégué à la protection des données l’existence et l’état du registre des traitements.',
  },
  'sd-sauvegardes': {
    title: 'Mettre en place une stratégie de sauvegarde',
    description:
      'Une sauvegarde régulière, conservée à part et testée, protège l’établissement contre les pannes, les erreurs de manipulation et les rançongiciels.',
    steps: [
      'Identifier les données critiques de l’établissement.',
      'Définir la fréquence et la durée de conservation des sauvegardes.',
      'Conserver une copie dans un lieu indépendant des données d’origine.',
      'Tester la restauration à intervalles réguliers.',
    ],
    benefit: 'La continuité du service en cas d’incident, sans perte de données importantes.',
    impact: 3,
    investigate: 'Demander qui réalise les sauvegardes, où elles sont conservées et si une restauration a déjà été testée.',
  },
  'sd-acces': {
    title: 'Sécuriser la gestion des comptes et des droits',
    description:
      'Des comptes nominatifs, des droits adaptés à chaque fonction et des départs traités sans délai limitent les accès non autorisés.',
    steps: [
      'Remplacer les comptes partagés par des comptes nominatifs.',
      'Définir les droits selon les fonctions et les revoir chaque année.',
      'Désactiver les comptes dès le départ d’une personne.',
      'Activer la double authentification pour les accès sensibles.',
    ],
    benefit: 'Des données personnelles mieux protégées et des responsabilités claires en cas d’incident.',
    impact: 3,
    investigate: 'Vérifier comment les comptes sont créés, partagés et désactivés lors des départs.',
  },

  'dm-cycle': {
    title: 'Piloter le parc sur toute sa durée de vie',
    description:
      'Un inventaire précis permet de ne remplacer que ce qui doit l’être et d’allonger la durée d’usage du matériel.',
    steps: [
      'Constituer un inventaire indiquant l’âge et l’état de chaque équipement.',
      'Remplacer le critère d’âge par un critère d’état réel.',
      'Fixer avec la collectivité un objectif de durée d’usage.',
      'Suivre cet indicateur chaque année.',
    ],
    benefit: 'Moins d’achats, une empreinte environnementale réduite et un budget mieux maîtrisé.',
    impact: 2,
    investigate: 'Rechercher l’inventaire du parc et vérifier s’il mentionne l’âge et l’état des équipements.',
  },
  'dm-reparation': {
    title: 'Organiser la réparation des équipements',
    description: 'La plupart des pannes courantes se réparent à faible coût, à condition d’être diagnostiquées.',
    steps: [
      'Désigner un référent chargé du diagnostic des pannes.',
      'Tenir un registre simple des interventions.',
      'Remplacer les pièces d’usure (batterie, disque, mémoire) plutôt que l’appareil entier.',
      'Envisager un atelier de réparation associant des élèves volontaires.',
    ],
    benefit: 'Des équipements qui durent plus longtemps et des compétences techniques développées en interne.',
    impact: 2,
    investigate: 'Identifier qui intervient en cas de panne et ce que deviennent les appareils non réparés.',
  },
  'dm-reemploi': {
    title: 'Développer le reconditionnement du matériel',
    description:
      'Un ordinateur ancien peut retrouver une seconde vie après une remise à niveau ou l’installation d’un système libre léger.',
    steps: [
      'Repérer les postes anciens encore fonctionnels.',
      'Tester l’installation d’un système libre léger sur quelques postes.',
      'Intégrer du matériel reconditionné dans les prochains achats.',
      'Nouer un partenariat avec une association ou une structure de reconditionnement.',
    ],
    benefit: 'Un parc élargi à moindre coût et une réduction directe des déchets électroniques.',
    impact: 2,
    investigate: 'Vérifier ce que devient le matériel retiré du service et s’il pourrait être réemployé.',
  },
  'dm-deee': {
    title: 'Encadrer la fin de vie des équipements',
    description:
      'Les déchets électroniques doivent rejoindre une filière agréée, après un effacement sécurisé des données qu’ils contiennent.',
    steps: [
      'Identifier une filière de collecte agréée avec la collectivité.',
      'Effacer de manière sécurisée les supports de stockage avant tout départ.',
      'Conserver les bordereaux de prise en charge.',
      'Étudier systématiquement le réemploi avant le recyclage.',
    ],
    benefit: 'Une conformité réglementaire, des données protégées et des matériaux valorisés.',
    impact: 2,
    investigate: 'Demander à l’intendance ou à la collectivité quelle filière prend en charge les équipements hors d’usage.',
  },

  'an-assistance': {
    title: 'Rendre les technologies d’assistance disponibles',
    description:
      'Lecteurs d’écran, synthèse vocale ou loupes permettent à chaque élève d’accéder aux mêmes ressources que ses camarades.',
    steps: [
      'Recenser les besoins avec les équipes de suivi de la scolarisation.',
      'Installer des outils d’assistance libres (lecteur d’écran NVDA, synthèse vocale, loupe) sur les postes.',
      'Former des personnes ressources à leur configuration.',
      'Vérifier régulièrement que les outils fonctionnent sur chaque poste.',
    ],
    benefit: 'Une scolarité numérique accessible aux élèves en situation de handicap, sans coût de licence.',
    impact: 3,
    investigate: 'Vérifier avec les équipes de suivi quels outils d’assistance sont disponibles et sur quels postes.',
  },
  'an-contenus': {
    title: 'Produire des contenus pédagogiques accessibles',
    description: 'Quelques règles simples rendent les documents utilisables par tous les élèves.',
    steps: [
      'Diffuser une fiche des règles essentielles : titres structurés, textes alternatifs, contrastes, sous-titres.',
      'Fournir des modèles de documents accessibles.',
      'Vérifier l’accessibilité des contenus les plus diffusés.',
      'Proposer un temps de formation aux équipes.',
    ],
    benefit: 'Des contenus compréhensibles par tous, y compris par les élèves dyslexiques ou malvoyants.',
    impact: 2,
    investigate: 'Examiner quelques documents diffusés aux élèves pour vérifier leur accessibilité.',
  },
  'an-conception': {
    title: 'Intégrer l’accessibilité aux choix numériques',
    description: 'Vérifier l’accessibilité avant de choisir un service évite d’exclure des élèves ou des familles.',
    steps: [
      'Ajouter la conformité au RGAA aux critères de choix des services.',
      'Demander aux fournisseurs leur déclaration d’accessibilité.',
      'Associer des utilisateurs aux besoins variés aux tests avant adoption.',
      'Réévaluer les services déjà en place.',
    ],
    benefit: 'Des services utilisables par tous dès le départ, sans adaptations coûteuses après coup.',
    impact: 2,
    investigate: 'Vérifier si les services utilisés publient une déclaration d’accessibilité.',
  },
  'an-equipements': {
    title: 'Garantir l’accès quels que soient l’équipement et la connexion',
    description: 'Des services légers et des alternatives hors ligne évitent une fracture numérique entre les familles.',
    steps: [
      'Tester les services principaux sur un appareil ancien et avec une connexion lente.',
      'Prévoir des alternatives hors ligne ou imprimées pour les contenus essentiels.',
      'Organiser un dispositif de prêt de matériel.',
      'Intégrer la sobriété aux critères de choix des services.',
    ],
    benefit: 'Une égalité d’accès entre élèves, quelles que soient les ressources de leur famille.',
    impact: 2,
    investigate: 'Interroger les familles et les élèves sur leur équipement et leur accès à internet.',
  },

  'gn-politique': {
    title: 'Formaliser une politique numérique',
    description:
      'Une politique écrite donne un cap commun et évite que les choix dépendent de quelques personnes.',
    steps: [
      'Réunir direction, enseignants, agents et représentants des familles.',
      'Rédiger des orientations sur l’indépendance, la sobriété et l’accessibilité.',
      'Fixer des objectifs mesurables, des responsables et des échéances.',
      'Présenter la politique au conseil d’administration.',
    ],
    benefit: 'Des décisions cohérentes, portées collectivement et durables au-delà des changements d’équipe.',
    impact: 3,
    investigate: 'Vérifier si le projet d’établissement comporte un volet numérique et ce qu’il prévoit.',
  },
  'gn-achats': {
    title: 'Intégrer des critères responsables aux achats',
    description:
      'Les critères d’achat déterminent la durabilité et l’indépendance du parc pour plusieurs années.',
    steps: [
      'Rédiger une grille de critères : réparabilité, formats ouverts, localisation des données, accessibilité.',
      'L’appliquer dès les prochains achats.',
      'La partager avec la collectivité de rattachement.',
      'Documenter la justification de chaque choix.',
    ],
    benefit: 'Des achats plus durables et un coût global réduit sur la durée de vie des équipements.',
    impact: 2,
    investigate: 'Identifier qui décide des achats numériques et selon quels critères.',
  },
  'gn-formation': {
    title: 'Construire un plan de formation au numérique responsable',
    description:
      'Des équipes formées adoptent plus facilement les logiciels libres et les bons réflexes de protection des données.',
    steps: [
      'Recenser les besoins de formation des équipes.',
      'Identifier des personnes ressources en interne.',
      'Programmer des sessions courtes : logiciels libres, protection des données, accessibilité.',
      'Évaluer les effets en fin d’année.',
    ],
    benefit: 'Des équipes autonomes et confiantes dans leurs choix numériques.',
    impact: 2,
    investigate: 'Recenser les formations numériques suivies par les personnels ces dernières années.',
  },
  'gn-evaluation': {
    title: 'Évaluer régulièrement les pratiques numériques',
    description: 'Un bilan périodique permet de mesurer les progrès et d’ajuster les priorités.',
    steps: [
      'Refaire ce diagnostic chaque année, à la même période.',
      'Choisir quelques indicateurs de suivi.',
      'Présenter les résultats à la communauté éducative.',
      'Ajuster le plan d’action en conséquence.',
    ],
    benefit: 'Un pilotage fondé sur des constats plutôt que sur des impressions.',
    impact: 1,
    investigate: 'Vérifier si un bilan numérique a déjà été réalisé et où il est archivé.',
  },
}
