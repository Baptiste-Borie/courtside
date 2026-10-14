import { defaultRules, type MatchResult, type Player, type PlayerStats, type Rules, type Tactic, type Team } from './model'
import { pickWeighted, random } from './random'
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
export function simulate(a: Team, b: Team, tacticA: Tactic, tacticB: Tactic, seed: number, rules: Rules = defaultRules): MatchResult {
  if (![rules.target, rules.insideValue, rules.outsideValue].every(n => Number.isInteger(n) && n > 0) || rules.target > 1000) throw new Error('Règles invalides')
  const teams = [a, b]
  if (a.id === b.id || teams.some(t => t.players.length !== 3) || new Set(teams.flatMap(t => t.players.map(p => p.id))).size !== 6) throw new Error('Deux équipes distinctes de trois joueurs sont nécessaires')
  const rng = random(seed)
  const tactics = [tacticA, tacticB]
  const scores: [number, number] = [0, 0]
  const blank = (p: Player): PlayerStats => ({ playerId: p.id, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, made: 0, attempted: 0, outsideMade: 0, outsideAttempted: 0 })
  const stats: [PlayerStats[], PlayerStats[]] = [a.players.map(blank), b.players.map(blank)]
  let side = rng() < .5 ? 0 : 1
  let possessions = 0
  // Micro-échantillonnage statistique sans positions, chrono ni contrôle en direct.
  while (Math.max(...scores) < rules.target) {
    if (++possessions > rules.target * 1000) throw new Error('Simulation non convergente')
    const other = 1 - side
    const offense = teams[side]!.players, defense = teams[other]!.players
    const tactic = tactics[side]!
    const creation = mean(offense.map(p => (p.attributes.passing + p.attributes.courtVision) / 2))
    const pace = mean(offense.map(p => (p.attributes.speed + p.attributes.acceleration + p.attributes.stamina) / 3))
    const pressure = mean(defense.map(p => (p.attributes.steals + p.attributes.perimeterDefense) / 2))
    if (rng() < Math.max(.04, Math.min(.24, .12 + (pressure - creation) / 600))) {
      if (rng() < .65) stats[other]![pickWeighted(rng, defense.map(p => 1 + p.attributes.steals))]!.steals++
      side = other; continue
    }
    const shooterIndex = pickWeighted(rng, offense.map(p => {
      const x = p.attributes
      return 10 + (tactic === 'inside' ? x.insideScoring + x.postMoves + x.strength : tactic === 'fast' ? x.layup + x.speed + x.dribbling : x.insideScoring + x.threePoint + x.layup)
    }))
    const shooter = offense[shooterIndex]!, x = shooter.attributes
    const line = stats[side]![shooterIndex]!
    const outside = rng() < (tactic === 'inside' ? .12 : tactic === 'fast' ? .28 : .35)
    const defender = defense[pickWeighted(rng, defense.map(p => 1 + (outside ? p.attributes.perimeterDefense : p.attributes.interiorDefense)))]!
    const d = defender.attributes
    const attack = outside ? x.threePoint : (x.insideScoring + x.layup + (tactic === 'inside' ? x.postMoves : x.dunk)) / 3
    const resistance = outside ? d.perimeterDefense : (d.interiorDefense + d.blocks) / 2
    const physical = outside ? 0 : (shooter.height - defender.height) / 500 + (x.strength - d.strength) / 1200
    const tactical = tactic === 'fast' ? (pace - mean(defense.map(p => p.attributes.speed))) / 500 + (pace - 50) / 500 : tactic === 'inside' && !outside ? (x.postMoves + x.strength - 100) / 800 : 0
    const probability = Math.max(.12, Math.min(.85, (outside ? .34 : .52) + (attack - resistance) / 220 + (creation - 50) / 900 + physical + tactical))
    line.attempted++; if (outside) line.outsideAttempted++
    if (rng() < probability) {
      const points = outside ? rules.outsideValue : rules.insideValue
      line.points += points; line.made++; if (outside) line.outsideMade++
      scores[side as 0 | 1] += points
      if (rng() < .25 + creation / 200) {
        const candidates = offense.map((p, i) => i === shooterIndex ? 0 : 1 + p.attributes.passing + p.attributes.courtVision)
        stats[side]![pickWeighted(rng, candidates)]!.assists++
      }
      side = other
    } else {
      if (!outside && rng() < d.blocks / 450) stats[other]![defense.indexOf(defender)]!.blocks++
      const rebounders = [...offense, ...defense]
      const rebound = pickWeighted(rng, rebounders.map((p, i) => (i < 3 ? .55 : 1) * (10 + p.attributes.rebounding + p.attributes.strength * .2 + (p.height - 170))))
      const reboundSide = rebound < 3 ? side : other
      stats[reboundSide]![rebound % 3]!.rebounds++
      side = reboundSide
    }
  }
  return { seed, scores, winner: teams[scores[0] > scores[1] ? 0 : 1]!.id, stats, possessions }
}
