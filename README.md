# NIRD WORLD

**Explorer. Comprendre. Transformer.** — https://nird-world.vercel.app

Projet réalisé pour la Nuit de l'Info 2025, sur le sujet national *« Le Village Numérique Résistant : comment les établissements scolaires peuvent tenir tête aux Big Tech ? »*.

NIRD WORLD est un village à explorer pour comprendre de quoi dépend le numérique d'une école, et comment en reprendre la main, dans l'esprit de la démarche NIRD (Numérique Inclusif, Responsable et Durable).

Projet compagnon : [PIXEL RESISTANCE](https://pixel-resistance.vercel.app), le jeu rétro du défi « On veut du gros pixel ! ».

## Ce que l'on peut faire

| Lieu | Route | Contenu |
| --- | --- | --- |
| Accueil | `/` | La mission, l'enjeu de l'indépendance numérique, les lieux du village |
| Plan du village | `/village` | Carte interactive des bâtiments, utilisable au clavier |
| École : diagnostic | `/village/ecole` | 20 questions sur 5 dimensions (logiciels libres, souveraineté des données, durabilité matérielle, accessibilité, gouvernance), rapport avec niveau de maturité et priorités d'action |
| Historique | `/village/ecole/historique` | Les diagnostics enregistrés sur l'appareil : reprendre, supprimer, tout effacer |
| Bibliothèque | `/village/bibliotheque` | 20 logiciels libres classés par besoin, recherche, fiches détaillées et comparateur |
| Autres bâtiments | `/village/:lieu` | Atelier, Hôtel de Ville, Laboratoire, Observatoire |

Le rapport de diagnostic propose des outils de la Bibliothèque adaptés aux réponses. Aucune donnée ne quitte le navigateur : les diagnostics sont enregistrés en LocalStorage, sans compte ni serveur.

## Code

React 19, TypeScript, Vite, Tailwind CSS 4, Motion, React Router, Lucide.

```
src/
  app/                  routes, mise en page, tests de qualité (liens, accessibilité statique)
  components/           en-tête, pied de page, éléments partagés
  features/landing/     page d'accueil
  features/village/     plan interactif du village
  features/buildings/   pages des bâtiments
  features/diagnostic/  questionnaire, calcul des scores, rapport, historique
  features/library/     catalogue de logiciels libres, recherche, comparateur
  features/connections/ suggestions d'outils à partir du diagnostic
docs/
  audit/                audit d'utilisabilité et d'accessibilité (axe-core, clavier, tailles d'écran)
  tests-utilisateurs/   protocole de tests utilisateurs : profils, scénario, grille d'observation, questionnaire
```

## Commandes

Prérequis : Node.js 22 ou plus récent.

```powershell
npm install
```

```powershell
npm run dev
```

Puis ouvrir http://localhost:5173.

```powershell
npm run typecheck
```

```powershell
npm test
```

```powershell
npm run build
```

```powershell
npm run preview
```

La production est servie depuis `dist/` (configuration Vercel dans `vercel.json`).

## Accessibilité

Audit détaillé dans [docs/audit/audit-mission-005.md](docs/audit/audit-mission-005.md) : axe-core sans violation sur les pages testées, navigation complète au clavier, lien d'évitement, fenêtres modales natives `<dialog>`, mise en page testée de 320 à 1440 px, respect de `prefers-reduced-motion`.

## Licences et crédits

- Code : licence [MIT](LICENSE).
- Illustrations du village : originales, dessinées en SVG dans le code, sous la même licence.
- Polices : [Fraunces](https://fonts.google.com/specimen/Fraunces) et [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans), sous SIL Open Font License 1.1, chargées depuis Google Fonts.
- Icônes : [Lucide](https://lucide.dev) (licence ISC).

Les noms de logiciels cités (LibreOffice, Moodle, Nextcloud…) appartiennent à leurs détenteurs respectifs.
