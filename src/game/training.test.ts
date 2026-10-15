import { expect,it } from 'vitest'
import { createRoster } from './tournament'
import { startTraining,train } from './training'
import { nextEvent,advanceCalendar,createCalendar } from './calendar'
it('coûte 100 F et programme un retour à sept jours',()=>{
 const roster=createRoster(1983), id=roster[0]!.id
 const result=startTraining(roster,150,id,'shooting',10,null)
 expect(result.money).toBe(50);expect(result.training.day).toBe(17)
 const calendar={...createCalendar(),day:10,trainingDay:17}
 expect(nextEvent(calendar)?.day).toBe(17)
 expect(advanceCalendar(calendar).trainingDay).toBe(null)
 expect(()=>startTraining(roster,99,id,'shooting',0,null)).toThrow()
 expect(()=>startTraining(roster,200,id,'shooting',0,result.training)).toThrow()
})
it('améliore les notes sans mutation et respecte les plafonds',()=>{
 const p=createRoster(1983)[0]!, old=structuredClone(p)
 const next=train(p,'shooting')
 expect(p).toEqual(old)
 expect(next.player.attributes.threePoint).toBe(p.attributes.threePoint+1)
 expect(next.player.attributes.insideScoring).toBe(p.attributes.insideScoring+1)
 expect(next.player.fatigue).toBe(8)
 const capped=structuredClone(p)
 for(const key in capped.attributes)capped.attributes[key as keyof typeof capped.attributes]=50
 capped.potential=50
 expect(train(capped,'shooting').gains).toHaveLength(0)
 capped.potential=99;capped.attributes.threePoint=99
 expect(train(capped,'shooting').player.attributes.threePoint).toBe(99)
})
