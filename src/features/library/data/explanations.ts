import type { Explanation } from '../types/library.ts'

export const explanations: readonly Explanation[] = [
  {
    id: 'libre',
    question: 'Que veut dire « logiciel libre » ?',
    paragraphs: [
      'C’est un logiciel que chacun peut utiliser, étudier, modifier et partager. Son code, c’est-à-dire sa recette, est public.',
      'On parle aussi d’« open source » : le mot insiste sur l’ouverture du code, et des critères publics disent quelles licences y ont droit. À l’inverse, un logiciel propriétaire ne donne pas ces libertés, même s’il est gratuit.',
    ],
    sources: [
      { label: 'Définition du logiciel libre (GNU)', url: 'https://www.gnu.org/philosophy/free-sw.fr.html' },
      { label: 'Définition de l’open source (OSI)', url: 'https://opensource.org/osd' },
    ],
  },
  {
    id: 'gratuit',
    question: 'Un logiciel libre peut-il être payant ?',
    paragraphs: [
      'Oui. « Libre » parle de liberté, pas de prix : on peut vendre un logiciel libre, ou faire payer l’hébergement, l’installation et l’assistance.',
      'Tous les outils présentés ici peuvent être utilisés gratuitement. Quand des services payants existent autour, la fiche le précise. Et l’inverse est vrai : un logiciel gratuit n’est pas forcément libre.',
    ],
    sources: [
      { label: 'Libre ne veut pas dire gratuit (GNU)', url: 'https://www.gnu.org/philosophy/free-sw.fr.html' },
      { label: 'Vendre un logiciel open source (OSI)', url: 'https://opensource.org/faq' },
    ],
  },
  {
    id: 'heberger',
    question: 'Pourquoi héberger un outil soi-même ?',
    paragraphs: [
      'Héberger, c’est faire fonctionner un service sur un ordinateur toujours allumé : le serveur. Si c’est le vôtre, vous décidez où sont les données et qui y accède.',
      'En échange, il faut quelqu’un pour l’installer, le mettre à jour, le sécuriser et le sauvegarder. Un hébergeur de confiance est souvent un bon compromis pour une petite équipe.',
    ],
    sources: [
      { label: 'Héberger ou choisir un prestataire (Nextcloud)', url: 'https://nextcloud.com/home-users/' },
      { label: 'Sauvegarder (CNIL)', url: 'https://www.cnil.fr/fr/securite-sauvegarder' },
    ],
  },
  {
    id: 'donnees',
    question: 'Un logiciel libre protège-t-il automatiquement nos données ?',
    paragraphs: [
      'Non. Un code ouvert peut être vérifié, ce qui est précieux, mais la protection dépend aussi de l’endroit où les données sont stockées, des réglages, des mises à jour et des habitudes de chacun.',
      'Un exemple : dans Jitsi Meet, le chiffrement de bout en bout existe, mais il faut l’activer. C’est pourquoi chaque fiche a une rubrique « Côté données ».',
    ],
    sources: [
      { label: 'Sécurité de Jitsi', url: 'https://jitsi.org/security/' },
      { label: 'Chiffrement dans Nextcloud', url: 'https://nextcloud.com/encryption/' },
    ],
  },
  {
    id: 'changer',
    question: 'Faut-il tout changer d’un coup ?',
    paragraphs: [
      'Non. On peut commencer par un seul outil, avec un petit groupe volontaire, en gardant l’ancien à côté le temps de s’habituer.',
      'Avant de décider, testez avec vos vrais documents et demandez l’avis de la personne qui gère le matériel.',
    ],
    sources: [],
  },
]
