/** Shared Pricing panel types (Phase 1 mocks). */

export type RivalSource = 'torob' | 'snapp'

export type RivalStatus =
  | 'matched'
  | 'stale'
  | 'finding'
  | 'cannot_match'
  | 'needs_confirm'

export interface PendingRivalMatch {
  id: string
  source: RivalSource
  listingTitle: string | null
  confidence: number
}

export interface ProductRivalRow {
  id: string
  name: string
  sku: string
  storePrice: number
  costFloor: number
  recommendedPrice: number
  rivalSource: RivalSource | null
  rivalCheapest: number | null
  rivalMedian: number | null
  rivalCount: number
  /** Positive = store price above cheapest rival (%) */
  vsStorePct: number | null
  rivalStatus: RivalStatus
  lastRivalAt: string | null
  pendingRivalMatch?: PendingRivalMatch | null
  autoApplyExcluded?: boolean
  autoApplyEligible?: boolean
  lastAutoAppliedAt?: string | null
}

export interface AutoApplySettings {
  enabled: boolean
  maxDropPercent: number
  onlyFreshRivals: boolean
  notifyDaily: boolean
  lastRunAt: string | null
  planAllowed: boolean
  planCode: string
  eligibleProductsCount: number
  excludedProductsCount: number
  totalProductsCount: number
}

export interface CompetitorItem {
  id: string
  shopName: string
  price: number
  url?: string
  isCheapest?: boolean
  isDigikala?: boolean
  city?: string
  lastSeenAt: string
}

export interface PriceHistoryItem {
  id: string
  date: string
  oldPrice: number
  newPrice: number
  source: 'recommendation' | 'manual' | 'auto'
}

export interface ProductRivalDetail extends ProductRivalRow {
  competitors: CompetitorItem[]
  priceHistory: PriceHistoryItem[]
  costBreakdown: {
    baseCost: number
    overheadPct: number
    dollarMultiplier: number
    targetMarginPct: number
    calculatedFloor: number
  }
  torobUrl?: string
  matchConfidence?: number
  matchedTitle?: string
}

export interface OverviewInsight {
  id: string
  productName: string
  message: string
  kind: 'above_rivals' | 'below_cost' | 'stale' | 'ok'
}

export interface OverviewData {
  shopName: string
  costProfileComplete: boolean
  costProfileLabel: string
  recommendCount: number
  productsTotal: number
  productsWithRivals: number
  aboveRivalsCount: number
  staleCount: number
  rivalHeadline: string
  insights: OverviewInsight[]
  /** Present when talking to the real seller API */
  hasActiveApiKey?: boolean
  findingCount?: number
}

export interface CostProfile {
  supplierPct: number
  dollarPct: number
  rentMonthly: number
  staffMonthly: number
  otherMonthly: number
  targetMarginPct: number
  updatedAt: string | null
}

export interface ReportSummary {
  monthLabel: string
  recommendationsIssued: number
  rivalChecks: number
  priceActions: number
  avgVsRivalPct: number
  chart: { label: string; recommends: number; rivalHits: number }[]
}

export interface ApiKeyItem {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  revoked: boolean
}

export interface AlertPrefs {
  belowCost: boolean
  aboveRivals: boolean
  staleCost: boolean
  email: boolean
  sms: boolean
}

export type PlanTier = 'starter' | 'pro' | 'business'
export type BillingCycle = 'monthly' | 'yearly'

export interface PlanUsage {
  tier: PlanTier
  tierLabel: string
  productsUsed: number
  productsLimit: number
  rivalRefreshInterval: 'daily' | 'hourly' | 'priority'
  rivalRefreshLabel: string
  autoApplyAllowed: boolean
  smsAlertsAllowed: boolean
  renewalDate: string
  daysRemaining: number
  billingCycle: BillingCycle
}

export interface PlanTierConfig {
  id: PlanTier
  name: string
  nameEn: string
  badge?: string
  isPopular?: boolean
  monthlyPrice: number
  yearlyPrice: number
  productLimit: number
  features: string[]
  unavailableFeatures?: string[]
}

