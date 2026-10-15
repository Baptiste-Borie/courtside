import type { Player } from './model'

// L'identité reste la même après transfert, changement de poste ou entraînement.
// Aucun lien entre apparence, nom, origine supposée et caractéristiques de jeu.
export function appearanceFor(player:Pick<Player,'firstName'|'lastName'|'birthYear'>) {
 const source=`${player.firstName}|${player.lastName}|${player.birthYear}`
 let seed=2166136261
 for(const char of source)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0
 const next=(max:number)=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return Math.floor(seed/4294967296*max)}
 const skins=['#f1c4a2','#dba078','#bc7f56','#98603f','#72462f','#503329']
 const hairs=['#221e1a','#34251e','#65432d','#211d1c','#a67a48']
 const palettes=[['#315850','#dbe8dc'],['#a25035','#f5d9b6'],['#405879','#d9e4ec'],['#72516d','#eadfe6'],['#8a6a34','#eee3c9'],['#416857','#dce9d0']]
 const palette=palettes[next(palettes.length)]!
 return {skin:skins[next(skins.length)]!,hair:hairs[next(hairs.length)]!,cut:next(8),beard:next(5),brow:next(3),face:next(3),jersey:palette[0]!,background:palette[1]!,number:next(90)+1}
}
