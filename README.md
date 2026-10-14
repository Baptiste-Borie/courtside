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

## Prototype 007

Écran principal : six joueurs, choix de trois titulaires, tournoi à quatre équipes,
classement, récompenses et titres pendant la session. Scouting local de 30 prospects et recrutement disponibles. Sauvegarde locale automatique
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
La direction artistique reste provisoire. Aucune progression des joueurs pour le moment.

Voir [game design](docs/GAME_DESIGN.md), [roadmap](docs/ROADMAP.md) et
[décisions](docs/DECISIONS.md).

## Revue visuelle automatique

```bash
npm run review
```

Une seule commande : installe Chromium s'il manque, démarre un serveur local sur
un port libre, capture l’effectif, le tournoi, la récompense, la vue mobile et le laboratoire, vérifie les
interactions et erreurs JavaScript, crée `review/courtside-revue-007.zip`, puis
ferme le navigateur et le serveur. Il n'est pas nécessaire de lancer `npm run dev`.

Le ZIP contient les captures et `report.json`. En cas d'échec, la commande retourne
un code non nul et le rapport explique le blocage. Les captures déjà prises restent
incluses. Le premier lancement nécessite un accès réseau pour télécharger Chromium.

Playwright automatise le navigateur ; fflate crée le ZIP sans commande système.
Ces deux dépendances servent uniquement au développement.

Le scouting coûte 50 F et révèle trois dossiers un par un. Le recrutement est
une dépense distincte ; dix joueurs maximum. Les dossiers observés restent
accessibles. Campagnes de sept jours dans le jeu ; rapports exacts pour ce prototype.
La revue automatique couvre aussi le scouting et le recrutement après deux tournois.

Quatre sections : Mon équipe, Tournoi, Scouting et Laboratoire. La navigation
conserve la session. Les captures automatiques désactivent les animations
pour enregistrer les dossiers entièrement visibles.

## Sauvegarde

La partie est sauvegardée automatiquement dans le navigateur : effectif, titulaires,
tactique, tournoi, francs, titres et dossiers de scouting. Recharger reprend la partie.
Nouvelle partie demande confirmation avant de remettre les données à zéro.
Une sauvegarde incompatible ou endommagée est conservée et signalée sans écrasement.

Les données sont liées au navigateur et à l’adresse utilisée (notamment le port).
Elles ne sont pas synchronisées et leur effacement par le navigateur les supprime.
La revue utilise son propre navigateur isolé et ne modifie pas votre partie.

## Calendrier événementiel

La partie commence le 1er avril 1983. Une inscription programme le tournoi
quatorze jours plus tard ; ses trois matchs se suivent sur trois jours.
Avancer au prochain événement saute directement jusqu'au prochain match ou
au retour du scouting (sept jours). Un match prêt bloque l’avancement jusqu’à
sa résolution. Aucune attente réelle.

Le calendrier est sauvegardé. Une partie du patch 005 est migrée au 1er avril,
avec son éventuel match en cours immédiatement disponible. Fatigue, entraînements
et vieillissement ne sont pas encore simulés.

## Fatigue et récupération

Chaque titulaire gagne environ 18 à 28 points de fatigue après un match selon
son endurance. Tous les joueurs récupèrent six points par jour lors d’un saut
entre événements. La fatigue est comprise entre 0 et 100, affichée sur les fiches
et sauvegardée. Au-delà de 20, elle réduit certaines performances jusqu’à 25 %.
Les notes permanentes restent intactes. Les adversaires suivent les mêmes règles.
Les blessures et entraînements ne sont pas encore simulés.
