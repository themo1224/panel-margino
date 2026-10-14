import { describe, it, expect } from 'vitest'
import {
  calculateVsStorePct,
  determineRivalInsight,
  calculateRecommendedPrice,
} from '../rival-analysis'

describe('Rival Analysis Business Logic (Product Owner Proof)', () => {
  describe('calculateVsStorePct', () => {
    it('returns null if rivalCheapest is null or zero', () => {
      expect(calculateVsStorePct(100000, null)).toBeNull()
      expect(calculateVsStorePct(100000, 0)).toBeNull()
    })

    it('returns positive percentage when store price is higher than rival', () => {
      // 110,000 vs 100,000 -> 10% higher
      expect(calculateVsStorePct(110000, 100000)).toBe(10)
    })

    it('returns negative percentage when store price is lower than rival', () => {
      // 90,000 vs 100,000 -> -10% lower
      expect(calculateVsStorePct(90000, 100000)).toBe(-10)
    })
  })

  describe('determineRivalInsight', () => {
    it('identifies below_cost when store price is lower than cost floor', () => {
      const insight = determineRivalInsight({
        storePrice: 90000,
        costFloor: 100000,
        rivalCheapest: 110000,
        rivalStatus: 'matched',
      })
      expect(insight).toBe('below_cost')
    })

    it('identifies stale data when rivalStatus is stale', () => {
      const insight = determineRivalInsight({
        storePrice: 105000,
        costFloor: 90000,
        rivalCheapest: 100000,
        rivalStatus: 'stale',
      })
      expect(insight).toBe('stale')
    })

    it('identifies above_rivals when store price exceeds rival cheapest by >2%', () => {
      const insight = determineRivalInsight({
        storePrice: 120000,
        costFloor: 80000,
        rivalCheapest: 100000,
        rivalStatus: 'matched',
      })
      expect(insight).toBe('above_rivals')
    })

    it('returns ok when store price is competitively aligned above cost floor', () => {
      const insight = determineRivalInsight({
        storePrice: 100000,
        costFloor: 80000,
        rivalCheapest: 100000,
        rivalStatus: 'matched',
      })
      expect(insight).toBe('ok')
    })
  })

  describe('calculateRecommendedPrice', () => {
    it('uses target margin percentage over cost floor when rival data is missing', () => {
      // cost floor 100,000 with 15% target margin -> 115,000
      expect(calculateRecommendedPrice(100000, null, 15)).toBe(115000)
    })

    it('undercuts rival cheapest price by 1000 Toman if above margin floor', () => {
      // cost floor 80,000 + 15% margin = 92,000 min. Rival cheapest = 100,000 -> recommend 99,000
      expect(calculateRecommendedPrice(80000, 100000, 15)).toBe(99000)
    })

    it('does not recommend below minimum margin cost floor', () => {
      // cost floor 100,000 + 15% margin = 115,000 min. Rival cheapest = 105,000 -> recommend 115,000 floor
      expect(calculateRecommendedPrice(100000, 105000, 15)).toBe(115000)
    })
  })
})
