import { expect, it } from 'vitest'
import { createRoster, startTournament, playRound } from './tournament'
const roster=createRoster(1983), selected=roster.slice(0,3).map(p=>p.id)
it('génère six joueurs distincts et accepte une composition sans postes imposés',()=>{
 expect(new Set(roster.map(p=>p.id)).size).toBe(6)
 expect(startTournament(1,roster,[roster[0]!.id,roster[3]!.id,roster[4]!.id],'A').teams[0]!.players).toHaveLength(3)
 expect(()=>startTournament(1,roster,selected.slice(0,2),'A')).toThrow()
 expect(()=>startTournament(1,roster,[selected[0]!,selected[0]!,selected[1]!],'A')).toThrow()
})
it('simule les six matchs, classe les équipes et récompense une seule fois',()=>{
 let t=startTournament(1983,roster,selected,'A')
 const initial=structuredClone(t)
 for(let i=0;i<3;i++)t=playRound(t,roster,selected,'balanced')
 expect(initial.round).toBe(0)
 expect(t.matches).toHaveLength(6)
 expect(new Set(t.matches.map(m=>[m.home,m.away].sort().join('/'))).size).toBe(6)
 expect(t.standings.reduce((n,s)=>n+s.wins,0)).toBe(6)
 expect(t.standings.reduce((n,s)=>n+s.scored-s.conceded,0)).toBe(0)
 expect(t.finished).toBe(true)
 expect(t.reward).toBe([300,200,125,75][t.rank!-1])
 expect(()=>playRound(t,roster,selected,'balanced')).toThrow()
})
it('autorise un changement de titulaires entre matchs et reste reproductible',()=>{
 const t=startTournament(9,roster,selected,'A')
 const next=roster.slice(3).map(p=>p.id)
 expect(playRound(t,roster,next,'inside')).toEqual(playRound(t,roster,next,'inside'))
 expect(playRound(t,roster,next,'inside').teams[0]!.players.map(p=>p.id)).toEqual(next)
})
