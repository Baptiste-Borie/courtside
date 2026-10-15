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

import { potentialForTalent } from './potential'
it('reconnaît les spécialistes précoces même avec une moyenne faible',()=>{
 const specialist={threePoint:96,dribbling:45,passing:35,layup:40,rebounding:30}
 for(const age of [16,17,18,20])for(const draw of [0,.01,.5,.99]) {
  expect(potentialForTalent(42,age,specialist,draw)).toBeGreaterThanOrEqual(80)
  expect(potentialForTalent(42,age,{...specialist,dribbling:95},draw)).toBeGreaterThanOrEqual(88)
 }
 expect(potentialForTalent(42,17,{...specialist,threePoint:60,strength:99,freeThrows:99},0)).toBeLessThan(80)
})
it('combine relief, talent individuel et paliers de maturité sans pente annuelle',()=>{
 const skills={threePoint:78,dribbling:73,passing:70,layup:65,rebounding:40}
 expect(potentialForTalent(45,16,skills,.5)).toBe(potentialForTalent(45,20,skills,.5))
 expect(potentialForTalent(45,24,skills,.9)).toBeGreaterThan(potentialForTalent(45,17,skills,.1))
 expect(potentialForTalent(45,32,skills,.99)).toBeGreaterThan(potentialForTalent(45,18,skills,.01))
 expect(potentialForTalent(45,18,skills,.5)).toBeGreaterThan(potentialForTalent(45,18,{threePoint:45,passing:45},.5))
 for(const age of [16,20,25,34,45])for(const overall of [0,45,80,99])for(const draw of [0,.08,.5,.999]) {
  const value=potentialForTalent(overall,age,skills,draw)
  expect(value).toBeGreaterThanOrEqual(overall);expect(value).toBeLessThanOrEqual(99);expect(Number.isInteger(value)).toBe(true)
 }
})
it('génère des mineurs et de rares phénomènes sans généraliser les notes à 95',()=>{
 const players=Array.from({length:1000},(_,seed)=>generateTeam(seed,'a','A').players).flat()
 expect(players.some(player=>1983-player.birthYear===16)).toBe(true)
 expect(players.some(player=>1983-player.birthYear===17)).toBe(true)
 const early=players.filter(player=>1983-player.birthYear<=20 && Object.entries(player.attributes).some(([key,value])=>!['strength','speed','acceleration','vertical','stamina','freeThrows','iq'].includes(key)&&value>=95))
 expect(early.length).toBeGreaterThan(0)
 expect(early.every(player=>player.potential>=80)).toBe(true)
 expect(early.length/players.length).toBeLessThan(.03)
 expect(foundingCandidates(4).map(player=>player.potential)).not.toEqual(foundingCandidates(3).map(player=>player.potential))
})

it('reproduit exactement les candidats de génération 018 déjà ouverts',()=>{
 const checksum=JSON.stringify(foundingCandidates(3)).split('').reduce((hash,char)=>Math.imul(hash^char.charCodeAt(0),16777619)>>>0,2166136261)
 expect(checksum).toBe(1997539059)
})
