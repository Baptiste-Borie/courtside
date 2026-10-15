import { expect, it } from 'vitest'
import { appearanceFor } from './appearance'
import { generateTeam } from './generate'
it('garde le portrait lors des transferts, changements de poste et progressions',()=>{
 const player=generateTeam(1983,'a','A').players[0]!
 const original=appearanceFor(player)
 expect(appearanceFor({...player,id:'recruited',teamId:'club',position:'C',overall:90,fatigue:70} as typeof player)).toEqual(original)
 expect(appearanceFor(JSON.parse(JSON.stringify(player)))).toEqual(original)
})
it('donne une identité visuelle variée aux joueurs générés',()=>{
 const players=Array.from({length:100},(_,seed)=>generateTeam(seed,'a','A').players).flat()
 const looks=players.map(player=>JSON.stringify(appearanceFor(player)))
 expect(new Set(looks).size).toBeGreaterThan(200)
})
