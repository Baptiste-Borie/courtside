export const attributeLabels = {
  insideScoring: 'Tir intérieur', midRange: 'Mi-distance', threePoint: 'Tir extérieur',
  freeThrows: 'Lancers francs', dunk: 'Dunk', layup: 'Lay-up', postMoves: 'Jeu au poste',
  dribbling: 'Dribble', passing: 'Passe', courtVision: 'Vision',
  perimeterDefense: 'Défense extérieure', interiorDefense: 'Défense intérieure',
  blocks: 'Contre', steals: 'Interception', speed: 'Vitesse', acceleration: 'Accélération',
  strength: 'Force', vertical: 'Détente', stamina: 'Endurance', rebounding: 'Rebond', iq: 'Placement / QI basket',
} as const
export type Attribute = keyof typeof attributeLabels
export type Attributes = Record<Attribute, number>
export type Position = 'G' | 'W' | 'C'
export interface Player {
  id: string; firstName: string; lastName: string; birthYear: number; height: number; weight: number
  position: Position; secondaryPositions: Position[]; teamId: string
  attributes: Attributes; overall: number; potential: number; fatigue: number; healthy: boolean
}
export interface Team { id: string; name: string; players: Player[] }
export const tactics = { balanced: 'Équilibrée', fast: 'Jeu rapide', inside: 'Jeu intérieur' } as const
export type Tactic = keyof typeof tactics
export interface Rules { target: number; insideValue: number; outsideValue: number }
export const defaultRules: Rules = { target: 21, insideValue: 1, outsideValue: 2 }
export interface PlayerStats { playerId: string; points: number; rebounds: number; assists: number; steals: number; blocks: number; made: number; attempted: number; outsideMade: number; outsideAttempted: number }
export interface MatchResult { seed: number; scores: [number, number]; winner: string; stats: [PlayerStats[], PlayerStats[]]; possessions: number }
