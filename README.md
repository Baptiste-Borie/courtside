# Courtside

Jeu personnel, local et solo de carrière de General Manager de basket.
Départ en France en 1983, dans le streetball 3v3.

## Prérequis

Node.js 22.12 minimum (Node.js 24 LTS recommandé) et npm.

## Installer et lancer

```bash
npm ci
npm run dev
```

Ouvrir l’adresse affichée par Vite. Aucun backend ou compte nécessaire.

## Vérifier le projet

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

La prévisualisation nécessite un build. `npm run test:watch` lance Vitest en mode interactif.

## Prototype 002

Écran principal : six joueurs, choix de trois titulaires, tournoi à quatre équipes,
classement, récompenses et titres pendant la session. Aucun recrutement ou sauvegarde
pour le moment. Le laboratoire précédent reste accessible via son onglet.

Dans le laboratoire : deux équipes procédurales de trois joueurs, trois tactiques et simulation
instantanée. Consultez les caractéristiques, choisissez les tactiques et simulez.
Relancez avec la même seed pour reproduire le résultat ou cliquez sur Nouveau tirage.
La seed des équipes ne change l'effectif qu'après Générer les équipes.

```bash
npm run balance
```

Ce script exécute 18 000 matchs reproductibles pour comparer deux profils
synthétiques avec chaque tactique. Il ne constitue pas une validation exhaustive
 de l'équilibrage. Aucun outil supplémentaire n'est nécessaire.

Les tests vérifient la génération, les règles, les statistiques et la reproductibilité.
La direction artistique reste provisoire. Aucune progression ou sauvegarde.

Voir [game design](docs/GAME_DESIGN.md), [roadmap](docs/ROADMAP.md) et
[décisions](docs/DECISIONS.md).

## Revue visuelle automatique

```bash
npm run review
```

Une seule commande : installe Chromium s'il manque, démarre un serveur local sur
un port libre, capture l’effectif, le tournoi, la récompense, la vue mobile et le laboratoire, vérifie les
interactions et erreurs JavaScript, crée `review/courtside-revue-002.zip`, puis
ferme le navigateur et le serveur. Il n'est pas nécessaire de lancer `npm run dev`.

Le ZIP contient les captures et `report.json`. En cas d'échec, la commande retourne
un code non nul et le rapport explique le blocage. Les captures déjà prises restent
incluses. Le premier lancement nécessite un accès réseau pour télécharger Chromium.

Playwright automatise le navigateur ; fflate crée le ZIP sans commande système.
Ces deux dépendances servent uniquement au développement.
