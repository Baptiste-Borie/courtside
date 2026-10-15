import { expect, it } from 'vitest'
import { potentialForAge } from './potential'
import { generateTeam } from './generate'
import { foundingCandidates } from './founding'
it('donne généralement plus de marge aux jeunes à niveau égal',()=>{
 const average=(age:number)=>Array.from({length:1000},(_,i)=>potentialForAge(45,age,i/1000)-45).reduce((a,b)=>a+b,0)/1000
 expect(average(18)-average(34)).toBeGreaterThan(15)
 expect(average(22)).toBeGreaterThan(average(28))
})
it('garde les jeunes limités, les progressions tardives et les bornes',()=>{
 expect(potentialForAge(45,18,.01)).toBeLessThan(potentialForAge(45,34,.99))
 for(const overall of [0,40,80,99])for(const age of [18,25,34,45])for(const roll of [0,.05,.5,.97,.999]) {
  const value=potentialForAge(overall,age,roll)
  expect(value).toBeGreaterThanOrEqual(overall);expect(value).toBeLessThanOrEqual(99);expect(Number.isInteger(value)).toBe(true)
 }
})
it('ne retire aucune caractéristique pour changer la génération du potentiel',()=>{
 for(let seed=0;seed<30;seed++) {
  const before=generateTeam(seed,'a','A',2),after=generateTeam(seed,'a','A',3)
  before.players.forEach((player,index)=>{
   const next=after.players[index]!
   expect({...next,potential:player.potential}).toEqual(player)
  })
 }
 expect(foundingCandidates(2).map(p=>p.potential)).not.toEqual(foundingCandidates(3).map(p=>p.potential))
 expect(foundingCandidates(2).map(p=>p.attributes)).toEqual(foundingCandidates(3).map(p=>p.attributes))
})
