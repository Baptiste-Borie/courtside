import { expect,it } from 'vitest'
import { afterPlaying, effectiveTeam, recover } from './fitness'
import { generateTeam } from './generate'
import { simulate } from './simulate'
it('fatigue uniquement les joueurs présents et plafonne à 100',()=>{
 const t=generateTeam(1,'a','A'), id=t.players[0]!.id
 const after=afterPlaying(t.players,[id])
 expect(after[0]!.fatigue).toBeGreaterThan(0);expect(after[1]!.fatigue).toBe(0)
 expect(t.players[0]!.fatigue).toBe(0)
 after[0]!.fatigue=99
 expect(afterPlaying(after,[id])[0]!.fatigue).toBe(100)
 expect(recover(after,1)[0]!.fatigue).toBe(93)
 expect(recover(after,20)[0]!.fatigue).toBe(0)
 expect(()=>recover(after,-1)).toThrow()
})
it('réduit les performances sans détruire les notes permanentes',()=>{
 const t=generateTeam(2,'a','A');t.players[0]!.fatigue=100
 const effective=effectiveTeam(t)
 expect(effective.players[0]!.attributes.speed).toBeLessThan(t.players[0]!.attributes.speed)
 expect(effective.players[0]!.attributes.passing).toBe(t.players[0]!.attributes.passing)
 expect(effectiveTeam({...t,players:recover(t.players,30)}).players[0]!.attributes).toEqual(t.players[0]!.attributes)
})
it('la fatigue pénalise le résultat moyen sur des matchs reproductibles',()=>{
 const a=generateTeam(12,'a','A'),b=generateTeam(13,'b','B')
 const tired={...a,players:a.players.map(p=>({...p,fatigue:100}))}
 let freshWins=0,tiredWins=0
 for(let seed=0;seed<1500;seed++) {
  freshWins+=Number(simulate(a,b,'balanced','balanced',seed).winner==='a')
  tiredWins+=Number(simulate(tired,b,'balanced','balanced',seed).winner==='a')
 }
 expect(freshWins-tiredWins).toBeGreaterThan(100)
})
