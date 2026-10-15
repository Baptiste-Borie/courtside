# Courtside

Carrière de General Manager, locale et solo, dès 1983 en France.
La V1 complète vise un circuit fictif de streetball 3v3. La découverte,
la progression et la construction d'une équipe constituent ses piliers.

## Implémenté — prototype 001

Deux équipes de trois joueurs, génération déterministe, notes 0–99,
profils spécialisés, trois tactiques et simulation instantanée.
Règles : premier à 21, paniers à 1 et 2, sans obligation de deux points d'écart.
Score cible et valeur des paniers sont configurables dans le moteur.

Le moteur échantillonne des séquences statistiques : perte de balle, sélection
du tireur et du défenseur, tir, passe décisive et rebond. Aucune position réelle,
aucun chronomètre et aucune intervention en direct ne sont simulés.
Chaque point est attribué à un joueur. Les rebonds offensifs prolongent l'attaque.

La tactique modifie les tireurs privilégiés, la proportion de tirs extérieurs
et l'efficacité liée aux qualités disponibles. Les confrontations utilisent
les notes individuelles et des moyennes spécifiques, jamais la note générale.

La moyenne affichée est descriptive. Le potentiel, les lancers francs, la fatigue
et la santé sont stockés mais sans effet à ce stade. Mi-distance, QI basket et
certaines notes physiques ne sont pas encore exploités séparément.

## Vision future, non implémentée

Scouting révélant des joueurs déjà présents dans le monde, recrutement,
tournois, une seule réserve d'argent, entraînements, fatigue, badges rares,
tactiques secrètes, vieillissement et journal de carrière.
Le temps avancera d'événement en événement. Le 5v5, le staff et les ligues
historiques restent des extensions futures.

## Implémenté — patch 002

Effectif initial de six joueurs, choix libre de trois titulaires et changement
entre rencontres. Tournoi toutes rondes à quatre équipes : six matchs, dont
trois pour le joueur. Tous les matchs des adversaires sont simulés.
Classement par victoires, différence de points, points marqués puis identifiant
stable. Récompense de 300/200/125/75 francs selon le rang. Montants gamifiés.
Les gains et titres sont conservés pendant la session, sans sauvegarde.
Nouveau tournoi disponible après le précédent ; aucun calendrier ni vieillissement
pour l'instant. L'argent sera utilisable avec le futur scouting.

## Implémenté — patch 003

Trente prospects sont générés au début de la session dans un pool fixe, séparé
des adversaires actuels. Le scouting révèle jusqu'à trois joueurs encore inconnus
pour 50 F ; il ne crée aucun joueur. Révélation dossier par dossier, puis recrutement
optionnel contre un coût de 25 F + 3 F par point de moyenne au-dessus de 40.
Effectif plafonné à dix joueurs ; aucun départ de joueur pour l'instant.
Les dossiers restent disponibles après leur campagne. Notes exactes et potentiel
visible dans ce prototype : incertitude des rapports et délais restent à développer.
Les campagnes sont immédiates. Aucun calendrier, vieillissement ou renouvellement
du pool à ce stade. Les rapports ne garantissent pas un joueur meilleur.

## Implémenté — patch 005

Sauvegarde automatique versionnée dans le navigateur. Elle conserve toute la session
de jeu, hors laboratoire et onglet sélectionné. Les données sont validées à la reprise.
Les erreurs de stockage sont visibles ; une sauvegarde invalide n'est pas écrasée.
Nouvelle partie exige une confirmation. Aucune synchronisation ou export pour l'instant.

## Implémenté — patch 006

Calendrier événementiel : 14 jours avant le début du tournoi, puis un match
par jour. Le scouting revient après sept jours. Un bouton avance directement
à l'événement le plus proche et traite le retour des dossiers s’il est arrivé.
Un match disponible attend la décision du joueur avant de laisser avancer
le calendrier. Les événements simultanés restent tous accessibles.
Date initiale : 1er avril 1983. La sauvegarde 005 est migrée sans perdre la partie.
Le vieillissement et les effets du temps sur les caractéristiques restent futurs.

