import type { Attribute, Player } from './model'
import { startTournament, type Tournament } from './tournament'

export const circuits = {
  neighborhood: { name: 'Coupe du quartier', threshold: 0, boost: 0, multiplier: 1 },
  city: { name: 'Open de la ville', threshold: 12, boost: 6, multiplier: 2 },
  regional: { name: 'Défi régional', threshold: 30, boost: 12, multiplier: 3 },
} as const
export type CircuitId = keyof typeof circuits
export interface CareerResult {
  edition: number; circuit: CircuitId; day: number; rank: number
  wins: number; reward: number; reputation: number
}
export interface Career { reputation: number; active: CircuitId | null; history: CareerResult[] }
export function createCareer(): Career { return { reputation: 0, active: null, history: [] } }
export function canEnter(career: Career, id: CircuitId): boolean {
  return career.active === null && career.reputation >= circuits[id].threshold
}
export function enterCircuit(career: Career, id: CircuitId, seed: number, roster: Player[], selected: string[], name: string) {
  if (!canEnter(career, id)) throw Error('Cette compétition n’est pas accessible.')
  const tournament = startTournament(seed, roster, selected, name)
  // Les spécialistes gardent leur profil ; seules les équipes adverses sont renforcées.
  for (const team of tournament.teams.slice(1)) {
    for (const player of team.players) {
      for (const key of Object.keys(player.attributes) as Attribute[]) {
        player.attributes[key] = Math.min(99, player.attributes[key] + circuits[id].boost)
      }
      player.overall = Math.round(Object.values(player.attributes).reduce((a, b) => a + b, 0) / Object.keys(player.attributes).length)
      player.potential = Math.max(player.potential, player.overall)
    }
  }
  return { career: { ...career, active: id }, tournament }
}
export function finishCircuit(career: Career, tournament: Tournament, edition: number, day: number) {
  if (!career.active || !tournament.finished || tournament.rank === null) throw Error('Aucune compétition terminée à enregistrer.')
  if (career.history.some(result => result.edition === edition)) throw Error('Cette compétition figure déjà au palmarès.')
  const circuit = career.active
  const gain = [6, 4, 2, 1][tournament.rank - 1]!
  const result: CareerResult = {
    edition, circuit, day, rank: tournament.rank,
    wins: tournament.standings.find(line => line.teamId === 'club')!.wins,
    reward: tournament.reward * circuits[circuit].multiplier, reputation: gain,
  }
  return {
    career: { reputation: career.reputation + gain, active: null, history: [...career.history, result] } satisfies Career,
    result,
  }
}
