import type { Player, Position } from './model'
export type Lineup = [string|null,string|null,string|null]
export const lineupPositions: {position:Position;label:string}[] = [
  {position:'G',label:'Meneur'}, {position:'W',label:'Ailier'}, {position:'C',label:'Intérieur'},
]
export const positionLabels:Record<Position,string>={G:'Meneur',W:'Ailier',C:'Intérieur'}
export function lineupFromSelected(selected:string[]):Lineup {
  return [selected[0]??null,selected[1]??null,selected[2]??null]
}
export function selectedFromLineup(lineup:Lineup):string[] {
  return lineup.filter((id):id is string=>id!==null)
}
export function validLineup(value:unknown,roster:Player[],selected:string[]):value is Lineup {
  if(!Array.isArray(value)||value.length!==3||!value.every(id=>id===null||typeof id==='string'&&roster.some(p=>p.id===id)))return false
  const ids=value.filter(id=>id!==null)
  return new Set(ids).size===ids.length&&ids.length===selected.length&&ids.every((id,index)=>id===selected[index])
}
export function placePlayer(lineup:Lineup,roster:Player[],id:string,slot:number):Lineup {
  if(!Number.isInteger(slot)||slot<0||slot>2||!roster.some(p=>p.id===id))throw Error('Placement invalide.')
  const next=[...lineup] as Lineup,source=next.indexOf(id)
  if(source===slot)return next
  if(source!==-1)next[source]=next[slot]!
  next[slot]=id
  return next
}
export function sendToBench(lineup:Lineup,id:string):Lineup {
  return lineup.map(value=>value===id?null:value) as Lineup
}
