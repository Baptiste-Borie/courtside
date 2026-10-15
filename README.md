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

## Prototype 010

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
La direction artistique reste provisoire. Les camps individuels permettent la progression des joueurs.

Voir [game design](docs/GAME_DESIGN.md), [roadmap](docs/ROADMAP.md) et
[décisions](docs/DECISIONS.md).

## Revue visuelle automatique

```bash
npm run review
```

Une seule commande : installe Chromium s'il manque, démarre un serveur local sur
un port libre, capture l’effectif, le tournoi, la récompense, la vue mobile et le laboratoire, vérifie les
interactions et erreurs JavaScript, crée `review/courtside-revue-010.zip`, puis
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

Six sections : Mon équipe, Tournoi, Scouting, Entraînement, Circuit et Laboratoire. La navigation
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
avec son éventuel match en cours immédiatement disponible. La fatigue et les camps suivent le calendrier ; le vieillissement des caractéristiques reste à développer.

## Fatigue et récupération

Chaque titulaire gagne environ 18 à 28 points de fatigue après un match selon
son endurance. Tous les joueurs récupèrent six points par jour lors d’un saut
entre événements. La fatigue est comprise entre 0 et 100, affichée sur les fiches
et sauvegardée. Au-delà de 20, elle réduit certaines performances jusqu’à 25 %.
Les notes permanentes restent intactes. Les adversaires suivent les mêmes règles.
Les blessures ne sont pas encore simulées.

## Camps individuels

Onglet Entraînement : choisissez un joueur et un axe, puis financez un camp
à 100 F. Après sept jours de jeu, jusqu’à deux notes gagnent un point et le joueur
prend huit points de fatigue. Le total des notes ne dépasse pas le budget défini
par son potentiel ; chaque note reste au plus à 99. Un camp à la fois.
Les anciennes sauvegardes sont migrées ; un camp en cours survit au rechargement.

## Circuit et palmarès

L’onglet Circuit présente trois compétitions. La Coupe du quartier est accessible
immédiatement. L’Open de la ville demande 12 points de réputation ; le Défi régional,
30 points. Les places 1 à 4 rapportent respectivement 6, 4, 2 et 1 points de réputation.
Les trois formats restent des tournois 3v3 à quatre équipes.

La ville renforce les notes adverses de 6 (maximum 99) et double les récompenses ;
le régional les renforce de 12 et triple les récompenses. Le club conserve ses notes.
Ces valeurs sont provisoires. On choisit une compétition avant l’inscription ;
une seule peut être en cours. Aucun droit d’entrée supplémentaire.

Chaque tournoi terminé laisse une entrée au palmarès : compétition, édition, date,
place, victoires, francs et réputation gagnés. La récompense est versée une seule fois.
Le circuit en cours, les déblocages et le palmarès survivent au rechargement.

Les sauvegardes antérieures conservent effectif, argent, titres et tournoi en cours,
considéré comme une Coupe du quartier. La réputation commence à zéro à la migration ;
les résultats détaillés des anciennes éditions ne sont pas reconstitués.
La revue automatique joue jusqu’au déblocage de la ville, y dispute un tournoi,
vérifie le paiement et la reprise, et capture le circuit et son affichage mobile.

## Préparation et bilan des matchs

Avant chaque match, le tournoi compare six secteurs sur 100, fatigue actuelle incluse.
Ces moyennes décrivent les profils ; les duels, la taille et le hasard comptent aussi.
Les adversaires sont consultables et chaque tactique explique son orientation.
Les journées de récupération à venir ne sont pas anticipées dans la comparaison.

Après le match, le bilan compare la réussite au tir, les tirs extérieurs,
les points intérieurs/extérieurs, rebonds, passes, interceptions et contres.
Les chiffres proviennent des statistiques simulées, sans modifier le moteur.
Les quatre caractéristiques hors simulation sont signalées dans les fiches.
Le palmarès passe en cartes sur mobile. Aucune migration de sauvegarde supplémentaire.
