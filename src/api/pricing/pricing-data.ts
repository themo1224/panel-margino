import { http, HttpResponse } from 'msw'
import type {
  AlertPrefs,
  ApiKeyItem,
  AutoApplySettings,
  BillingCycle,
  CostProfile,
  OverviewData,
  PlanTier,
  PlanUsage,
  ProductRivalDetail,
  ProductRivalRow,
  ReportSummary,
} from '@/types/apps/pricing'
import type { AuthUser, TokenResponse } from '@/api/auth'

export function formatToman(value: number): string {
  return `${value.toLocaleString('fa-IR')} تومان`
}

export function rivalStatusLabel(
  status: ProductRivalRow['rivalStatus']
): string {
  switch (status) {
    case 'matched':
      return 'تحلیل شده'
    case 'stale':
      return 'منقضی'
    case 'finding':
      return 'در حال یافتن رقیب'
    case 'cannot_match':
      return 'بدون رقابت سودآور'
    case 'needs_confirm':
      return 'نیاز به تأیید'
    default:
      return status
  }
}

export function getProductDetail(productId: string): ProductRivalDetail | null {
  const row = mockProducts.find((p) => p.id === productId)
  if (!row) return null

  const isPerfume = row.sku.startsWith('PRF')
  const baseCost = Math.round(row.costFloor * 0.78)

  return {
    ...row,
    torobUrl: `https://torob.com/p/${row.id}/`,
    matchConfidence: row.rivalStatus === 'matched' ? 0.94 : 0.65,
    matchedTitle: row.name,
    costBreakdown: {
      baseCost,
      overheadPct: 12,
      dollarMultiplier: 1.05,
      targetMarginPct: 15,
      calculatedFloor: row.costFloor,
    },
    competitors:
      row.rivalCount > 0
        ? [
            {
              id: 'c1',
              shopName: 'دیجی‌کالا',
              price: row.rivalCheapest ?? row.storePrice,
              url: 'https://digikala.com',
              isCheapest: true,
              isDigikala: true,
              city: 'تهران',
              lastSeenAt: '۲ ساعت پیش',
            },
            {
              id: 'c2',
              shopName: isPerfume ? 'عطر سفیر' : 'نقره طاها',
              price: Math.round((row.rivalCheapest ?? row.storePrice) * 1.03),
              url: 'https://example.com',
              isCheapest: false,
              city: 'اصفهان',
              lastSeenAt: '۴ ساعت پیش',
            },
            {
              id: 'c3',
              shopName: isPerfume ? 'میشا پرفیوم' : 'گالری سیمین',
              price: row.rivalMedian ?? Math.round(row.storePrice * 1.05),
              url: 'https://example.com',
              isCheapest: false,
              city: 'شیراز',
              lastSeenAt: 'دیروز',
            },
            {
              id: 'c4',
              shopName: isPerfume ? 'روژا شاپ' : 'سیلور لند',
              price: Math.round((row.rivalMedian ?? row.storePrice) * 1.08),
              url: 'https://example.com',
              isCheapest: false,
              city: 'مشهد',
              lastSeenAt: '۲ روز پیش',
            },
          ]
        : [],
    priceHistory: [
      {
        id: 'h1',
        date: '۱۴۰۳/۰۷/۲۱',
        oldPrice: Math.round(row.storePrice * 0.95),
        newPrice: row.storePrice,
        source: 'recommendation',
      },
      {
        id: 'h2',
        date: '۱۴۰۳/۰۶/۱۵',
        oldPrice: Math.round(row.storePrice * 0.9),
        newPrice: Math.round(row.storePrice * 0.95),
        source: 'manual',
      },
    ],
  }
}

/* ---------- Mock datasets ---------- */

export const mockOverview: OverviewData = {
  shopName: 'عطر سرای نور',
  costProfileComplete: true,
  costProfileLabel: 'پروفایل هزینه تکمیل شده',
  recommendCount: 48,
  productsTotal: 124,
  productsWithRivals: 97,
  aboveRivalsCount: 18,
  staleCount: 6,
  rivalHeadline:
    '۱۸ محصول گران‌تر از ارزان‌ترین رقیب در ترب هستند — پیشنهاد امن هنوز بالای کف هزینه است.',
  insights: [
    {
      id: '1',
      productName: 'ادکلن مردانه بلو د شنل ۱۰۰میل',
      message: 'قیمت فروشگاه ۱۲٪ بالاتر از ارزان‌ترین رقیب ترب',
      kind: 'above_rivals',
    },
    {
      id: '2',
      productName: 'زنجیر نقره زنانه ۴۵سانت',
      message: 'داده رقیب ۶ روزه است — پیشنهاد از کف هزینه',
      kind: 'stale',
    },
    {
      id: '3',
      productName: 'ست هدیه عطر و لوسیون',
      message: 'رقیب سودآور پیدا نشد؛ پیشنهاد فقط از کف + حاشیه',
      kind: 'below_cost',
    },
    {
      id: '4',
      productName: 'عطر زنانه کوکو مادمازل ۵۰میل',
      message: 'هم‌تراز رقبا؛ پیشنهاد امن قابل اعمال',
      kind: 'ok',
    },
  ],
}