## Implémenté — patch 007

Fatigue après chaque match pour ses trois participants, pondérée par l’endurance.
Récupération à six points par jour, y compris pour les adversaires. Les joueurs
du banc ne gagnent pas de fatigue. Le moteur applique une baisse temporaire
des notes physiques, de finition, de tir extérieur et de défense au-delà de 20
points de fatigue ; maximum 25 % à 100. Passe et vision restent intactes.
La fatigue ne modifie pas les notes permanentes. Les blessures restent futures.

## Implémenté — patch 008

Camp individuel de sept jours pour 100 F. Tir, création, défense ou jeu intérieur :
deux caractéristiques gagnent au plus un point chacune. Budget global de croissance
limité à potentiel × nombre de caractéristiques ; plafond individuel 99.
Huit points de fatigue si progression effective. Pas encore de progression en match,
de variation probabiliste ou de régression liée à l'âge. Un camp en attente est
sauvegardé et traité au prochain événement correspondant. Matchs autorisés pendant
le camp : simplification provisoire. Les adversaires ne suivent pas encore de camps.


## Prototype 009 — circuit

Coupe du quartier (0 réputation), Open de la ville (12), Défi régional (30).
Chaque édition terminée donne 6/4/2/1 réputation selon la place. Les récompenses
locales de 300/200/125/75 F sont multipliées par 2 en ville et 3 en régional.
Les adversaires gagnent respectivement 0/6/12 sur leurs caractéristiques (plafond 99).
Le format reste le même ; difficulté et montants seront équilibrés plus tard.
Le palmarès garde les résultats à partir du patch 009 ; aucune reconstitution
arbitraire des résultats anciens. La réputation commence à zéro à la migration.


## Prototype 010 — préparation et lecture du match

La préparation compare les notes effectives des trois titulaires et des adversaires
sur six axes. Les moyennes sont descriptives, sans prédiction de victoire.
Les orientations tactiques et fréquences théoriques de tirs extérieurs sont expliquées.
Le bilan présente les statistiques collectives réellement simulées.
Le moteur et l’équilibrage restent inchangés ; les notes hors simulation sont identifiées.


## Prototype 011 — début de carrière

France, printemps 1983 : tu montes ton équipe pour entrer dans le circuit local.
L’introduction est courte et accompagne la sélection du nom et des six joueurs
parmi douze candidats préexistants et reproductibles. Pas de budget à ce stade.
La sélection incomplète est sauvegardée ; confirmation à six joueurs exactement.
Les trois premiers sont titulaires par défaut, les trois autres sur le banc.
La sélection est propre aux nouvelles parties ; les sauvegardes précédentes sont préservées.
Direction visuelle : playground, encre sombre et orange, cartes joueurs et terrains graphiques.


## Prototype 012 — découverte des premiers joueurs

Trois pochettes de quatre fiches précèdent le choix de l’effectif. Les douze joueurs
sont déjà définis ; ouvrir ou retourner une carte ne change jamais son contenu.
Ouverture animée, cartes face cachée, retournement individuel et bouton global
Tout dévoiler. Après découverte, Composer mon effectif affiche les douze candidats.
Pas de prix, rareté ou nouveaux attributs. Révélations sauvegardées ; les sélections
anciennes conservent les profils qu’elles voyaient déjà. Le visuel 3×3 est conservé.


## Directive UX — jeu vidéo

L’interface doit être pensée comme un jeu : menu principal, scènes successives,
action principale claire et écran central du club. Éviter de juxtaposer toute
la création sur une longue page. Le départ suit introduction → nom → pochettes →
effectif → club et premier tournoi. Le visuel 3×3 est la référence graphique validée.
Le patch 013 applique ce parcours et conserve les systèmes existants ; les écrans
plus détaillés seront affinés ensuite. Sur mobile, une carte à la fois permet
la découverte et le choix sans longue grille verticale.
