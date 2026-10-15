import { expect, it } from 'vitest'
import { canEnter, circuits, createCareer, enterCircuit, finishCircuit, type CircuitId } from './circuit'
import { createRoster, playRound } from './tournament'
import { decodeSave, type Save } from './save'
import { createScouting } from './scouting'
import { createCalendar } from './calendar'
const roster = createRoster(1983), selected = roster.slice(0,3).map(player=>player.id)
function complete(career=createCareer(), id: CircuitId='neighborhood', edition=1) {
 const entered=enterCircuit(career,id,1983+edition,roster,selected,'Les Aurores')
 let tournament=entered.tournament
 for(let i=0;i<3;i++)tournament=playRound(tournament,roster,selected,'balanced')
 return {tournament,...finishCircuit(entered.career,tournament,edition,edition*20)}
}
it('verrouille les circuits jusqu’au seuil et interdit deux inscriptions',()=>{
 expect(()=>enterCircuit(createCareer(),'city',1,roster,selected,'Club')).toThrow()
 expect(canEnter({...createCareer(),reputation:11},'city')).toBe(false)
 expect(canEnter({...createCareer(),reputation:12},'city')).toBe(true)
 expect(canEnter({...createCareer(),reputation:30},'regional')).toBe(true)
 const entered=enterCircuit(createCareer(),'neighborhood',1,roster,selected,'Club')
 expect(()=>enterCircuit(entered.career,'neighborhood',2,roster,selected,'Club')).toThrow()
 expect(()=>finishCircuit(entered.career,entered.tournament,1,20)).toThrow()
})
it('renforce les adversaires sans modifier le club ou les données d’origine',()=>{
 const before=structuredClone(roster)
 const local=enterCircuit(createCareer(),'neighborhood',42,roster,selected,'Club').tournament
 const regional=enterCircuit({...createCareer(),reputation:30},'regional',42,roster,selected,'Club').tournament
 expect(regional.teams[0]).toEqual(local.teams[0])
 expect(roster).toEqual(before)
 for(let i=1;i<4;i++)for(let j=0;j<3;j++) {
  const first=local.teams[i]!.players[j]!,second=regional.teams[i]!.players[j]!
  for(const key of Object.keys(first.attributes) as (keyof typeof first.attributes)[])expect(second.attributes[key]).toBe(Math.min(99,first.attributes[key]+12))
 }
})
it('enregistre une récompense unique et multiplie les gains du circuit supérieur',()=>{
 const ended=complete({...createCareer(),reputation:12},'city')
 expect(ended.result.reward).toBe(ended.tournament.reward*circuits.city.multiplier)
 expect(ended.career.reputation).toBe(12+ended.result.reputation)
 expect(ended.career.active).toBe(null)
 expect(()=>finishCircuit(ended.career,ended.tournament,1,20)).toThrow()
 expect(()=>finishCircuit({...ended.career,active:'city'},ended.tournament,1,20)).toThrow()
})
it('débloque les compétitions par les résultats et reprend le palmarès sauvegardé',()=>{
 let career=createCareer(),edition=0
 while(career.reputation<12)career=complete(career,'neighborhood',++edition).career
 const ended=complete(career,'city',++edition);career=ended.career
 const save:Save={version:1,founding:{completed:true,selected:[]},career,training:null,calendar:{...createCalendar(),day:edition*20},name:'Club',roster,selected,tactic:'balanced',tournament:ended.tournament,money:1000,titles:0,edition,scouting:createScouting(1983)}
 expect(decodeSave(JSON.stringify(save))).toEqual(save)
 for(const changes of [{reputation:999},{active:'unknown'},{history:[{...career.history[0],reward:999}]}]) expect(()=>decodeSave(JSON.stringify({...save,career:{...career,...changes}}))).toThrow()
 const old=JSON.parse(JSON.stringify(save));delete old.career
 expect(decodeSave(JSON.stringify(old)).career).toEqual(createCareer())
 old.tournament=enterCircuit(createCareer(),'neighborhood',7,roster,selected,'Club').tournament;old.calendar.matchDay=old.calendar.day
 expect(decodeSave(JSON.stringify(old)).career.active).toBe('neighborhood')
})
