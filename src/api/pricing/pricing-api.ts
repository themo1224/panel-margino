import { apiFetch } from '@/api/client'
import type {
  AlertPrefs,
  ApiKeyItem,
  OverviewData,
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

