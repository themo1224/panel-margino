import { apiFetch } from '@/api/client'
import type {
  AlertPrefs,
  ApiKeyItem,
  AutoApplySettings,
  BillingCycle,
  OverviewData,
  PlanTier,
  PlanUsage,
  ProductRivalRow,
  ReportSummary,
} from '@/types/apps/pricing'

type Envelope<T> = { status: number; data: T; secret?: string }

/** SWR key for overview — path is relative to VITE_API_URL. */
export const OVERVIEW_KEY = '/pricing/overview'
export const PRODUCTS_KEY = '/pricing/products'
export const API_KEYS_KEY = '/pricing/api-keys'
export const REPORTS_KEY = '/pricing/reports'
export const ALERTS_KEY = '/pricing/alerts'
export const PLAN_KEY = '/pricing/plan'
export const COSTS_KEY = '/pricing/costs'
export const AUTO_APPLY_KEY = '/pricing/auto-apply'

export async function fetchReports(): Promise<{ data: ReportSummary }> {
  const res = await apiFetch<Envelope<ReportSummary>>(REPORTS_KEY)
  return { data: res.data }
}

export async function fetchAlertPrefs(): Promise<{ data: AlertPrefs }> {
  const res = await apiFetch<Envelope<AlertPrefs>>(ALERTS_KEY)
  return { data: res.data }
}

export async function saveAlertPrefs(
  prefs: AlertPrefs
): Promise<{ data: AlertPrefs }> {
  const res = await apiFetch<Envelope<AlertPrefs>>(ALERTS_KEY, {
    method: 'PUT',
    body: JSON.stringify(prefs),
  })
  return { data: res.data }
}

export async function fetchOverview(): Promise<{ data: OverviewData }> {
  const res = await apiFetch<Envelope<OverviewData>>(OVERVIEW_KEY)
  return { data: res.data }
}

export async function fetchProducts(): Promise<{ data: ProductRivalRow[] }> {
  const res = await apiFetch<Envelope<ProductRivalRow[]>>(PRODUCTS_KEY)
  return { data: res.data }
}

export async function fetchApiKeys(): Promise<{ data: ApiKeyItem[] }> {
  const res = await apiFetch<Envelope<ApiKeyItem[]>>(API_KEYS_KEY)
  return { data: res.data }
}

export async function createApiKey(
  name: string
): Promise<{ data: ApiKeyItem; secret?: string }> {
  const res = await apiFetch<Envelope<ApiKeyItem>>(API_KEYS_KEY, {
    method: 'POST',
    body: JSON.stringify({ name: name.trim() || 'کلید جدید' }),
  })
  return { data: res.data, secret: res.secret }
}

export async function revokeApiKey(id: string): Promise<{ data: ApiKeyItem[] }> {
  const res = await apiFetch<Envelope<ApiKeyItem[]>>(
    `${API_KEYS_KEY}/${id}/revoke`,
    { method: 'POST', body: JSON.stringify({}) }
  )
  return { data: res.data }
}

export async function confirmRivalMatch(
  productId: string,
  matchId: string
): Promise<{ data: ProductRivalRow }> {
  const res = await apiFetch<Envelope<ProductRivalRow>>(
    `${PRODUCTS_KEY}/${productId}/rivals/${matchId}/confirm`,
    { method: 'POST', body: JSON.stringify({}) }
  )
  return { data: res.data }
}

export async function fetchProductDetail(
  productId: string
): Promise<{ data: import('@/types/apps/pricing').ProductRivalDetail }> {
  const res = await apiFetch<Envelope<import('@/types/apps/pricing').ProductRivalDetail>>(
    `${PRODUCTS_KEY}/${productId}`
  )
  return { data: res.data }
}

export async function applyProductPrice(
  productId: string,
  price?: number
): Promise<{ data: ProductRivalRow }> {
  const res = await apiFetch<Envelope<ProductRivalRow>>(
    `${PRODUCTS_KEY}/${productId}/apply-price`,
    {
      method: 'POST',
      body: JSON.stringify(price !== undefined ? { price } : {}),
    }
  )
  return { data: res.data }
}

