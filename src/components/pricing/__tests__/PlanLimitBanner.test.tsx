import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PlanLimitBanner } from '../PlanLimitBanner'
import type { PlanUsage } from '@/types/apps/pricing'

const mockPlanBase: PlanUsage = {
  tier: 'starter',
  tierLabel: 'طرح پایه (Starter)',
  productsUsed: 30,
  productsLimit: 50,
  rivalRefreshInterval: 'daily',
  rivalRefreshLabel: 'روزانه (۲۴ ساعت)',
  autoApplyAllowed: false,
  smsAlertsAllowed: false,
  renewalDate: '۱۴۰۵/۰۸/۰۱',
  daysRemaining: 12,
  billingCycle: 'monthly',
}

describe('PlanLimitBanner Component', () => {
  it('does not render when usage is below 80%', () => {
    const { container } = render(
      <PlanLimitBanner
        plan={{ ...mockPlanBase, productsUsed: 30, productsLimit: 50 }}
        onUpgradeClick={vi.fn()}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders warning banner when usage is between 80% and 99%', () => {
    const handleUpgrade = vi.fn()
    render(
      <PlanLimitBanner
        plan={{ ...mockPlanBase, productsUsed: 48, productsLimit: 50 }}
        onUpgradeClick={handleUpgrade}
      />
    )

    expect(screen.getByText('نزدیک به سقف ظرفیت کاتالوگ')).toBeInTheDocument()
    expect(screen.getByText(/۴۸/)).toBeInTheDocument()
    expect(screen.getByText(/۵۰/)).toBeInTheDocument()

    const btn = screen.getByRole('button', { name: /ارتقای پلن/ })
    fireEvent.click(btn)
    expect(handleUpgrade).toHaveBeenCalledTimes(1)
  })

  it('renders full cap alert when usage reaches 100%', () => {
    const handleUpgrade = vi.fn()
    render(
      <PlanLimitBanner
        plan={{ ...mockPlanBase, productsUsed: 50, productsLimit: 50 }}
        onUpgradeClick={handleUpgrade}
      />
    )

    expect(
      screen.getByText('سقف ظرفیت کاتالوگ تکمیل شده است')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ارتقای فوری پلن/ })
    ).toBeInTheDocument()
  })
})
