import { expect, it } from 'vitest'
import { createRoster, playRound, startTournament } from './tournament'
import { lineupFromSelected, placePlayer, selectedFromLineup, sendToBench, validLineup, type Lineup } from './lineup'
const roster=createRoster(1983)
const initial:Lineup=roster.slice(0,3).map(p=>p.id) as Lineup
it('échange un titulaire et un remplaçant sans doublon ni perte de joueur',()=>{
 const next=placePlayer(initial,roster,roster[3]!.id,0)
 expect(next).toEqual([roster[3]!.id,initial[1],initial[2]])
 expect(initial).toEqual(roster.slice(0,3).map(p=>p.id))
 expect(roster.filter(p=>!next.includes(p.id)).map(p=>p.id)).toContain(initial[0])
 expect(new Set(selectedFromLineup(next)).size).toBe(3)
})
it('échange deux titulaires et permet de déplacer un joueur vers un poste vide',()=>{
 const swapped=placePlayer(initial,roster,initial[0]!,2)
 expect(swapped).toEqual([initial[2],initial[1],initial[0]])
 const empty=sendToBench(initial,initial[2]!)
 expect(empty).toEqual([initial[0],initial[1],null])
 expect(placePlayer(empty,roster,initial[0]!,2)).toEqual([null,initial[1],initial[0]])
 expect(placePlayer(empty,roster,roster[4]!.id,2)).toEqual([initial[0],initial[1],roster[4]!.id])
 expect(placePlayer(initial,roster,initial[0]!,0)).toEqual(initial)
})
it('refuse les placements inconnus et ne contraint pas le poste naturel',()=>{
 for(const slot of [-1,3,.5])expect(()=>placePlayer(initial,roster,initial[0]!,slot)).toThrow()
 expect(()=>placePlayer(initial,roster,'absent',0)).toThrow()
 expect(placePlayer(initial,roster,roster.find(p=>p.position==='C')!.id,0)[0]).toBe(roster.find(p=>p.position==='C')!.id)
})
it('valide les trous, l’ordre et l’appartenance à l’effectif',()=>{
 const empty=sendToBench(initial,initial[1]!),selected=selectedFromLineup(empty)
 expect(validLineup(empty,roster,selected)).toBe(true)
 expect(lineupFromSelected([])).toEqual([null,null,null])
 for(const value of [[],[initial[0],initial[0],initial[2]],[initial[0],'absent',initial[2]],[initial[0],initial[1],initial[2],null]])expect(validLineup(value,roster,selected)).toBe(false)
 expect(validLineup(initial,roster,[initial[1]!,initial[0]!,initial[2]!])).toBe(false)
})
it('utilise les titulaires remplacés dans le prochain match et bloque un trois incomplet',()=>{
 const next=placePlayer(initial,roster,roster[3]!.id,0),selected=selectedFromLineup(next)
 const tournament=startTournament(1983,roster,selected,'Club')
 const round=playRound(tournament,roster,selected,'balanced')
 const match=round.matches.find(m=>m.home==='club')!
 expect(match.result.stats[0].map(p=>p.playerId)).toEqual(selected)
 expect(match.result.stats[0].some(p=>p.playerId===initial[0])).toBe(false)
 expect(()=>startTournament(1983,roster,selectedFromLineup(sendToBench(next,selected[0]!)),'Club')).toThrow()
})
