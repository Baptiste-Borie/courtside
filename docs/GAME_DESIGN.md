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
