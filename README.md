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

## Prototype 014

Début de carrière : six joueurs à choisir parmi douze candidats, puis trois titulaires et tournoi à quatre équipes,
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
interactions et erreurs JavaScript, crée `review/courtside-revue-014.zip`, puis
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

## Création du club et identité visuelle

Une nouvelle carrière s’ouvre sur France, printemps 1983. Choisissez le nom du club
et six joueurs parmi douze candidats déterministes déjà générés. La sélection est
gratuite et sauvegardée, même avant sa confirmation. Les trois premiers choisis
forment le trois initial, modifiable ensuite depuis Mon équipe. Les autres vont au banc.

Les parties existantes passent directement à l’équipe, sans perte d’effectif ou de gains.
Pour découvrir l’introduction, Nouvelle partie efface la partie locale après confirmation.
Les candidats retenus deviennent exactement l’effectif du club, sans nouveau tirage.

La nouvelle interface utilise une palette encre/orange, des illustrations de terrain
et des maillots en SVG, ainsi que des cartes joueurs avec profils et barres de forces.
Aucune image, police distante ou nouvelle dépendance n’est nécessaire.
La revue ajoute les captures de l’introduction, du choix mobile et teste la migration.

## Pochettes du playground

Une nouvelle carrière propose trois pochettes gratuites de quatre joueurs.
L’ouverture anime la pochette et fait apparaître quatre cartes face cachée.
Chaque carte se retourne au clic. Tout dévoiler ouvre les trois pochettes et
révèle les douze profils ; Composer mon effectif mène ensuite au choix des six.
Les joueurs sont définis avant l’ouverture, sans tirage ou coût supplémentaire.

Pochettes ouvertes et cartes retournées sont sauvegardées au fur et à mesure.
Recommencer la sélection réinitialise aussi les pochettes après confirmation.
Les sélections déjà commencées au patch 011 gardent leurs douze profils visibles.
Les carrières déjà créées poursuivent normalement leur partie.
Les animations respectent la préférence de réduction des mouvements.
La revue vérifie retournement individuel, reprise, révélation globale et mobile.

## Parcours de jeu

Le lancement ouvre le menu principal : Continuer, Nouvelle carrière et Paramètres.
Continuer est disponible pour une sauvegarde valide. Une nouvelle carrière demande
confirmation avant de remplacer une sauvegarde existante. Réduire les animations
est conservé comme préférence de ce navigateur.

La création est organisée en scènes : introduction, nom du club, pochettes, effectif.
Chaque étape dispose d’une action principale, avec retour vers les étapes précédentes.
Le choix des joueurs se fait par pages de quatre sur ordinateur, une sur petit écran.
Sur mobile, les cartes à retourner sont également présentées une à la fois.
L’étape est sauvegardée avec les ouvertures, révélations et choix déjà effectués.
Les créations du patch 012 reprennent les profils et le nom déjà connus.

Une fois le club créé, l’écran Le club présente la prochaine action et les accès
à l’effectif, au scouting, à l’entraînement et au circuit. Le menu reste accessible.
Les écrans détaillés existants continuent de fonctionner ; leur mise en scène pourra
être affinée à partir de ce parcours. Le visuel 3×3 est réutilisé sans modification.

La revue capture le menu, les scènes, l’arrivée au club et les cartes sur mobile.
Elle contrôle les pixels des PNG pour rejeter une capture vide ou uniforme.

## Fiches et niveaux des notes

Le dos est retiré du rendu dès qu’une carte est révélée, pour éviter les superpositions
et textes en miroir selon le navigateur. Le recto conserve une animation de retournement.
Voir la fiche complète ouvre une fenêtre séparée : les cartes gardent leur taille.
Les 21 notes sont regroupées et les notes hors simulation sont signalées séparément.
Couleurs : faible (0–39), à développer (40–54), correct (55–69), bon (70–84),
très bon (85–99). Les nombres et libellés accompagnent les couleurs.

### Patch 015 — profils et génération

Vingt profils descriptifs sur les cartes et dans les dossiers. Taille, corpulence
et caractéristiques sont générées ensemble, avec quelques exceptions atypiques.
Les joueurs déjà sauvegardés et les pochettes en cours sont préservés. Pour voir
les nouveaux candidats de départ, créer une nouvelle carrière (cela remplace la
partie locale après confirmation). Le détail et les limites de simulation sont
précisés dans [les profils de jeu](docs/PLAYER_PROFILES.md).

La revue produit maintenant `review/courtside-revue-015.zip`.

### Patch 016 — composer sur le terrain

Mon équipe affiche un demi-terrain avec meneur, ailier, intérieur et le banc.
Glisser un joueur sur un emplacement remplace le titulaire ; glisser entre deux
postes les échange. La sélection au clic, au toucher ou au clavier permet les
mêmes changements. Les postes et les places libres sont sauvegardés. Les anciennes
parties conservent leurs titulaires. Détails : [composition](docs/TEAM_LINEUP.md).

La revue produit `review/courtside-revue-016.zip`, dont deux nouvelles captures du
terrain et des vérifications d'échanges, d'emplacements libres et de reprise.

### Patch 017 — tracés du terrain

Le demi-cercle de la ligne médiane est recentré. Les tracés suivent la taille du
terrain sans étirer les cercles sur ordinateur et mobile. La revue vérifie leur
centrage et leurs proportions, et produit `review/courtside-revue-017.zip`.
