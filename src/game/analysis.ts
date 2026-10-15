import { effectiveTeam } from './fitness'
import type { Attribute, PlayerStats, Team } from './model'

export const inactiveAttributes: Attribute[] = ['freeThrows', 'midRange', 'iq', 'vertical']
const axes = {
  outside: { label: 'Tir extérieur', attributes: ['threePoint'] },
  inside: { label: 'Finition intérieure', attributes: ['insideScoring', 'layup', 'postMoves', 'dunk'] },
  creation: { label: 'Création', attributes: ['passing', 'courtVision', 'dribbling'] },
  pace: { label: 'Jeu rapide', attributes: ['speed', 'acceleration', 'stamina'] },
  defense: { label: 'Défense', attributes: ['perimeterDefense', 'interiorDefense', 'blocks', 'steals'] },
  rebound: { label: 'Rebond / puissance', attributes: ['rebounding', 'strength'] },
} satisfies Record<string, { label: string; attributes: Attribute[] }>
export function teamProfile(team: Team) {
  if (team.players.length !== 3) throw Error('Trois joueurs sont nécessaires pour comparer une équipe.')
  const players = effectiveTeam(team).players
  return Object.entries(axes).map(([id, axis]) => ({
    id, label: axis.label,
    value: Math.round(players.reduce((sum, player) => sum + axis.attributes.reduce((total, key) => total + player.attributes[key], 0) / axis.attributes.length, 0) / players.length),
  }))
}
export function matchTotals(lines: PlayerStats[]) {
  const sum = (key: keyof Omit<PlayerStats, 'playerId'>) => lines.reduce((total, line) => total + line[key], 0)
  const made=sum('made'),attempted=sum('attempted'),outsideMade=sum('outsideMade'),outsideAttempted=sum('outsideAttempted')
  return {
    points:sum('points'),rebounds:sum('rebounds'),assists:sum('assists'),steals:sum('steals'),blocks:sum('blocks'),
    made,attempted,outsideMade,outsideAttempted,
    insideMade:made-outsideMade,insideAttempted:attempted-outsideAttempted,
    shooting:attempted ? Math.round(made/attempted*100) : null,
  }
}
