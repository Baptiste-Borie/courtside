import { expect, it } from 'vitest'
import { createFounding, foundingCandidates, openPack, packCandidates, revealAll, revealCard } from './founding'
import { decodeSave, type Save } from './save'
import { createCalendar } from './calendar'
import { createCareer } from './circuit'
import { createRoster } from './tournament'
import { createScouting } from './scouting'
function save():Save {
 const roster=createRoster(1983)
 return {version:1,founding:createFounding(),career:createCareer(),calendar:createCalendar(),name:'Club',roster,selected:roster.slice(0,3).map(player=>player.id),tactic:'balanced',training:null,tournament:null,money:0,titles:0,edition:0,scouting:createScouting(1983)}
}
it('répartit exactement les douze joueurs existants dans trois pochettes',()=>{
 const original=foundingCandidates()
 expect([0,1,2].flatMap(packCandidates)).toEqual(original)
 for(const index of [-1,3,0.5])expect(()=>packCandidates(index)).toThrow()
 let state=createFounding()
 for(const index of [2,0,1])state=openPack(state,index)
 expect(foundingCandidates()).toEqual(original)
 expect(state.revealed).toEqual([])
})
it('révèle seulement la carte choisie après ouverture, sans doublon ni mutation',()=>{
 const initial=createFounding(),id=packCandidates(0)[0]!.id
 expect(()=>revealCard(initial,id)).toThrow()
 const opened=openPack(initial,0),revealed=revealCard(opened,id)
 expect(initial).toEqual(createFounding())
 expect(opened.revealed).toEqual([])
 expect(revealed.revealed).toEqual([id])
 expect(revealCard(revealed,id)).toEqual(revealed)
 expect(openPack(revealed,0)).toEqual(revealed)
 expect(()=>revealCard(revealed,'missing')).toThrow()
 expect(()=>revealCard(revealed,packCandidates(1)[0]!.id)).toThrow()
})
it('tout dévoiler ouvre les trois pochettes et conserve la sélection sans retirer de francs',()=>{
 const game=save(),all=revealAll(game.founding)
 expect(all.opened).toEqual([0,1,2])
 expect(all.revealed).toEqual(foundingCandidates().map(player=>player.id))
 expect(revealAll(all)).toEqual(all)
 expect(decodeSave(JSON.stringify({...game,founding:all})).money).toBe(0)
 expect(()=>openPack({...all,completed:true},0)).toThrow()
})
it('reprend une ouverture partielle et migre les sélections du patch 011 sans cacher les joueurs',()=>{
 const game=save();game.founding=revealCard(openPack(game.founding,1),packCandidates(1)[2]!.id)
 expect(decodeSave(JSON.stringify(game))).toEqual(game)
 for(const founding of [{...game.founding,opened:[]},{...game.founding,opened:[1,1]},{...game.founding,revealed:['missing']},{...game.founding,revealed:[...game.founding.revealed,...game.founding.revealed]}])expect(()=>decodeSave(JSON.stringify({...game,founding}))).toThrow()
 const old={...game,founding:{completed:false,selected:['player-0','player-8']}}
 const migrated=decodeSave(JSON.stringify(old))
 expect(migrated.founding.selected).toEqual(old.founding.selected)
 expect(migrated.founding.opened).toEqual([0,1,2])
 expect(migrated.founding.revealed).toHaveLength(12)
})

it('conserve les étapes de création et refuse une étape de sélection prématurée',()=>{
 const game=save()
 for(const phase of ['intro','identity','packs','selection'] as const) {
  game.founding=phase==='selection'?{...revealAll(createFounding()),phase}:{...createFounding(),phase}
  expect(decodeSave(JSON.stringify(game)).founding.phase).toBe(phase)
 }
 expect(()=>decodeSave(JSON.stringify({...game,founding:{...createFounding(),phase:'selection'}}))).toThrow()
 expect(()=>decodeSave(JSON.stringify({...game,founding:{...createFounding(),phase:'unknown'}}))).toThrow()
})
