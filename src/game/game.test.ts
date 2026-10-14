import { describe, expect, it } from 'vitest'
import { generateTeam } from './generate'
import { simulate } from './simulate'
import { defaultRules } from './model'
describe('génération', () => {
  it('est déterministe, bornée et spécialisée', () => {
    expect(generateTeam(42, 'a', 'A')).toEqual(generateTeam(42, 'a', 'A'))
    for (let seed = 0; seed < 100; seed++) for (const p of generateTeam(seed, 'a', 'A').players) {
      expect(Object.values(p.attributes).every(n => Number.isInteger(n) && n >= 0 && n <= 99)).toBe(true)
      expect(Math.max(...Object.values(p.attributes))).toBeGreaterThanOrEqual(73)
      expect(p.potential).toBeGreaterThanOrEqual(p.overall)
      expect(p.height).toBeGreaterThanOrEqual(170)
    }
  })
})
describe('match', () => {
  const a = generateTeam(1983, 'a', 'A'), b = generateTeam(1984, 'b', 'B')
  it('reproduit une seed', () => expect(simulate(a,b,'fast','inside',42)).toEqual(simulate(a,b,'fast','inside',42)))
  it('respecte les règles et les statistiques sur 500 matchs', () => {
    for (let seed=0; seed<500; seed++) {
      const r=simulate(a,b,'balanced','inside',seed)
      expect(Math.max(...r.scores)).toBeGreaterThanOrEqual(21)
      expect(Math.max(...r.scores)).toBeLessThanOrEqual(22)
      expect(Math.min(...r.scores)).toBeLessThan(21)
      r.stats.forEach((lines, side) => {
        expect(lines.reduce((sum,p)=>sum+p.points,0)).toBe(r.scores[side])
        for (const p of lines) { expect(p.points).toBe(p.made+p.outsideMade); expect(p.made).toBeLessThanOrEqual(p.attempted); expect(p.outsideMade).toBeLessThanOrEqual(p.outsideAttempted) }
      })
      expect(r.winner).toBe(r.scores[0]>r.scores[1]?'a':'b')
    }
  })
  it('les qualités disponibles rendent les tactiques utiles', () => {
    for (const profile of ['fast', 'inside'] as const) {
      const team = generateTeam(121, 'a', 'A'), opponent = generateTeam(122, 'b', 'B')
      for (const p of team.players) Object.assign(p.attributes, profile === 'fast'
        ? { speed:90, acceleration:90, stamina:85, passing:80, courtVision:80, layup:80 }
        : { insideScoring:90, postMoves:90, strength:90, layup:85, rebounding:85 })
      let adapted = 0, balanced = 0
      for (let seed = 0; seed < 1000; seed++) {
        adapted += Number(simulate(team,opponent,profile,'balanced',seed).winner === 'a')
        balanced += Number(simulate(team,opponent,'balanced','balanced',seed).winner === 'a')
      }
      expect(adapted - balanced).toBeGreaterThan(100)
    }
  })
  it('accepte des valeurs de paniers configurables', () => {
    const r=simulate(a,b,'balanced','balanced',7,{target:15,insideValue:2,outsideValue:3})
    expect(Math.max(...r.scores)).toBeLessThanOrEqual(17)
    for (const lines of r.stats) for (const p of lines) expect(p.points).toBe(2*p.made+p.outsideMade)
  })
  it('refuse des entrées invalides', () => {
    expect(()=>simulate(a,b,'balanced','balanced',1,{...defaultRules,target:0})).toThrow()
    expect(()=>simulate(a,a,'balanced','balanced',1)).toThrow()
  })
  it('favorise une équipe très supérieure sur la durée sans garantir chaque match', () => {
    const strong=structuredClone(a), weak=structuredClone(b)
    for (const p of strong.players) for (const key in p.attributes) p.attributes[key as keyof typeof p.attributes]=85
    for (const p of weak.players) for (const key in p.attributes) p.attributes[key as keyof typeof p.attributes]=30
    let wins=0
    for(let seed=0;seed<500;seed++) wins+=Number(simulate(strong,weak,'balanced','balanced',seed).winner==='a')
    expect(wins).toBeGreaterThan(400)
  })
})
