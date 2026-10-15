import type { Calendar } from './calendar'
import type { Tournament } from './tournament'

export function matchAgenda(tournament:Tournament,calendar:Calendar,completedDay?:number) {
 // La date d'une compétition terminée vient du palmarès, jamais d'aujourd'hui.
 const firstDay=tournament.finished?(completedDay===undefined?null:completedDay-2):calendar.matchDay===null?null:calendar.matchDay-tournament.round
 return tournament.teams.slice(1).map((opponent,index)=>{
  const round=index+1,match=tournament.matches.find(game=>game.round===round&&(game.home==='club'||game.away==='club'))
  const ours=match?(match.home==='club'?0:1):0,theirs=ours===0?1:0
  return {round,opponent,day:firstDay===null?null:firstDay+index,match,
   score:match?`${match.result.scores[ours]}–${match.result.scores[theirs]}`:null,
   status:match?(match.result.winner==='club'?'win':'loss'):index===tournament.round?'next':'later'}
 })
}
