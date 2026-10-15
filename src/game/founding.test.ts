import { expect, it } from 'vitest'
import { createFounding, foundClub, foundingCandidates } from './founding'
import { createCalendar } from './calendar'
import { createCareer } from './circuit'
import { createRoster } from './tournament'
import { createScouting } from './scouting'
import { decodeSave, type Save } from './save'
function initial():Save {
 const roster=createRoster(1983)
 return {version:1,founding:createFounding(),career:createCareer(),calendar:createCalendar(),name:'Les Aurores',roster,selected:roster.slice(0,3).map(player=>player.id),tactic:'balanced',training:null,tournament:null,money:0,titles:0,edition:0,scouting:createScouting(1983)}
}
it('propose douze joueurs stables et construit exactement l’effectif choisi',()=>{
 const candidates=foundingCandidates(),ids=candidates.slice(6).map(player=>player.id)
 expect(candidates).toEqual(foundingCandidates())
 expect(new Set(candidates.map(player=>player.id)).size).toBe(12)
 const club=foundClub('  Le Six  ',ids)
 expect(club.name).toBe('Le Six')
 expect(club.roster.map(player=>player.id)).toEqual(ids)
 expect(club.selected).toEqual(ids.slice(0,3))
 club.roster[0]!.attributes.threePoint=0
 expect(foundingCandidates()).toEqual(candidates)
})
it('refuse un effectif incomplet, des doublons, des inconnus et un nom vide',()=>{
 const ids=foundingCandidates().slice(0,6).map(player=>player.id)
 for(const selection of [[],ids.slice(0,5),[...ids, 'player-6'],[ids[0]!,...ids.slice(0,5)],['absent',...ids.slice(1)]]) expect(()=>foundClub('Club',selection)).toThrow()
 expect(()=>foundClub('   ',ids)).toThrow()
})
it('reprend une sélection incomplète et une équipe composée avec les derniers candidats',()=>{
 const save=initial();save.founding={...save.founding,opened:[0,1,2],revealed:foundingCandidates().map(player=>player.id),selected:['player-7','player-11']};save.name='Les Docks'
 expect(decodeSave(JSON.stringify(save))).toEqual(save)
 const club=foundClub(save.name,foundingCandidates().slice(6).map(player=>player.id))
 const ready={...save,...club}
 expect(decodeSave(JSON.stringify(ready))).toEqual(ready)
 for(const founding of [{completed:false,selected:['missing']},{completed:true,selected:['player-0']},{completed:false,selected:['player-0','player-0']}])expect(()=>decodeSave(JSON.stringify({...save,founding}))).toThrow()
})
it('préserve une ancienne partie sans imposer la sélection initiale',()=>{
 const save=initial(),old=JSON.parse(JSON.stringify(save));delete old.founding
 const loaded=decodeSave(JSON.stringify(old))
 expect(loaded.founding).toEqual({completed:true,selected:[],opened:[],revealed:[]})
 expect(loaded.roster).toEqual(save.roster)
 expect(loaded.money).toBe(save.money)
 expect(loaded.selected).toEqual(save.selected)
})
