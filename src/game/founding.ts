import { generateTeam } from './generate'
import { createRoster } from './tournament'
import type { Player } from './model'
export interface Founding { completed: boolean; selected: string[] }
export function createFounding(): Founding { return { completed: false, selected: [] } }
export function foundingCandidates(): Player[] {
  const extra=[generateTeam(1985,'founding-a',''),generateTeam(1986,'founding-b','')].flatMap(team=>team.players)
  return [...createRoster(1983),...extra.map((player,index)=>({...player,id:`player-${index+6}`,teamId:'club'}))]
}
export function foundClub(name:string, ids:string[]) {
  const candidates=foundingCandidates()
  if(!name.trim() || name.trim().length>40)throw Error('Choisissez un nom de 1 à 40 caractères.')
  if(ids.length!==6 || new Set(ids).size!==6 || ids.some(id=>!candidates.some(player=>player.id===id)))throw Error('Choisissez six joueurs différents pour former votre effectif.')
  const roster=ids.map(id=>structuredClone(candidates.find(player=>player.id===id)!))
  return {name:name.trim(),roster,selected:roster.slice(0,3).map(player=>player.id),founding:{completed:true,selected:[]} satisfies Founding}
}
