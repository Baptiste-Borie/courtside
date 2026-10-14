export interface Calendar { day: number; matchDay: number | null; scoutingDay: number | null }
export function createCalendar(): Calendar { return {day:0,matchDay:null,scoutingDay:null} }
export function dateLabel(day:number): string {
 const date=new Date(Date.UTC(1983,3,1+day))
 return date.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})
}
export function yearAt(day:number): number {return new Date(Date.UTC(1983,3,1+day)).getUTCFullYear()}
export function nextEvent(calendar:Calendar): {day:number;label:string} | null {
 if(calendar.matchDay!==null && calendar.matchDay<=calendar.day) return null
 const days=[calendar.matchDay,calendar.scoutingDay].filter((day):day is number=>day!==null)
 if(!days.length)return null
 const day=Math.min(...days)
 return {day,label:calendar.scoutingDay===day?'Retour du scouting':'Prochain match'}
}
export function advanceCalendar(calendar:Calendar): Calendar {
 const event=nextEvent(calendar)
 if(!event)throw Error('Aucun événement à avancer, ou un match attend votre décision.')
 return {...calendar,day:event.day,scoutingDay:calendar.scoutingDay!==null&&calendar.scoutingDay<=event.day?null:calendar.scoutingDay}
}
export function scheduleTournament(calendar:Calendar): Calendar {
 if(calendar.matchDay!==null)throw Error('Un tournoi est déjà programmé.')
 return {...calendar,matchDay:calendar.day+14}
}
export function scheduleScouting(calendar:Calendar): Calendar {
 if(calendar.scoutingDay!==null)throw Error('Une campagne est déjà en cours.')
 return {...calendar,scoutingDay:calendar.day+7}
}
export function afterMatch(calendar:Calendar, finished:boolean):Calendar {
 if(calendar.matchDay===null||calendar.matchDay>calendar.day)throw Error('Le prochain match n’a pas encore lieu.')
 return {...calendar,matchDay:finished?null:calendar.day+1}
}