export let mockProducts: ProductRivalRow[] = [
  {
    id: 'p1',
    name: 'ادکلن مردانه بلو د شنل ۱۰۰میل',
    sku: 'PRF-BLU-100',
    storePrice: 4_850_000,
    costFloor: 3_900_000,
    recommendedPrice: 4_350_000,
    rivalSource: 'torob',
    rivalCheapest: 4_320_000,
    rivalMedian: 4_550_000,
    rivalCount: 11,
    vsStorePct: 12,
    rivalStatus: 'matched',
    lastRivalAt: '2026-09-23T08:10:00Z',
  },
  {
    id: 'p2',
    name: 'عطر زنانه کوکو مادمازل ۵۰میل',
    sku: 'PRF-CKO-50',
    storePrice: 3_200_000,
    costFloor: 2_650_000,
    recommendedPrice: 3_150_000,
    rivalSource: 'torob',
    rivalCheapest: 3_180_000,
    rivalMedian: 3_290_000,
    rivalCount: 8,
    vsStorePct: 1,
    rivalStatus: 'matched',
    lastRivalAt: '2026-09-23T07:40:00Z',
  },
  {
    id: 'p3',
    name: 'زنجیر نقره زنانه ۴۵سانت',
    sku: 'SLV-CHN-45',
    storePrice: 1_450_000,
    costFloor: 1_180_000,
    recommendedPrice: 1_380_000,
    rivalSource: 'snapp',
    rivalCheapest: 1_290_000,
    rivalMedian: 1_360_000,
    rivalCount: 5,
    vsStorePct: 12,
    rivalStatus: 'stale',
    lastRivalAt: '2026-09-17T12:00:00Z',
  },
  {
    id: 'p4',
    name: 'ست هدیه عطر و لوسیون',
    sku: 'SET-GIF-01',
    storePrice: 2_100_000,
    costFloor: 1_950_000,
    recommendedPrice: 2_240_000,
    rivalSource: null,
    rivalCheapest: null,
    rivalMedian: null,
    rivalCount: 0,
    vsStorePct: null,
    rivalStatus: 'cannot_match',
    lastRivalAt: null,
  },
  {
    id: 'p5',
    name: 'ادوپرفیوم مردانه ساواج دیور ۶۰میل',
    sku: 'PRF-SVG-60',
    storePrice: 5_100_000,
    costFloor: 4_200_000,
    recommendedPrice: 4_850_000,
    rivalSource: 'torob',
    rivalCheapest: null,
    rivalMedian: null,
    rivalCount: 0,
    vsStorePct: null,
    rivalStatus: 'finding',
    lastRivalAt: null,
  },
  {
    id: 'p6',
    name: 'دستبند نقره مردانه',
    sku: 'SLV-BRC-M',
    storePrice: 980_000,
    costFloor: 720_000,
    recommendedPrice: 890_000,
    rivalSource: 'torob',
    rivalCheapest: 910_000,
    rivalMedian: 950_000,
    rivalCount: 7,
    vsStorePct: -8,
    rivalStatus: 'matched',
    lastRivalAt: '2026-09-22T19:20:00Z',
  },
  {
    id: 'p7',
    name: 'عطر زنانه لانکوم لاویه بل ۵۰میل',
    sku: 'PRF-LVE-50',
    storePrice: 3_800_000,
    costFloor: 3_100_000,
    recommendedPrice: 3_550_000,
    rivalSource: 'torob',
    rivalCheapest: null,
    rivalMedian: null,
    rivalCount: 0,
    vsStorePct: null,
    rivalStatus: 'needs_confirm',
    lastRivalAt: null,
    pendingRivalMatch: {
      id: 'm7',
      source: 'torob',
      listingTitle: 'لانکوم لاویه بل ۵۰ میل — ترب',
      confidence: 0.66,
    },
  },
]

let costProfile: CostProfile = {
  supplierPct: 62,
  dollarPct: 18,
  rentMonthly: 45_000_000,
  staffMonthly: 32_000_000,
  otherMonthly: 8_500_000,
  targetMarginPct: 18,
  updatedAt: '2026-09-20T10:00:00Z',
}

