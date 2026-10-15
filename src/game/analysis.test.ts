import { expect, it } from 'vitest'
import { matchTotals, teamProfile } from './analysis'
import { generateTeam } from './generate'
import { simulate } from './simulate'
it('reconstitue les scores à partir des tirs sur cinquante matchs',()=>{
 const a=generateTeam(31,'a','Club'),b=generateTeam(94,'b','Rivaux')
 for(let seed=0;seed<50;seed++) {
  const result=simulate(a,b,'inside','fast',seed)
  for(const side of [0,1] as const) {
   const total=matchTotals(result.stats[side])
   expect(total.insideMade+total.outsideMade*2).toBe(result.scores[side])
   expect(total.points).toBe(result.scores[side])
   expect(total.insideAttempted).toBeGreaterThanOrEqual(total.insideMade)
   expect(total.shooting).toBeGreaterThanOrEqual(0)
   expect(total.shooting).toBeLessThanOrEqual(100)
  }
 }
})
it('affiche une absence de tirs sans inventer un taux de réussite',()=>{
 expect(matchTotals([])).toMatchObject({shooting:null,made:0,attempted:0,points:0})
})
it('reflète la fatigue sans altérer les notes permanentes',()=>{
 const fresh=generateTeam(42,'a','Club'),tired=structuredClone(fresh)
 tired.players.forEach(player=>player.fatigue=100)
 const before=structuredClone(tired),first=teamProfile(fresh),last=teamProfile(tired)
 expect(tired).toEqual(before)
 expect(last.find(axis=>axis.id==='outside')!.value).toBeLessThan(first.find(axis=>axis.id==='outside')!.value)
 expect(()=>teamProfile({...fresh,players:fresh.players.slice(0,2)})).toThrow()
})