export async function refreshRivals(
  productId: string
): Promise<{ data: ProductRivalRow }> {
  const res = await apiFetch<Envelope<ProductRivalRow>>(
    `${PRODUCTS_KEY}/${productId}/refresh-rivals`,
    { method: 'POST', body: JSON.stringify({}) }
  )
  return { data: res.data }
}

export async function unlinkRival(
  productId: string
): Promise<{ data: ProductRivalRow }> {
  const res = await apiFetch<Envelope<ProductRivalRow>>(
    `${PRODUCTS_KEY}/${productId}/unlink-rival`,
    { method: 'POST', body: JSON.stringify({}) }
  )
  return { data: res.data }
}

export async function batchApplyPrices(
  productIds: string[]
): Promise<{ data: ProductRivalRow[] }> {
  const res = await apiFetch<Envelope<ProductRivalRow[]>>(
    `${PRODUCTS_KEY}/batch-apply-price`,
    {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    }
  )
  return { data: res.data }
}

export async function batchRefreshRivals(
  productIds: string[]
): Promise<{ data: ProductRivalRow[] }> {
  const res = await apiFetch<Envelope<ProductRivalRow[]>>(
    `${PRODUCTS_KEY}/batch-refresh`,
    {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    }
  )
  return { data: res.data }
}

export async function fetchPlanUsage(): Promise<{ data: PlanUsage }> {
  const res = await apiFetch<Envelope<PlanUsage>>(PLAN_KEY)
  return { data: res.data }
}

export async function upgradePlan(
  tier: PlanTier,
  billingCycle: BillingCycle = 'monthly'
): Promise<{ data: PlanUsage }> {
  const res = await apiFetch<Envelope<PlanUsage>>(`${PLAN_KEY}/upgrade`, {
    method: 'POST',
    body: JSON.stringify({ tier, billingCycle }),
  })
  return { data: res.data }
}

export async function fetchCosts(): Promise<{ data: import('@/types/apps/pricing').CostProfile }> {
  const res = await apiFetch<Envelope<import('@/types/apps/pricing').CostProfile>>(COSTS_KEY)
  return { data: res.data }
}

export async function saveCosts(
  costs: import('@/types/apps/pricing').CostProfile
): Promise<{ data: import('@/types/apps/pricing').CostProfile }> {
  const res = await apiFetch<Envelope<import('@/types/apps/pricing').CostProfile>>(COSTS_KEY, {
    method: 'PUT',
    body: JSON.stringify(costs),
  })
  return { data: res.data }
}

export async function fetchAutoApplySettings(): Promise<{ data: AutoApplySettings }> {
  const res = await apiFetch<Envelope<AutoApplySettings>>(AUTO_APPLY_KEY)
  return { data: res.data }
}

export async function saveAutoApplySettings(
  settings: Partial<AutoApplySettings>
): Promise<{ data: AutoApplySettings }> {
  const res = await apiFetch<Envelope<AutoApplySettings>>(AUTO_APPLY_KEY, {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
  return { data: res.data }
}

export async function toggleProductAutoApply(
  productId: string,
  excluded: boolean
): Promise<{ data: ProductRivalRow }> {
  const res = await apiFetch<Envelope<ProductRivalRow>>(
    `${PRODUCTS_KEY}/${productId}/toggle-auto-apply`,
    {
      method: 'POST',
      body: JSON.stringify({ excluded }),
    }
  )
  return { data: res.data }
}

export async function runAutoApplyNow(): Promise<{
  data: { applied_count: number; skipped_count: number; applied_ids: number[] }
}> {
  const res = await apiFetch<
    Envelope<{ applied_count: number; skipped_count: number; applied_ids: number[] }>
  >(`${AUTO_APPLY_KEY}/run-now`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
  return { data: res.data }
}



