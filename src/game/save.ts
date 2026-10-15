import { validLineup, type Lineup } from './lineup'
import { foundingCandidates, type Founding } from './founding'
import { circuits, createCareer, type Career } from './circuit'
import { trainingLabels, type Training } from './training'
import { createCalendar, type Calendar } from './calendar'
import { attributeLabels, tactics, type Player } from './model'
import type { ScoutingState } from './scouting'
import type { Tournament } from './tournament'
export const saveKey = 'courtside.save.v1'
export interface Save {
  version: 1; lineup?: Lineup; founding: Founding; career: Career; training: Training | null; calendar: Calendar; name: string; roster: Player[]; selected: string[]
  tactic: keyof typeof tactics; tournament: Tournament | null
  money: number; titles: number; edition: number; scouting: ScoutingState
}
const record = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)
const integer = (x: unknown, min=0, max=Number.MAX_SAFE_INTEGER): x is number => typeof x==='number' && Number.isInteger(x) && x>=min && x<=max
const strings = (x: unknown): x is string[] => Array.isArray(x) && x.every(v=>typeof v==='string') && new Set(x).size===x.length
function player(x: unknown): x is Player {
  if(!record(x) || !record(x.attributes)) return false
  const attributes=x.attributes
  return ['id','firstName','lastName','teamId'].every(k=>typeof x[k]==='string') && (x.id as string).length>0
    && integer(x.birthYear,1800,1983) && integer(x.height,140,250) && integer(x.weight,35,200)
    && ['G','W','C'].includes(String(x.position)) && Array.isArray(x.secondaryPositions)
    && x.secondaryPositions.every(v=>['G','W','C'].includes(v))
    && Object.keys(attributeLabels).every(k=>integer(attributes[k],0,99))
    && integer(x.overall,0,99) && integer(x.potential,0,99) && integer(x.fatigue,0,100) && typeof x.healthy==='boolean'
}
function players(x: unknown): x is Player[] {return Array.isArray(x) && x.every(player) && new Set(x.map(p=>p.id)).size===x.length}
function tournament(x: unknown): boolean {
  if(x===null) return true
  if(!record(x) || !integer(x.seed) || !integer(x.round,0,3) || !Array.isArray(x.teams) || x.teams.length!==4) return false
  if(!x.teams.every(t=>record(t)&&typeof t.id==='string'&&typeof t.name==='string'&&players(t.players)&&t.players.length===3)) return false
  const ids=x.teams.map(t=>t.id)
  if(new Set(ids).size!==4 || ids[0]!=='club' || !Array.isArray(x.standings) || x.standings.length!==4) return false
  if(!x.standings.every(s=>record(s)&&ids.includes(s.teamId)&&typeof s.name==='string'&&integer(s.wins,0,3)&&integer(s.scored)&&integer(s.conceded))) return false
  if(new Set(x.standings.map(s=>s.teamId)).size!==4 || !Array.isArray(x.matches) || x.matches.length!==x.round*2) return false
  for(const m of x.matches) {
    if(!record(m)||!integer(m.round,1,x.round)||!ids.includes(m.home)||!ids.includes(m.away)||m.home===m.away||!record(m.result)) return false
    const r=m.result
    if(!integer(r.seed)||!integer(r.possessions,1)||!Array.isArray(r.scores)||r.scores.length!==2||!r.scores.every(v=>integer(v,0,22))) return false
    if(Math.max(...r.scores)<21 || Math.min(...r.scores)>=21 || r.winner!==(r.scores[0]>r.scores[1]?m.home:m.away)) return false
    if(!Array.isArray(r.stats)||r.stats.length!==2) return false
    for(let side=0;side<2;side++) {
      const lines=r.stats[side]
      if(!Array.isArray(lines)||lines.length!==3||!lines.every(p=>record(p)&&typeof p.playerId==='string'&&['points','rebounds','assists','steals','blocks','made','attempted','outsideMade','outsideAttempted'].every(k=>integer(p[k])))) return false
      if(lines.reduce((sum,p)=>sum+p.points,0)!==r.scores[side]) return false
    }
  }
  return x.finished===(x.round===3) && (x.finished ? integer(x.rank,1,4)&&x.reward===[300,200,125,75][x.rank-1] : x.rank===null&&x.reward===0)
}
export function decodeSave(text: string): Save {
  const x: unknown=JSON.parse(text)
  if(!record(x)||x.version!==1||typeof x.name!=='string'||x.name.length>40||!players(x.roster)||x.roster.length<6||x.roster.length>10||!strings(x.selected)||x.selected.length>3||x.selected.some(id=>!(x.roster as Player[]).some(p=>p.id===id))) throw Error('Sauvegarde incompatible ou endommagée.')
  if(x.lineup!==undefined&&!validLineup(x.lineup,x.roster,x.selected))throw Error('Composition du terrain invalide.')
  if(!Object.hasOwn(tactics,String(x.tactic))||!integer(x.money)||!integer(x.titles)||!integer(x.edition)||x.titles>x.edition||!tournament(x.tournament)||!record(x.scouting)) throw Error('Sauvegarde incompatible ou endommagée.')
  const s=x.scouting
  if(!players(s.pool)||s.pool.length!==30||!strings(s.known)||s.known.some(id=>!(s.pool as Player[]).some(p=>p.id===id))||!integer(s.sequence,0,10)||!integer(s.revealed,0,3)) throw Error('Dossiers de scouting invalides.')
  if(s.campaign===null ? s.revealed!==0 : !strings(s.campaign)||s.campaign.length<1||s.campaign.length>3||s.revealed>s.campaign.length||s.campaign.some(id=>!(s.pool as Player[]).some(p=>p.id===id))||s.campaign.slice(0,s.revealed).some(id=>!(s.known as string[]).includes(id))) throw Error('Campagne de scouting invalide.')
  // Migration des sauvegardes du patch 005 : un tournoi entamé reprend immédiatement.
  if(x.calendar===undefined) x.calendar={...createCalendar(),matchDay:x.tournament && record(x.tournament) && !x.tournament.finished ? 0 : null}
  const c=x.calendar
  if(record(c) && c.trainingDay===undefined)c.trainingDay=null
  if(x.training===undefined)x.training=null
  if(!record(c)||!integer(c.day,0,365000)||![c.matchDay,c.scoutingDay,c.trainingDay].every(day=>day===null||integer(day,c.day as number,365000))) throw Error('Calendrier invalide.')
  if(record(x.tournament) && !x.tournament.finished ? c.matchDay===null : c.matchDay!==null) throw Error('Calendrier du tournoi incohérent.')
  if(c.scoutingDay!==null && s.campaign===null) throw Error('Calendrier du scouting incohérent.')
  const t=x.training
  if(t!==null && (!record(t)||typeof t.playerId!=='string'||!x.roster.some(p=>p.id===t.playerId)||!Object.hasOwn(trainingLabels,String(t.focus))||!integer(t.day,c.day as number)||t.day!==c.trainingDay)) throw Error('Camp d’entraînement invalide.')
  if(t===null && c.trainingDay!==null)throw Error('Calendrier d’entraînement incohérent.')
  // Les anciennes éditions ne sont pas reconstituées : leurs détails sont inconnus.
  if(x.career===undefined)x.career={...createCareer(),active:record(x.tournament)&&!x.tournament.finished?'neighborhood':null}
  const career=x.career
  if(!record(career)||!integer(career.reputation)||!Array.isArray(career.history)||!(career.active===null||Object.hasOwn(circuits,String(career.active))))throw Error('Circuit de compétitions invalide.')
  if(record(x.tournament)&&!x.tournament.finished ? career.active===null : career.active!==null)throw Error('Compétition active incohérente.')
  if(career.active!==null&&career.reputation<circuits[career.active as keyof typeof circuits].threshold)throw Error('Compétition verrouillée dans la sauvegarde.')
  let previousEdition=0,previousDay=0,reputation=0
  for(const result of career.history) {
    if(!record(result)||!integer(result.edition,previousEdition+1,x.edition as number)||!integer(result.day,previousDay,c.day as number)||!integer(result.rank,1,4)||!integer(result.wins,0,3)||!Object.hasOwn(circuits,String(result.circuit)))throw Error('Palmarès invalide.')
    const definition=circuits[result.circuit as keyof typeof circuits]
    if(reputation<definition.threshold||result.reward!==[300,200,125,75][(result.rank as number)-1]!*definition.multiplier||result.reputation!==[6,4,2,1][(result.rank as number)-1])throw Error('Récompense de compétition invalide.')
    reputation+=result.reputation as number;previousEdition=result.edition as number;previousDay=result.day as number
  }
  if(career.reputation!==reputation)throw Error('Réputation incohérente.')
  if(x.founding===undefined)x.founding={completed:true,selected:[]}
  const f=x.founding
  if(!record(f)||typeof f.completed!=='boolean'||!strings(f.selected)||f.selected.length>6||f.selected.some(id=>!foundingCandidates().some(player=>player.id===id)))throw Error('Sélection de départ invalide.')
  // Conserver les douze candidats des créations entamées avant le patch 015.
  if(!f.completed && f.generation===undefined)f.generation=1
  if(f.generation!==undefined && f.generation!==1 && f.generation!==2)throw Error('Génération de départ inconnue.')
  // Le patch 011 montrait déjà les douze joueurs : ne pas les cacher à la migration.
  if(f.opened===undefined)f.opened=f.completed?[]:[0,1,2]
  if(f.revealed===undefined)f.revealed=f.completed?[]:foundingCandidates().map(player=>player.id)
  if(!Array.isArray(f.opened)||new Set(f.opened).size!==f.opened.length||!f.opened.every(index=>integer(index,0,2))||!strings(f.revealed)||f.revealed.some(id=>!foundingCandidates().some((player,index)=>player.id===id&&(f.opened as number[]).includes(Math.floor(index/4)))))throw Error('Pochettes de départ invalides.')
  if(!f.completed&&f.selected.length>0&&f.revealed.length!==12)throw Error('Dévoilez les joueurs avant de choisir votre effectif.')
  if(f.phase!==undefined&&!['intro','identity','packs','selection'].includes(String(f.phase)))throw Error('Étape de création invalide.')
  if(f.phase==='selection'&&f.revealed.length!==12)throw Error('Dévoilez les joueurs avant la sélection.')
  if(f.completed&&f.selected.length!==0)throw Error('Sélection de départ déjà terminée.')
  if(!f.completed&&(x.edition!==0||x.tournament!==null||x.money!==0||c.day!==0||x.training!==null||s.campaign!==null))throw Error('Début de carrière incohérent.')
  return x as unknown as Save
}
