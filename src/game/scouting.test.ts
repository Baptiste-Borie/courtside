import { expect, it } from 'vitest'
import { closeCampaign, createScouting, launchScouting, recruitmentCost, recruit, revealNext } from './scouting'
import { createRoster } from './tournament'
it('observe des joueurs préexistants sans modifier le monde',()=>{
 const state=createScouting(1983), before=structuredClone(state.pool)
 expect(state.pool).toHaveLength(30)
 expect(createScouting(1983)).toEqual(state)
 const campaign=launchScouting(state,125)
 expect(campaign.money).toBe(75)
 expect(campaign.state.pool).toEqual(before)
 expect(new Set(campaign.state.campaign).size).toBe(3)
 expect(()=>launchScouting(campaign.state,100)).toThrow()
 expect(()=>closeCampaign(campaign.state)).toThrow()
})
it('révèle et recrute sans doublon ni solde négatif',()=>{
 let state=launchScouting(createScouting(1983),100).state
 const roster=createRoster(1983), id=state.campaign![0]!
 expect(()=>recruit(state,roster,1000,id)).toThrow()
 state=revealNext(state)
 const cost=recruitmentCost(state.pool.find(p=>p.id===id)!)
 expect(()=>recruit(state,roster,cost-1,id)).toThrow()
 const result=recruit(state,roster,cost,id)
 expect(result.money).toBe(0);expect(result.roster).toHaveLength(7)
 expect(()=>recruit(state,result.roster,1000,id)).toThrow()
 expect(roster).toHaveLength(6)
})
it('épuise le pool sans créer de prospects ni répéter les dossiers',()=>{
 let state=createScouting(1983)
 for(let i=0;i<10;i++) {
  state=launchScouting(state,100).state
  for(let j=0;j<3;j++) state=revealNext(state)
  expect(()=>revealNext(state)).toThrow()
  state=closeCampaign(state)
 }
 expect(new Set(state.known).size).toBe(30)
 expect(()=>launchScouting(state,100)).toThrow()
 expect(()=>launchScouting(createScouting(1),49)).toThrow()
})
