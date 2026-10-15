import { expect,it } from 'vitest'
import { createCalendar, scheduleTournament, advanceCalendar, afterMatch } from './calendar'
import { createRoster, startTournament, playRound } from './tournament'
import { matchAgenda } from './match-agenda'
it('affiche les dates réelles et garde les résultats attachés à leur journée',()=>{
 const roster=createRoster(1983),selected=roster.slice(0,3).map(player=>player.id)
 let tournament=startTournament(1983,roster,selected,'Club'),calendar=scheduleTournament(createCalendar())
 expect(matchAgenda(tournament,calendar).map(game=>[game.day,game.status])).toEqual([[14,'next'],[15,'later'],[16,'later']])
 for(let round=0;round<3;round++) {
  calendar=advanceCalendar(calendar);tournament=playRound(tournament,roster,selected,'inside');calendar=afterMatch(calendar,tournament.finished)
  const agenda=matchAgenda(tournament,calendar,16)
  expect(agenda.map(game=>game.day)).toEqual([14,15,16])
  expect(agenda[round]!.score).not.toBeNull()
  expect(agenda[round]!.opponent.id).toBe(tournament.teams[round+1]!.id)
 }
 expect(matchAgenda(tournament,{...calendar,day:200},16).map(game=>game.day)).toEqual([14,15,16])
 expect(matchAgenda(tournament,{...calendar,day:200}).every(game=>game.day===null)).toBe(true)
})
