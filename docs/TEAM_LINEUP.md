# Composition sur terrain — patch 016

L'écran Mon équipe commence désormais par un demi-terrain 3x3, avec trois
emplacements : meneur, ailier, intérieur. Le banc reste visible à côté sur
ordinateur, et sous le terrain sur mobile. Chaque joueur montre son profil, son
poste naturel, son gabarit, ses deux meilleures notes actives et sa fatigue. Sa
fiche complète reste disponible sans quitter la composition.

## Interactions

- Banc vers poste occupé : le remplaçant entre, l'ancien titulaire rejoint le banc.
- Titulaire vers titulaire : échange de leurs emplacements.
- Titulaire vers un remplaçant du banc : échange de leurs places.
- Titulaire vers la zone du banc ou bouton moins : libère le poste.
- Joueur vers poste libre : déplacement ou entrée sans doublon.
- Au clic, au toucher et au clavier : sélectionner un joueur, puis un poste ou
  l'autre joueur. Annuler ou Échap abandonne la sélection.

Un effectif incomplet bloque l'inscription et le lancement du prochain match.
Les postes sont indicatifs : aucune pénalité de hors-poste ni bonus de placement
n'a été ajouté à la simulation. Les notes et le gabarit déterminent toujours les
performances. Le terrain est un outil de composition, pas une animation du match.
Les rôles du 5v5 seront introduits avec ce mode de jeu.

## Sauvegarde

Le champ facultatif `lineup` mémorise les trois emplacements, dont les postes
vides. `selected` contient les identifiants non vides dans le même ordre, pour le
moteur existant. Le décodeur rejette les doublons, joueurs étrangers à l'effectif,
formats invalides et désaccords entre les deux champs.

Une ancienne sauvegarde conserve exactement ses titulaires : leur ordre sert à
remplir les trois emplacements sans changer les joueurs, leurs caractéristiques
ou le tournoi. Aucun redémarrage de carrière nécessaire.

## Revue

La revue 016 ajoute des contrôles de glisser-déposer banc/terrain et entre postes,
d'échange au clavier et sur mobile, de poste vide bloquant l'inscription, de fiche
complète et de reprise de composition. Les captures 33 et 34 montrent le terrain
sur ordinateur et mobile.
