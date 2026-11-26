# Audit d’utilisabilité et d’accessibilité — Mission 005

Date : 26 novembre 2026. Version auditée : commit `6935e50` (Mission 004), puis corrections de ce document.

Ce rapport ne remplace pas des tests avec de vraies personnes : aucun participant n’a encore utilisé le site dans le
cadre du [protocole de test](../tests-utilisateurs/README.md).

## Méthode

| Moyen | Ce qui a été fait | Limites |
| --- | --- | --- |
| Analyse automatique | axe-core 4.10 (règles WCAG 2.0, 2.1, 2.2 A et AA, et bonnes pratiques) sur 14 pages, à 1280 px puis à 375 px avec toutes les sections dépliées | Un outil automatique ne détecte qu’une partie des problèmes |
| Tests dans le navigateur | Parcours au clavier (questionnaire, bibliothèque, village), mesures de position des éléments, largeurs 320, 375, 768, 800, 1024, 1280 et 1440 px | Navigateur Chromium seulement ; pas de téléphone réel, pas de lecteur d’écran |
| Lecture du code | Navigation, intitulés, vocabulaire, structure des titres, gestion du focus | — |
| Tests automatisés | Voir la section « Tests ajoutés » | Pas de test d’interface automatisé (aucun outil ajouté au projet) |

Gravité : **Critique** (empêche une tâche), **Haute** (la rend très difficile), **Moyenne** (gêne réelle),
**Basse** (amélioration).

## Problèmes constatés et corrigés

| # | Problème | Où | Gravité | Impact | Correction | Constaté par |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Au clavier (flèches), la réponse choisie passait en partie sous la barre fixe du bas : jusqu’à 63 px de la carte masqués | Questionnaire, téléphone | Moyenne | On ne voit pas entièrement la réponse que l’on sélectionne (critère 2.4.11 non enfreint, mais confort de lecture dégradé) | Le bouton radio invisible couvre désormais toute la carte : le navigateur fait défiler la carte entière hors de la barre | Navigateur |
| 2 | La Bibliothèque n’apparaissait pas dans le menu principal | En-tête | Moyenne | Élèves et enseignants devaient passer par le plan du village pour trouver les outils | Entrée « Bibliothèque » ajoutée, avec un état « page actuelle » correct (« Le village » n’est plus surligné en même temps) | Lecture du code |
| 3 | À 1024 px, les intitulés du menu passaient sur deux lignes | En-tête | Basse | Menu difficile à lire | Intitulés sur une ligne ; bouton de menu en dessous de 1280 px | Navigateur |
| 4 | La page débordait horizontalement de 14 px à 768 px et de 10 px à 800 px | Plan du village | Moyenne | Défilement horizontal inattendu sur tablette | Les repères du plan ne réservent plus de place à droite ; l’info-bulle de l’Observatoire s’ouvre vers la gauche | Navigateur |
| 5 | À 320 px (zoom à 400 %), les liens « lieu précédent / suivant » débordaient de 20 px | Pages des bâtiments, École, Bibliothèque | Moyenne | Critère 1.4.10 (redistribution) non respecté | Les deux liens peuvent passer à la ligne | Navigateur |
| 6 | Le panneau de présentation d’un bâtiment était un `<aside>` placé dans `<main>` | Plan du village | Basse | Repère de navigation mal placé pour les lecteurs d’écran | Remplacé par une section nommée | axe-core |
| 7 | Termes non expliqués : « pair à pair », « WebDAV », « ANSSI » | Fiches PeerTube, Zotero, KeePassXC | Basse | Un élève ou un enseignant non spécialiste ne comprend pas la phrase | Une explication courte ajoutée dans la phrase | Lecture du code |
| 8 | Pour retrouver ses anciens diagnostics depuis un rapport, il fallait descendre en bas de la page | Rapport | Basse | Un chef d’établissement cherche ses rapports précédents en haut de page | Lien « Voir tous mes diagnostics » sous le titre du rapport | Lecture du code |

## Constats non confirmés

| Constat | Résultat |
| --- | --- |
| axe-core signale une zone cliquable trop petite (« target-size ») sur les liens « lieu précédent / suivant » de la Bibliothèque | Non reproduit : les liens mesurent 78 × 56 px et 131 × 56 px, séparés de 126 px. Probable faux positif ; non corrigé |
| Un élément pourrait passer sous l’en-tête fixe en remontant au clavier (Maj + Tab) | Non reproduit lors du test ; non corrigé |

## Points vérifiés sans problème

- **axe-core** : aucune autre violation sur les 14 pages, y compris le contraste des couleurs.
- **Titres** : aucun niveau sauté sur les 12 pages testées, sections dépliées.
- **Questionnaire au clavier** : ordre logique (question, « Pourquoi cette question ? », un seul arrêt pour les réponses, puis Précédent et Continuer) ; flèches pour changer de réponse ; focus visible ; focus placé sur la nouvelle question à chaque changement.
- **Bibliothèque** : champ de recherche et filtres étiquetés ; nombre de résultats annoncé (`aria-live`) ; le focus va aux résultats quand on choisit un besoin.
- **Rapport → outil → rapport** : le bouton « Retour à votre rapport » et le bouton retour du navigateur ramènent au même rapport, à la même position, sections ouvertes.
- **Mouvement réduit** : règles CSS vérifiées en les forçant (transitions réduites à 0,01 ms).
- **Fenêtres de dialogue** : `<dialog>` natif (focus piégé, Échap pour fermer).
- **Plan du village** : chaque bâtiment est accessible par un bouton au clavier ; le dessin est décrit (`role="img"` et `aria-label`).

## Problèmes restants (non corrigés)

| Problème | Gravité | Raison |
| --- | --- | --- |
| Les titres placés dans les sections dépliables (`<summary>`) peuvent ne pas être annoncés comme titres par certains lecteurs d’écran | À vérifier | Dépend du lecteur d’écran ; à tester avec NVDA, VoiceOver et TalkBack avant de modifier |
| Sur téléphone, les repères du plan n’affichent qu’une icône ; le nom apparaît après un appui | Basse | Choix de lisibilité de la Mission 002.5 ; la liste sous le plan donne les noms |
| Les réponses longues du questionnaire demandent de faire défiler sur téléphone | Basse | Le texte des niveaux fait partie de la méthode et n’a pas été modifié |
| Aucun test d’interface automatisé (clavier, tailles d’écran) | — | Il faudrait ajouter un outil comme Playwright, ce qui dépasse cette mission |

## Ce qui reste à valider par de vraies personnes

- La compréhension du but du site par des élèves.
- La capacité d’un enseignant à faire le diagnostic sans aide, et le vocabulaire des réponses.
- La confiance accordée aux fiches outils et aux suggestions du rapport.
- L’usage avec un lecteur d’écran, un zoom fort ou un clavier seul, par des personnes qui les utilisent au quotidien.

## Tests ajoutés

- `src/features/diagnostic/tests/journey.test.ts` : diagnostic complet, rechargement, historique (reprendre, supprimer,
  réinitialiser), effacement d’une réponse, isolation entre diagnostics.
- `src/app/tests/quality.test.ts` : chaque lien généré ouvre la bonne page (routeur de React Router), bâtiments ouverts,
  et vérifications statiques du code : pas de clic sur un élément non focalisable, type des boutons, liens vers un
  nouvel onglet signalés, langue de la page et lien d’évitement.
