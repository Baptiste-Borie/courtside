import type { Attribute, Player, Team } from './model'
const affected: Attribute[] = ['speed','acceleration','strength','stamina','layup','dunk','insideScoring','threePoint','dribbling','perimeterDefense','interiorDefense','blocks','steals','rebounding']
export function afterPlaying(players:Player[], selected:string[]):Player[] {
 return players.map(p=>selected.includes(p.id)?{...p,fatigue:Math.min(100,p.fatigue+Math.round(28-p.attributes.stamina/10))}:p)
}
export function recover(players:Player[], days:number):Player[] {
 if(!Number.isInteger(days)||days<0)throw Error('Durée de récupération invalide.')
 return players.map(p=>({...p,fatigue:Math.max(0,p.fatigue-days*6)}))
}
export function effectiveTeam(team:Team):Team {
 return {...team,players:team.players.map(p=>{
  const attributes={...p.attributes}, factor=1-Math.max(0,p.fatigue-20)/320
  for(const key of affected)attributes[key]=Math.round(attributes[key]*factor)
  return {...p,attributes}
 })}
}
