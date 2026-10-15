import { attributeLabels, type Attribute, type Player, type Position } from './model'

export interface PlayProfile {
  id: string; label: string; description: string
  positions: [number,number,number]; height: [number,number]; build: number
  strengths: Attribute[]; support: Attribute[]; weaknesses: Attribute[]
}
// Poids G/W/C, gabarits et fréquences : choix de jeu, pas statistiques NBA.
export const playProfiles: PlayProfile[] = [
  {id:'playmaker',label:'Meneur créateur',description:'Organise par la passe, la vision et le dribble.',positions:[9,2,0],height:[172,192],build:-3,strengths:['passing','courtVision','dribbling'],support:['speed','acceleration'],weaknesses:['blocks','postMoves']},
  {id:'defensive-manager',label:'Gestionnaire défensif',description:'Distribue et met la pression sur le porteur.',positions:[9,2,0],height:[174,194],build:0,strengths:['passing','courtVision','perimeterDefense','steals'],support:['dribbling','stamina'],weaknesses:['dunk','postMoves']},
  {id:'shot-creator',label:'Créateur de tir',description:'Fabrique ses occasions au dribble et au tir, avec une capacité de passe.',positions:[5,8,1],height:[180,205],build:0,strengths:['dribbling','midRange','threePoint'],support:['passing','courtVision','layup'],weaknesses:['blocks','rebounding']},
  {id:'acrobat',label:'Slasher acrobatique',description:'Déborde et finit avec toucher et agilité.',positions:[8,5,0],height:[170,194],build:-4,strengths:['layup','dribbling','acceleration'],support:['speed','insideScoring','vertical'],weaknesses:['postMoves','interiorDefense']},
  {id:'sniper',label:'Sniper longue distance',description:'Sa première arme est le tir extérieur, soutenu par le dribble.',positions:[8,5,0],height:[174,198],build:-2,strengths:['threePoint','dribbling'],support:['freeThrows','midRange','stamina'],weaknesses:['postMoves','blocks','dunk']},
  {id:'shooter',label:'Shooter',description:'Privilégie le tir avec moins de création balle en main.',positions:[4,8,1],height:[180,202],build:-2,strengths:['threePoint','midRange','freeThrows'],support:['stamina','speed'],weaknesses:['dribbling','postMoves','blocks']},
  {id:'three-and-d',label:'3&D',description:'Associe tir extérieur et défense sur les extérieurs.',positions:[2,9,2],height:[184,204],build:0,strengths:['threePoint','perimeterDefense'],support:['steals','stamina','speed'],weaknesses:['passing','postMoves','dribbling']},
  {id:'complete-scorer',label:'Scoreur complet',description:'Dispose de plusieurs solutions pour marquer, près du cercle comme au tir.',positions:[4,9,2],height:[182,205],build:1,strengths:['insideScoring','layup','midRange','threePoint'],support:['dribbling','postMoves'],weaknesses:['blocks','rebounding']},
  {id:'slasher',label:'Slasher',description:'Attaque le cercle avec vitesse, détente et finition aérienne.',positions:[3,9,2],height:[182,204],build:0,strengths:['dunk','vertical','speed','insideScoring'],support:['layup','acceleration'],weaknesses:['threePoint','postMoves']},
  {id:'power-slasher',label:'Slasher puissant',description:'Percute et finit en utilisant sa force.',positions:[1,8,5],height:[187,210],build:7,strengths:['strength','insideScoring','dunk'],support:['layup','acceleration','rebounding'],weaknesses:['threePoint','freeThrows']},
  {id:'post-scorer',label:'Scoreur au poste',description:'Crée ses paniers par les appuis et les mouvements dos au panier.',positions:[0,3,9],height:[190,212],build:4,strengths:['postMoves','insideScoring','midRange'],support:['strength','layup'],weaknesses:['speed','threePoint']},
  {id:'rebound-defender',label:'Rebondeur défenseur',description:'Se spécialise dans le rebond et la défense intérieure.',positions:[0,3,9],height:[189,211],build:6,strengths:['rebounding','interiorDefense','strength'],support:['blocks','stamina'],weaknesses:['threePoint','dribbling','midRange']},
  {id:'versatile-defender',label:'Défenseur polyvalent',description:'Défend à l’extérieur comme à l’intérieur.',positions:[1,9,4],height:[186,208],build:3,strengths:['perimeterDefense','interiorDefense','steals'],support:['strength','speed','blocks'],weaknesses:['threePoint','postMoves']},
  {id:'midrange-scorer',label:'Scoreur mi-distance',description:'Crée des tirs intermédiaires par ses appuis et son dribble.',positions:[2,8,3],height:[183,207],build:2,strengths:['midRange','dribbling','postMoves'],support:['insideScoring','freeThrows'],weaknesses:['blocks','threePoint']},
  {id:'perimeter-defender',label:'Défenseur extérieur',description:'Gêne le porteur grâce à sa mobilité et ses mains actives.',positions:[6,9,0],height:[176,200],build:0,strengths:['perimeterDefense','steals','speed'],support:['acceleration','stamina'],weaknesses:['threePoint','postMoves','blocks']},
  {id:'stretch-big',label:'Intérieur shooteur',description:'Écarte le jeu grâce au tir, avec un gabarit intérieur.',positions:[0,2,9],height:[195,213],build:1,strengths:['threePoint','midRange'],support:['rebounding','postMoves','freeThrows'],weaknesses:['speed','dribbling','acceleration']},
  {id:'inside-finisher',label:'Finisseur intérieur',description:'Termine près du cercle les occasions créées par l’équipe.',positions:[0,3,9],height:[192,213],build:3,strengths:['insideScoring','layup','dunk'],support:['vertical','rebounding'],weaknesses:['threePoint','dribbling','passing','postMoves']},
  {id:'complete-big',label:'Intérieur complet',description:'Associe jeu au poste, défense intérieure, rebond et passe.',positions:[0,2,9],height:[194,213],build:4,strengths:['insideScoring','postMoves','interiorDefense','rebounding'],support:['passing','midRange','blocks'],weaknesses:['threePoint','acceleration']},
  {id:'power-big',label:'Intérieur en puissance',description:'Impose sa force pour prendre position et marquer dans la raquette.',positions:[0,1,9],height:[195,214],build:11,strengths:['strength','insideScoring','postMoves','dunk'],support:['rebounding','interiorDefense'],weaknesses:['speed','threePoint','freeThrows']},
  {id:'rim-protector',label:'Protecteur de cercle',description:'Dissuade et contre les tirs près du panier.',positions:[0,2,9],height:[196,214],build:2,strengths:['blocks','interiorDefense'],support:['rebounding','vertical','strength'],weaknesses:['threePoint','dribbling','midRange']},
]
export const profileOffset=(profile:PlayProfile,key:Attribute):number=>profile.strengths.includes(key)?35:profile.support.includes(key)?18:profile.weaknesses.includes(key)?-15:0

// Compare le relief des notes plutôt que le niveau : un joueur moyen a aussi un style.
// Aucun bonus ni classe stockée ; le libellé peut évoluer avec les entraînements.
export function playerProfile(player:Pick<Player,'attributes'>):PlayProfile {
  const keys=Object.keys(attributeLabels) as Attribute[]
  const mean=keys.reduce((sum,key)=>sum+player.attributes[key],0)/keys.length
  const score=(profile:PlayProfile)=>{
    const offsets=keys.map(key=>profileOffset(profile,key)),center=offsets.reduce((a,b)=>a+b,0)/keys.length
    let dot=0,norm=0
    keys.forEach((key,index)=>{const value=offsets[index]!-center;dot+=(player.attributes[key]-mean)*value;norm+=value*value})
    return dot/Math.sqrt(norm)
  }
  return playProfiles.reduce((best,profile)=>score(profile)>score(best)?profile:best,playProfiles[0]!)
}
export function profilePositionWeight(profile:PlayProfile,position:Position):number {
  return profile.positions[(['G','W','C'] as const).indexOf(position)]
}
