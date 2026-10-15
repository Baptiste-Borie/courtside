// Compatibilité : candidats déjà dévoilés avant le patch 015 uniquement.
import { attributeLabels, type Attributes, type Attribute, type Position, type Team } from './model'
import { random } from './random'
const firstNames = ['Alain', 'Karim', 'Luc', 'Patrick', 'Éric', 'Marc', 'Jean', 'Malik', 'Pascal', 'David', 'Thierry', 'Nicolas']
const lastNames = ['Martin', 'Diallo', 'Bernard', 'Moreau', 'Petit', 'Leroy', 'Laurent', 'Roux', 'Benali', 'Simon', 'Dubois', 'Durand']
const specialties: Attribute[][] = [
  ['threePoint', 'midRange', 'freeThrows'], ['passing', 'courtVision', 'dribbling'],
  ['insideScoring', 'postMoves', 'strength', 'rebounding'], ['blocks', 'interiorDefense', 'rebounding'],
  ['speed', 'acceleration', 'vertical', 'dunk', 'layup'], ['perimeterDefense', 'steals', 'iq'],
]
export function generateLegacyTeam(seed: number, id: string, name: string): Team {
  const rng = random(seed)
  const integer = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
  return { id, name, players: Array.from({ length: 3 }, (_, i) => {
    const position: Position = (['G', 'W', 'C'] as const)[i]!
    const height = integer(...(position === 'G' ? [170, 190] : position === 'W' ? [180, 200] : [190, 212]) as [number, number])
    const base = integer(30, 52)
    const attributes = Object.fromEntries(Object.keys(attributeLabels).map(key => [key, integer(base - 15, base + 15)])) as Attributes
    for (const key of specialties[integer(0, specialties.length - 1)]!) attributes[key] = integer(73, 96)
    if (position === 'C') { attributes.strength += 12; attributes.rebounding += 10; attributes.speed -= 10 }
    if (position === 'G') { attributes.dribbling += 12; attributes.speed += 10 }
    for (const key of Object.keys(attributes) as Attribute[]) attributes[key] = Math.max(0, Math.min(99, attributes[key]))
    const overall = Math.round(Object.values(attributes).reduce((a, b) => a + b, 0) / Object.keys(attributes).length)
    return { id: `${id}-${i}`, firstName: firstNames[integer(0, firstNames.length - 1)]!, lastName: lastNames[integer(0, lastNames.length - 1)]!, birthYear: 1983 - integer(18, 34), height, weight: Math.round(height - 112 + attributes.strength * .25), position, secondaryPositions: [], teamId: id, attributes, overall, potential: integer(overall, 99), fatigue: 0, healthy: true }
  }) }
}
