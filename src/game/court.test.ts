import { expect, it } from 'vitest'
import { courtGeometry } from './court'
it('centre le demi-cercle sur la ligne médiane pour les cadres ordinateur et mobile',()=>{
 for(const [width,height] of [[848,720],[354,740],[284,740],[600,650]]) {
  const court=courtGeometry(width!,height!)
  expect(court.centerX).toBe(width!/2)
  expect(court.bottom).toBe(height!*25/26)
  expect(court.centerArc).toBe(`M${court.centerX-court.radius} ${court.bottom}A${court.radius} ${court.radius} 0 0 1 ${court.centerX+court.radius} ${court.bottom}`)
  expect(court.centerX-court.radius).toBeGreaterThan(court.left)
  expect(court.centerX+court.radius).toBeLessThan(court.right)
  expect(court.radius).toBeLessThan(court.bottom-court.freeThrowY)
 }
})
