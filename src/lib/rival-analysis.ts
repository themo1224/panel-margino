import type { RivalStatus } from '@/types/apps/pricing'

/**
 * Calculates percentage difference between store price and cheapest rival.
 * Positive value = store price is higher than cheapest rival by X%.
 */
export function calculateVsStorePct(
  storePrice: number,
  rivalCheapest: number | null
): number | null {
  if (rivalCheapest == null || rivalCheapest <= 0) return null
  const pct = ((storePrice - rivalCheapest) / rivalCheapest) * 100
  return Number(pct.toFixed(1))
}

/**
 * Determines business positioning category based on store price, cost floor, and rival cheapest.
 */
export function determineRivalInsight(row: {
  storePrice: number
  costFloor: number
  rivalCheapest: number | null
  rivalStatus: RivalStatus
}): 'above_rivals' | 'below_cost' | 'stale' | 'ok' {
  if (row.storePrice < row.costFloor) {
    return 'below_cost'
  }
  if (row.rivalStatus === 'stale') {
    return 'stale'
  }
  if (row.rivalCheapest != null && row.storePrice > row.rivalCheapest * 1.02) {
    return 'above_rivals'
  }
  return 'ok'
}

/**
 * Calculates safe recommended price considering minimum cost floor and cheapest rival price.
 */
export function calculateRecommendedPrice(
  costFloor: number,
  rivalCheapest: number | null,
  targetMarginPct: number = 15
): number {
  const minPriceWithMargin = Math.round(costFloor * (1 + targetMarginPct / 100))

  if (rivalCheapest == null || rivalCheapest <= 0) {
    return minPriceWithMargin
  }

  // Recommended price aims to undercut/match rival by 1,000 Toman if above cost floor
  const targetPrice = Math.max(rivalCheapest - 1000, minPriceWithMargin)
  return targetPrice
}
