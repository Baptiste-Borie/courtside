export function random(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6D2B79F5
    let t = Math.imul(state ^ state >>> 15, 1 | state)
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}
export function pickWeighted(rng: () => number, weights: number[]) {
  let cursor = rng() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < weights.length; i++) {
    cursor -= weights[i]!
    if (cursor <= 0) return i
  }
  return weights.length - 1
}
