# Fenêtre de jeu — patch 018

Les écrans de jeu occupent la fenêtre. Le défilement de la page est bloqué, mais
le contenu est aussi réorganisé pour tenir réellement dans le cadre : ce n'est
pas une longue page simplement découpée par overflow hidden.

- Menu et création du club : scènes cadrées, cartes paginées, pochettes compactes
  après ouverture et confirmation de l'effectif toujours accessible.
- Mon équipe : triangle des trois postes, banc paginé et barre d'action visible.
  Sur petit écran, les cartes montrent l'identité et la fatigue ; la fiche donne
  accès aux notes et au gabarit.
- Tournoi : trois vues, Préparer / Dernier match / Classement. Le prochain
  événement et l'action de jeu restent dans la barre du bas. Avancer jusqu'au
  match suivant réaffiche sa préparation.
- Dossiers joueurs : cinq rubriques, toutes les 21 notes accessibles sans dérouler
  la fiche. Le profil reste une description sans bonus automatique.
- Tactique et choix de compétition : fenêtre de préparation.
- Scouting : Mission / Joueurs observés, avec un dossier par page.
- Les résultats des autres équipes sont accessibles par journée dans une modale.
- Circuit : une compétition ou un résultat de palmarès par page.
- Entraînement : formulaire cadré ; explications dans une modale.
- Laboratoire : une fiche à la fois, seeds et résultat visibles dans la fenêtre,
  statistiques des deux équipes dans une modale.

La revue 018 parcourt la création puis joue réellement des tournois avec les
boutons de l'interface. Elle finance scouting, recrutement et entraînement par
les récompenses, sans injecter d'argent. Elle vérifie les vues et modales aux
formats 1440×900, 1366×768, 390×844, 360×640, 320×568 et 844×390. Les contrôles
rejettent les boutons hors écran, le contenu débordant des panneaux et le
défilement du document. Les captures restent nécessaires pour juger l'esthétique.

## Potentiel lié à l'âge

Le potentiel est un plafond de niveau, toujours supérieur ou égal au niveau
actuel et inférieur ou égal à 99. Le générateur tire une marge de progression
qui diminue en moyenne entre 18 et 34 ans. Une faible marge reste possible chez
un jeune, et une progression tardive plus importante chez un vétéran.

Ce modèle est un choix d'équilibrage. Il ne réduit pas automatiquement le
potentiel à chaque anniversaire et n'ajoute pas encore de déclin ou de retraite.
Les joueurs déjà sauvegardés gardent leurs valeurs. Les créations commencées
avant ce patch gardent leurs candidats et leurs potentiels via les générations
1 et 2. Les nouvelles créations utilisent la génération 3, tout comme les nouveaux
adversaires et pools de scouting.
