import { expect, it } from 'vitest'
import { attributeGroups, rating, ratingBands } from './ratings'
import { attributeLabels } from './model'
it('attribue un seul niveau à chaque note de 0 à 99, y compris aux seuils',()=>{
 for(let note=0;note<=99;note++) {
  const band=rating(note)
  expect(note).toBeGreaterThanOrEqual(band.min)
  expect(note).toBeLessThanOrEqual(band.max)
  expect(ratingBands.filter(value=>note>=value.min&&note<=value.max)).toHaveLength(1)
 }
})
it('présente les 21 caractéristiques une seule fois dans les groupes',()=>{
 const keys=attributeGroups.flatMap(group=>group.attributes)
 expect([...keys].sort()).toEqual(Object.keys(attributeLabels).sort())
 expect(new Set(keys).size).toBe(21)
})