export const mockReport: ReportSummary = {
  monthLabel: 'شهریور ۱۴۰۵',
  recommendationsIssued: 48,
  rivalChecks: 312,
  priceActions: 14,
  avgVsRivalPct: 6.4,
  chart: [
    { label: 'هفته ۱', recommends: 9, rivalHits: 68 },
    { label: 'هفته ۲', recommends: 12, rivalHits: 74 },
    { label: 'هفته ۳', recommends: 14, rivalHits: 81 },
    { label: 'هفته ۴', recommends: 13, rivalHits: 89 },
  ],
}

let apiKeys: ApiKeyItem[] = [
  {
    id: 'k1',
    name: 'ووکامرس فروشگاه',
    prefix: 'pk_live_7f3a',
    createdAt: '2026-08-12T09:00:00Z',
    lastUsedAt: '2026-09-23T06:15:00Z',
    revoked: false,
  },
  {
    id: 'k2',
    name: 'تست محلی',
    prefix: 'pk_test_91bc',
    createdAt: '2026-09-01T14:30:00Z',
    lastUsedAt: null,
    revoked: false,
  },
]

let alertPrefs: AlertPrefs = {
  belowCost: true,
  aboveRivals: true,
  staleCost: true,
  email: true,
  sms: false,
}

export let mockPlanUsage: PlanUsage = {
  tier: 'starter',
  tierLabel: 'پایه (Starter)',
  productsUsed: 48,
  productsLimit: 50,
  rivalRefreshInterval: 'daily',
  rivalRefreshLabel: 'روزانه (۲۴ ساعت)',
  autoApplyAllowed: false,
  smsAlertsAllowed: false,
  renewalDate: '۱۴۰۵/۰۸/۰۱',
  daysRemaining: 12,
  billingCycle: 'monthly',
}

const mockSeller: AuthUser = {
  id: 1,
  name: 'مریم فروشنده',
  email: 'seller@pricing.local',
  phone: '09121234567',
  role: 'seller',
}

function tokenResponse(user: AuthUser = mockSeller): TokenResponse {
  return {
    token: 'mock-pricing-token',
    token_type: 'Bearer',
    user,
  }
}

/* ---------- MSW handlers ---------- */

