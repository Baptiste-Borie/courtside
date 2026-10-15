import { createCareer } from './circuit'
import { createCalendar } from './calendar'
import { expect, it } from 'vitest'
import { decodeSave, type Save } from './save'
import { createRoster, playRound, startTournament } from './tournament'
import { createScouting, launchScouting, revealNext, recruit } from './scouting'
function game(): Save {
 const roster=createRoster(1983)
 return {version:1,career:createCareer(),training:null,calendar:createCalendar(),name:'Les Aurores',roster,selected:roster.slice(0,3).map(p=>p.id),tactic:'balanced',tournament:null,money:0,titles:0,edition:0,scouting:createScouting(1983)}
}
it('reprend une partie avec tournoi en cours et recrutement',()=>{
 const s=game();s.edition=1;s.tournament=playRound(startTournament(1983,s.roster,s.selected,s.name),s.roster,s.selected,'inside')
 s.calendar.matchDay=0;s.career.active='neighborhood'
 s.scouting=revealNext(launchScouting(s.scouting,1000).state)
 const hired=recruit(s.scouting,s.roster,950,s.scouting.known[0]!)
 s.roster=hired.roster;s.money=hired.money
 expect(decodeSave(JSON.stringify(s))).toEqual(s)
})
it('reprend un tournoi terminé sans rejouer sa récompense',()=>{
 const s=game();s.edition=1;s.tournament=startTournament(1983,s.roster,s.selected,s.name)
 for(let i=0;i<3;i++)s.tournament=playRound(s.tournament,s.roster,s.selected,'balanced')
 s.money=s.tournament.reward;s.titles=Number(s.tournament.rank===1)
 expect(decodeSave(JSON.stringify(s))).toEqual(s)
 expect(()=>playRound(decodeSave(JSON.stringify(s)).tournament!,s.roster,s.selected,'balanced')).toThrow()
})
it('rejette les fichiers invalides et les versions inconnues',()=>{
 expect(()=>decodeSave('{')).toThrow()
 for(const changes of [{version:2},{money:-1},{selected:['missing']},{roster:[]},{tactic:'unknown'},{scouting:{}}]) expect(()=>decodeSave(JSON.stringify({...game(),...changes}))).toThrow()
 const s=game();s.roster[0]!.attributes.speed=100
 expect(()=>decodeSave(JSON.stringify(s))).toThrow()
})
it('migre la sauvegarde 005 et conserve les événements en attente',()=>{
 const s=game()
 const old={...s} as Partial<Save>;delete old.calendar
 expect(decodeSave(JSON.stringify(old)).calendar).toEqual(createCalendar())
 s.scouting=launchScouting(s.scouting,100).state;s.calendar.scoutingDay=7
 expect(decodeSave(JSON.stringify(s)).calendar.scoutingDay).toBe(7)
})
it('conserve un camp en attente et migre les sauvegardes précédentes',()=>{
 const s=game();s.training={playerId:s.roster[0]!.id,focus:'shooting',day:7};s.calendar.trainingDay=7
 expect(decodeSave(JSON.stringify(s)).training).toEqual(s.training)
 const old={...game()} as Partial<Save>;delete old.training
 const json=JSON.parse(JSON.stringify(old));delete json.calendar.trainingDay
 expect(decodeSave(JSON.stringify(json)).training).toBe(null)
})
