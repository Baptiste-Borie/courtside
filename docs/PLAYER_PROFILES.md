# Profils de jeu — base 015

Le profil décrit le relief des caractéristiques, sans bonus automatique. Il n'est
ni un badge, ni un trait de personnalité, ni une distinction honorifique. Ces trois
systèmes restent pour plus tard. Un profil « complet » n'indique pas un niveau
élevé : ses forces peuvent être modestes en valeur absolue.

## Les vingt profils retenus

- Meneur créateur : passe, vision, dribble.
- Gestionnaire défensif : organisation et défense sur le porteur.
- Créateur de tir : dribble et tir, avec une capacité de passe secondaire.
- Slasher acrobatique : vitesse, agilité et lay-up.
- Sniper longue distance : tir extérieur et dribble.
- Shooter : tir, avec moins de création balle en main.
- 3&D : tir extérieur et défense extérieure.
- Scoreur complet : solutions offensives près du cercle et au tir.
- Slasher : vitesse, détente et finition aérienne.
- Slasher puissant : percussion et force.
- Scoreur au poste : création par les mouvements dos au panier.
- Rebondeur défenseur : rebond et défense intérieure.
- Défenseur polyvalent : défense extérieure et intérieure.
- Scoreur mi-distance : tir intermédiaire, dribble et appuis.
- Défenseur extérieur : défense du porteur et mains actives.
- Intérieur shooteur : tir avec un gabarit intérieur.
- Finisseur intérieur : termine les actions, crée moins au poste.
- Intérieur complet : jeu au poste, défense intérieure, rebond et passe.
- Intérieur en puissance : force et scoring dans la raquette.
- Protecteur de cercle : contre et dissuasion intérieure.

## Génération et affichage

Le tirage choisit un profil pondéré par le poste, puis un gabarit probable, une
corpulence et des caractéristiques liées. Les variations individuelles portent
sur le niveau, chaque note, la taille et le poids. Les grands gabarits favorisent
contre, rebond et défense intérieure ; la corpulence favorise la force et peut
réduire vitesse et accélération. La défense extérieure ne demande pas de lourdeur.

Une petite proportion des tirages utilise une plage de gabarit élargie. C'est une
probabilité de jeu réglable, pas une fréquence observée en NBA. Elle conserve les
grands créateurs et les petits intérieurs atypiques, sans en faire la norme.

Le libellé affiché est recalculé à partir des notes : il peut différer du patron de
génération quand les variations ou l'entraînement changent les points forts.
La fatigue ne change pas cette identité. Les vingt profils restent améliorables.

## Limites de la simulation actuelle

Les notes déjà utilisées en match reflètent les différences entre profils. La
mi-distance, les lancers francs, la détente et le QI basket restent hors simulation
et sont signalés dans le dossier. La portée des tirs extérieurs n'est pas encore
différenciée : « Sniper longue distance » décrit pour l'instant un profil tir et
dribble, sans bonus de distance. Aucun comportement de déplacement sans ballon
n'est simulé. Le profil ne promet pas une reproduction d'un joueur NBA.

## Compatibilité

Les joueurs d'un effectif, les prospects sauvegardés et les adversaires d'un
tournoi entamé sont conservés. Une création antérieure au patch 015 garde ses
douze candidats d'origine jusqu'à confirmation, via la génération 1. Les nouvelles
créations utilisent la génération 2 ; les nouveaux prospects et adversaires
utilisent les profils cohérents. Aucune réinitialisation de sauvegarde nécessaire.

Depuis le patch 018, les nouvelles créations utilisent la génération 3 : mêmes
profils et caractéristiques, avec un potentiel lié à l'âge. Les générations 1 et 2
restent disponibles pour préserver les candidats des créations déjà entamées.