export const PricingHandlers = [
  // Auth (absolute API host + relative)
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Validation failed' }, { status: 422 })
    }
    return HttpResponse.json(tokenResponse({ ...mockSeller, email: body.email }))
  }),
  http.post('*/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string
      email?: string
    }
    return HttpResponse.json(
      tokenResponse({
        ...mockSeller,
        name: body.name ?? mockSeller.name,
        email: body.email ?? mockSeller.email,
      })
    )
  }),
  http.post('*/api/auth/logout', () => HttpResponse.json(null, { status: 204 })),
  http.post('*/api/auth/otp/request', () =>
    HttpResponse.json({ message: 'کد ارسال شد' })
  ),
  http.post('*/api/auth/otp/verify', async ({ request }) => {
    const body = (await request.json()) as { phone?: string }
    return HttpResponse.json(
      tokenResponse({ ...mockSeller, phone: body.phone ?? mockSeller.phone })
    )
  }),
  http.get('*/api/me', () => HttpResponse.json(mockSeller)),
  http.patch('*/api/me', async ({ request }) => {
    const body = (await request.json()) as Partial<AuthUser>
    Object.assign(mockSeller, body)
    return HttpResponse.json(mockSeller)
  }),

  // Overview
  http.get('/api/pricing/overview', () =>
    HttpResponse.json({ status: 200, data: mockOverview })
  ),

  // Products + rivals
  http.get('/api/pricing/products', () =>
    HttpResponse.json({ status: 200, data: mockProducts })
  ),
  http.get('*/api/pricing/products', () =>
    HttpResponse.json({ status: 200, data: mockProducts })
  ),
  http.post('*/api/pricing/products/:productId/rivals/:matchId/confirm', ({ params }) => {
    const productId = String(params.productId)
    const matchId = String(params.matchId)
    const idx = mockProducts.findIndex((p) => p.id === productId)
    if (idx < 0) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    const row = mockProducts[idx]
    if (row.pendingRivalMatch?.id !== matchId) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    const rivalCheapest = Math.round(row.storePrice * 0.92)
    const updated: ProductRivalRow = {
      ...row,
      rivalStatus: 'matched',
      rivalSource: row.pendingRivalMatch.source,
      rivalCheapest,
      rivalMedian: Math.round(row.storePrice * 0.97),
      rivalCount: 6,
      vsStorePct: Number(
        (((row.storePrice - rivalCheapest) / rivalCheapest) * 100).toFixed(2)
      ),
      lastRivalAt: new Date().toISOString(),
      pendingRivalMatch: null,
    }
    mockProducts = mockProducts.map((p, i) => (i === idx ? updated : p))
    return HttpResponse.json({ status: 200, data: updated })
  }),

  // Product detail
  http.get('*/api/pricing/products/:productId', ({ params }) => {
    const productId = String(params.productId)
    const detail = getProductDetail(productId)
    if (!detail) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json({ status: 200, data: detail })
  }),

  // Apply price on product
  http.post('*/api/pricing/products/:productId/apply-price', async ({ params, request }) => {
    const productId = String(params.productId)
    const body = (await request.json().catch(() => ({}))) as { price?: number }
    const idx = mockProducts.findIndex((p) => p.id === productId)
    if (idx < 0) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    const row = mockProducts[idx]
    const newPrice = body.price && body.price > 0 ? body.price : row.recommendedPrice
    const updated: ProductRivalRow = {
      ...row,
      storePrice: newPrice,
      vsStorePct: row.rivalCheapest
        ? Number((((newPrice - row.rivalCheapest) / row.rivalCheapest) * 100).toFixed(2))
        : null,
    }
    mockProducts = mockProducts.map((p, i) => (i === idx ? updated : p))
    return HttpResponse.json({ status: 200, data: updated })
  }),

  // Refresh Torob data
  http.post('*/api/pricing/products/:productId/refresh-rivals', ({ params }) => {
    const productId = String(params.productId)
    const idx = mockProducts.findIndex((p) => p.id === productId)
    if (idx < 0) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    const row = mockProducts[idx]
    const updated: ProductRivalRow = {
      ...row,
      rivalStatus: 'matched',
      lastRivalAt: new Date().toISOString(),
    }
    mockProducts = mockProducts.map((p, i) => (i === idx ? updated : p))
    return HttpResponse.json({ status: 200, data: updated })
  }),

  // Batch apply recommended prices
  http.post('*/api/pricing/products/batch-apply-price', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { productIds?: string[] }
    const ids = new Set(body.productIds ?? [])
    const updatedRows: ProductRivalRow[] = []

    mockProducts = mockProducts.map((p) => {
      if (ids.has(p.id)) {
        const newPrice = p.recommendedPrice
        const updated: ProductRivalRow = {
          ...p,
          storePrice: newPrice,
          vsStorePct: p.rivalCheapest
            ? Number((((newPrice - p.rivalCheapest) / p.rivalCheapest) * 100).toFixed(2))
            : null,
        }
        updatedRows.push(updated)
        return updated
      }
      return p
    })

    return HttpResponse.json({ status: 200, data: updatedRows })
  }),

  // Batch refresh Torob rivals
  http.post('*/api/pricing/products/batch-refresh', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { productIds?: string[] }
    const ids = new Set(body.productIds ?? [])
    const updatedRows: ProductRivalRow[] = []

    mockProducts = mockProducts.map((p) => {
      if (ids.has(p.id)) {
        const updated: ProductRivalRow = {
          ...p,
          rivalStatus: 'matched',
          lastRivalAt: new Date().toISOString(),
        }
        updatedRows.push(updated)
        return updated
      }
      return p
    })

    return HttpResponse.json({ status: 200, data: updatedRows })
  }),


  // Unlink rival
  http.post('*/api/pricing/products/:productId/unlink-rival', ({ params }) => {
    const productId = String(params.productId)
    const idx = mockProducts.findIndex((p) => p.id === productId)
    if (idx < 0) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    const row = mockProducts[idx]
    const updated: ProductRivalRow = {
      ...row,
      rivalStatus: 'cannot_match',
      rivalSource: null,
      rivalCheapest: null,
      rivalMedian: null,
      rivalCount: 0,
      vsStorePct: null,
      lastRivalAt: null,
    }
    mockProducts = mockProducts.map((p, i) => (i === idx ? updated : p))
    return HttpResponse.json({ status: 200, data: updated })
  }),

  // Costs
  http.get('/api/pricing/costs', () =>
    HttpResponse.json({ status: 200, data: costProfile })
  ),
  http.put('/api/pricing/costs', async ({ request }) => {
    const body = (await request.json()) as CostProfile
    costProfile = { ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json({ status: 200, data: costProfile })
  }),

  // Reports
  http.get('*/api/pricing/reports', () =>
    HttpResponse.json({ status: 200, data: mockReport })
  ),

  // API keys
  http.get('/api/pricing/api-keys', () =>
    HttpResponse.json({ status: 200, data: apiKeys })
  ),
  http.post('/api/pricing/api-keys', async ({ request }) => {
    const body = (await request.json()) as { name?: string }
    const created: ApiKeyItem = {
      id: `k${Date.now()}`,
      name: body.name?.trim() || 'کلید جدید',
      prefix: `pk_live_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      revoked: false,
    }
    apiKeys = [created, ...apiKeys]
    return HttpResponse.json({
      status: 200,
      data: created,
      secret: `${created.prefix}_${Math.random().toString(36).slice(2, 18)}`,
    })
  }),
  http.post('/api/pricing/api-keys/:id/revoke', ({ params }) => {
    apiKeys = apiKeys.map((k) =>
      k.id === params.id ? { ...k, revoked: true } : k
    )
    return HttpResponse.json({ status: 200, data: apiKeys })
  }),

  // Alerts
  http.get('*/api/pricing/alerts', () =>
    HttpResponse.json({ status: 200, data: alertPrefs })
  ),
  http.put('*/api/pricing/alerts', async ({ request }) => {
    alertPrefs = (await request.json()) as AlertPrefs
    return HttpResponse.json({ status: 200, data: alertPrefs })
  }),

  // Plan & Quotas
  http.get('*/api/pricing/plan', () =>
    HttpResponse.json({ status: 200, data: mockPlanUsage })
  ),
  http.post('*/api/pricing/plan/upgrade', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      tier?: PlanTier
      billingCycle?: BillingCycle
    }
    const targetTier = body.tier || 'pro'
    const cycle = body.billingCycle || 'monthly'

    const limits: Record<
      PlanTier,
      {
        limit: number
        label: string
        refresh: 'daily' | 'hourly' | 'priority'
        refreshLabel: string
        auto: boolean
        sms: boolean
      }
    > = {
      starter: {
        limit: 50,
        label: 'پایه (Starter)',
        refresh: 'daily',
        refreshLabel: 'روزانه (۲۴ ساعت)',
        auto: false,
        sms: false,
      },
      pro: {
        limit: 500,
        label: 'حرفه‌ای (Pro)',
        refresh: 'hourly',
        refreshLabel: 'ساعتی (هوشمند)',
        auto: true,
        sms: true,
      },
      business: {
        limit: 2500,
        label: 'تجاری (Business)',
        refresh: 'priority',
        refreshLabel: 'فوری و اختصاصی',
        auto: true,
        sms: true,
      },
    }

    const cfg = limits[targetTier]
    mockPlanUsage = {
      ...mockPlanUsage,
      tier: targetTier,
      tierLabel: cfg.label,
      productsLimit: cfg.limit,
      rivalRefreshInterval: cfg.refresh,
      rivalRefreshLabel: cfg.refreshLabel,
      autoApplyAllowed: cfg.auto,
      smsAlertsAllowed: cfg.sms,
      billingCycle: cycle,
      daysRemaining: cycle === 'yearly' ? 365 : 30,
    }

    return HttpResponse.json({ status: 200, data: mockPlanUsage })
  }),

  http.get('*/pricing/auto-apply', () => {
    return HttpResponse.json({
      status: 200,
      data: mockAutoApplySettings,
    })
  }),

  http.put('*/pricing/auto-apply', async ({ request }) => {
    const body = (await request.json()) as Partial<AutoApplySettings>
    mockAutoApplySettings = {
      ...mockAutoApplySettings,
      ...body,
    }
    return HttpResponse.json({
      status: 200,
      data: mockAutoApplySettings,
    })
  }),

  http.post('*/pricing/products/:id/toggle-auto-apply', async ({ params, request }) => {
    const id = String(params.id)
    const body = (await request.json()) as { excluded: boolean }
    const product = mockProducts.find((p) => p.id === id)
    if (product) {
      product.autoApplyExcluded = body.excluded
    }
    return HttpResponse.json({
      status: 200,
      data: product ?? null,
    })
  }),

  http.post('*/pricing/auto-apply/run-now', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        applied_count: 5,
        skipped_count: 1,
        applied_ids: [1, 2, 3],
      },
    })
  }),
]

export let mockAutoApplySettings: AutoApplySettings = {
  enabled: true,
  maxDropPercent: 15,
  onlyFreshRivals: true,
  notifyDaily: true,
  lastRunAt: '2026-10-16T12:00:00Z',
  planAllowed: true,
  planCode: 'pro',
  eligibleProductsCount: 14,
  excludedProductsCount: 2,
  totalProductsCount: 18,
}

