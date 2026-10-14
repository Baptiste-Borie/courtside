import { expect, it } from 'vitest'
import { advanceCalendar, afterMatch, createCalendar, dateLabel, nextEvent, scheduleScouting, scheduleTournament } from './calendar'
it('avance au scouting avant le match et traite les événements simultanés',()=>{
 let c=scheduleScouting(scheduleTournament(createCalendar()))
 expect(nextEvent(c)?.day).toBe(7)
 c=advanceCalendar(c);expect(c.day).toBe(7);expect(c.scoutingDay).toBe(null);expect(c.matchDay).toBe(14)
 c=advanceCalendar(c);expect(c.day).toBe(14);expect(nextEvent(c)).toBe(null)
 expect(()=>advanceCalendar(c)).toThrow()
 const simultaneous=advanceCalendar({day:0,matchDay:7,scoutingDay:7})
 expect(simultaneous).toEqual({day:7,matchDay:7,scoutingDay:null})
})
it('interdit de jouer avant la date et programme les matchs suivants',()=>{
 const c=scheduleTournament(createCalendar())
 expect(()=>afterMatch(c,false)).toThrow()
 const ready=advanceCalendar(c)
 expect(afterMatch(ready,false).matchDay).toBe(15)
 expect(afterMatch(ready,true).matchDay).toBe(null)
 expect(()=>scheduleTournament(c)).toThrow()
 expect(dateLabel(0)).toBe('1 avril 1983')
})
