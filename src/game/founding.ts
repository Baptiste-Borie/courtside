import { generateTeam } from './generate'
import { createRoster } from './tournament'
import type { Player } from './model'
export type FoundingPhase = 'intro'|'identity'|'packs'|'selection'
export interface Founding { phase?:FoundingPhase; completed: boolean; selected: string[]; opened: number[]; revealed: string[] }
export function createFounding(): Founding { return { phase:'intro', completed: false, selected: [], opened: [], revealed: [] } }
export function foundingCandidates(): Player[] {
  const extra=[generateTeam(1985,'founding-a',''),generateTeam(1986,'founding-b','')].flatMap(team=>team.players)
  return [...createRoster(1983),...extra.map((player,index)=>({...player,id:`player-${index+6}`,teamId:'club'}))]
}
export function foundClub(name:string, ids:string[]) {
  const candidates=foundingCandidates()
  if(!name.trim() || name.trim().length>40)throw Error('Choisissez un nom de 1 à 40 caractères.')
  if(ids.length!==6 || new Set(ids).size!==6 || ids.some(id=>!candidates.some(player=>player.id===id)))throw Error('Choisissez six joueurs différents pour former votre effectif.')
  const roster=ids.map(id=>structuredClone(candidates.find(player=>player.id===id)!))
  return {name:name.trim(),roster,selected:roster.slice(0,3).map(player=>player.id),founding:{completed:true,selected:[],opened:[],revealed:[]} satisfies Founding}
}

export function packCandidates(index:number):Player[] {
 if(!Number.isInteger(index)||index<0||index>2)throw Error('Pochette inconnue.')
 return foundingCandidates().slice(index*4,index*4+4)
}
export function openPack(state:Founding,index:number):Founding {
 packCandidates(index)
 if(state.completed)throw Error('Votre effectif est déjà constitué.')
 return {...state,opened:state.opened.includes(index)?[...state.opened]:[...state.opened,index]}
}
export function revealCard(state:Founding,id:string):Founding {
 const index=foundingCandidates().findIndex(player=>player.id===id)
 if(state.completed||index<0||!state.opened.includes(Math.floor(index/4)))throw Error('Ouvrez la pochette avant de dévoiler cette carte.')
 return {...state,revealed:state.revealed.includes(id)?[...state.revealed]:[...state.revealed,id]}
}
export function revealAll(state:Founding):Founding {
 if(state.completed)throw Error('Votre effectif est déjà constitué.')
 return {...state,opened:[0,1,2],revealed:foundingCandidates().map(player=>player.id)}
}
