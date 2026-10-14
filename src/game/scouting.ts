import { generateTeam } from './generate'
import { random } from './random'
import type { Player } from './model'
export const scoutingCost = 50
export interface ScoutingState { pool: Player[]; known: string[]; campaign: string[] | null; revealed: number; sequence: number }
export function createScouting(seed: number): ScoutingState {
  const pool = Array.from({length:10},(_,i)=>generateTeam(seed+500+i,`prospect-${i}`,'').players).flat().map(p=>({...p,teamId:''}))
  return { pool, known:[], campaign:null, revealed:0, sequence:0 }
}
export function launchScouting(state: ScoutingState, money: number): {state:ScoutingState;money:number} {
  if(state.campaign) throw Error('Terminez la révélation de cette campagne.')
  if(money<scoutingCost) throw Error('Il faut 50 F pour lancer une campagne.')
  const candidates=state.pool.filter(p=>!state.known.includes(p.id))
  if(!candidates.length) throw Error('Tous les prospects de ce circuit ont été observés.')
  const rng=random(9001+state.sequence)
  for(let i=candidates.length-1;i>0;i--) {const j=Math.floor(rng()*(i+1));[candidates[i],candidates[j]]=[candidates[j]!,candidates[i]!]}
  return {state:{...state,campaign:candidates.slice(0,3).map(p=>p.id),revealed:0,sequence:state.sequence+1},money:money-scoutingCost}
}
export function revealNext(state: ScoutingState): ScoutingState {
  if(!state.campaign || state.revealed>=state.campaign.length) throw Error('Aucun dossier à révéler.')
  return {...state,revealed:state.revealed+1,known:[...state.known,state.campaign[state.revealed]!]}
}
export function closeCampaign(state: ScoutingState): ScoutingState {
  if(!state.campaign || state.revealed!==state.campaign.length) throw Error('Révélez tous les dossiers avant de terminer.')
  return {...state,campaign:null,revealed:0}
}
export function recruitmentCost(player: Player): number {return 25+Math.max(0,player.overall-40)*3}
export function recruit(state: ScoutingState, roster: Player[], money:number, id:string) {
  const player=state.pool.find(p=>p.id===id)
  if(!player || !state.known.includes(id)) throw Error('Ce joueur doit être observé avant son recrutement.')
  if(roster.some(p=>p.id===id)) throw Error('Ce joueur fait déjà partie de votre équipe.')
  if(roster.length>=10) throw Error('Votre effectif est limité à dix joueurs pour ce prototype.')
  const cost=recruitmentCost(player)
  if(money<cost) throw Error('Fonds insuffisants pour ce recrutement.')
  return {roster:[...roster,{...structuredClone(player),teamId:'club'}],money:money-cost}
}
