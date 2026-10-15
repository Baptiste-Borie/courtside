import { expect, it } from 'vitest'
import { generateTeam } from './generate'
import { playProfiles, playerProfile, profileOffset } from './profiles'
import { attributeLabels, type Attribute, type Attributes } from './model'
import { createFounding, foundingCandidates, foundClub, packCandidates, revealAll } from './founding'
import { generateLegacyTeam } from './legacy-generate'

const population=Array.from({length:1500},(_,seed)=>generateTeam(seed,'team','').players).flat()
const mean=(values:number[])=>values.reduce((a,b)=>a+b,0)/values.length
it('retrouve les vingt profils à partir des notes, indépendamment du niveau',()=>{
 expect(playProfiles).toHaveLength(20)
 for(const profile of playProfiles)for(const base of [25,45,55]) {
  const attributes=Object.fromEntries((Object.keys(attributeLabels) as Attribute[]).map(key=>[key,base+profileOffset(profile,key)])) as Attributes
  expect(playerProfile({attributes}).id).toBe(profile.id)
 }
 expect(new Set(population.map(player=>playerProfile(player).id)).size).toBe(20)
})
it('génère une population cohérente avec des exceptions et des variations',()=>{
 const small=population.filter(p=>p.height<180),tall=population.filter(p=>p.height>=200)
 const inside=(players:typeof population)=>mean(players.map(p=>(p.attributes.rebounding+p.attributes.interiorDefense+p.attributes.blocks)/3))
 expect(small.length).toBeGreaterThan(100)
 expect(inside(tall)-inside(small)).toBeGreaterThan(15)
 expect(small.filter(p=>p.attributes.rebounding>=75&&p.attributes.interiorDefense>=75).length/small.length).toBeLessThan(.03)
 const creators=population.filter(p=>playerProfile(p).id==='playmaker'),power=population.filter(p=>playerProfile(p).id==='power-big')
 expect(mean(power.map(p=>p.weight))-mean(creators.map(p=>p.weight))).toBeGreaterThan(20)
 expect(creators.some(p=>p.height>=200)).toBe(true)
 expect(population.some(p=>p.height<185&&p.attributes.rebounding>=73)).toBe(true)
 for(const p of population) {
  expect(p.weight).toBeGreaterThanOrEqual(55)
  expect(p.weight).toBeLessThanOrEqual(130)
  expect(p.overall).toBe(Math.round(mean(Object.values(p.attributes))))
 }
 const shooters=population.filter(p=>playerProfile(p).id==='shooter')
 expect(new Set(shooters.map(p=>p.height)).size).toBeGreaterThan(10)
})
it('préserve les anciens candidats jusque dans l’effectif confirmé',()=>{
 const expected=[0,1,2,3].flatMap((i)=>generateLegacyTeam(1983+i,i<2?`roster-${i}`:i===2?'founding-a':'founding-b','').players).map((p,i)=>({...p,id:`player-${i}`,teamId:'club'}))
 expect(foundingCandidates(1)).toEqual(expected)
 expect(foundingCandidates(2)).not.toEqual(expected)
 const state=revealAll({...createFounding(),generation:1})
 expect([0,1,2].flatMap(index=>packCandidates(index,state.generation))).toEqual(expected)
 expect(foundClub('Club',expected.slice(0,6).map(p=>p.id),state.generation).roster).toEqual(expected.slice(0,6))
})
