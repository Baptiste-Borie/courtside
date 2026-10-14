import { generateTeam } from './generate'
import { simulate } from './simulate'
import type { MatchResult, Player, Tactic, Team } from './model'
export interface Standing { teamId: string; name: string; wins: number; scored: number; conceded: number }
export interface Tournament {
  seed: number; teams: Team[]; round: number; standings: Standing[]
  matches: { round: number; home: string; away: string; result: MatchResult }[]
  finished: boolean; reward: number; rank: number | null
}
const schedule = [[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]] as const
export function createRoster(seed: number): Player[] {
  return [0,1].flatMap(i => generateTeam(seed+i, `roster-${i}`, '').players).map((p,i)=>({...p,id:`player-${i}`,teamId:'club'}))
}
export function startTournament(seed: number, roster: Player[], selected: string[], clubName: string): Tournament {
  if (!clubName.trim()) throw Error('Donnez un nom à votre équipe.')
  const team=selectTeam(roster,selected,clubName)
  const teams=[team,...['Les Docks','Les Échos','Les As du Bitume'].map((name,i)=>generateTeam(seed+100+i,`opponent-${i}`,name))]
  return {seed,teams,round:0,standings:teams.map(t=>({teamId:t.id,name:t.name,wins:0,scored:0,conceded:0})),matches:[],finished:false,reward:0,rank:null}
}
function selectTeam(roster: Player[], selected: string[], name: string): Team {
  if(selected.length!==3 || new Set(selected).size!==3 || selected.some(id=>!roster.some(p=>p.id===id))) throw Error('Sélectionnez exactement trois joueurs différents.')
  return {id:'club',name,players:selected.map(id=>structuredClone(roster.find(p=>p.id===id)!))}
}
export function playRound(current: Tournament, roster: Player[], selected: string[], tactic: Tactic): Tournament {
  if(current.finished) throw Error('Le tournoi est terminé.')
  const next=structuredClone(current)
  next.teams[0]=selectTeam(roster,selected,next.teams[0]!.name)
  for(const [home,away] of schedule[next.round]!) {
    const a=next.teams[home]!, b=next.teams[away]!
    const result=simulate(a,b,home===0?tactic:'balanced','balanced',next.seed*100+next.round*10+home)
    next.matches.push({round:next.round+1,home:a.id,away:b.id,result})
    const first=next.standings.find(s=>s.teamId===a.id)!, second=next.standings.find(s=>s.teamId===b.id)!
    first.scored+=result.scores[0]; first.conceded+=result.scores[1]
    second.scored+=result.scores[1]; second.conceded+=result.scores[0]
    ;(result.winner===a.id?first:second).wins++
  }
  next.round++
  next.standings.sort((a,b)=>b.wins-a.wins || (b.scored-b.conceded)-(a.scored-a.conceded) || b.scored-a.scored || a.teamId.localeCompare(b.teamId))
  if(next.round===3) {
    next.finished=true;next.rank=next.standings.findIndex(s=>s.teamId==='club')+1
    next.reward=[300,200,125,75][next.rank-1]!
  }
  return next
}
