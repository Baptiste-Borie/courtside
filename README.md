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

## État actuel

Socle Vue 3 / TypeScript / Vite / Vitest avec CSS natif. Écran provisoire,
aucune mécanique de jeu implémentée et aucune direction artistique définitive.

Vitest utilise Node pour le futur moteur TypeScript indépendant de Vue.
Aucun test n’existe encore : la commande autorise cet état initial explicitement.
Les tests du moteur seront ajoutés avec le patch 001.

Prochain patch : deux équipes procédurales, trois tactiques, simulation instantanée
3v3, statistiques cohérentes et seeds reproductibles.
