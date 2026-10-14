import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SWRConfig } from 'swr'
import { PlanUpgradeDialog } from '../PlanUpgradeDialog'

describe('PlanUpgradeDialog Component', () => {
  it('renders all 3 tiers and billing toggle when open', () => {
    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <PlanUpgradeDialog open={true} onOpenChange={vi.fn()} />
      </SWRConfig>
    )

    expect(screen.getByText('ارتقای پلن و ظرفیت کاتالوگ')).toBeInTheDocument()
    expect(screen.getByText('طرح پایه')).toBeInTheDocument()
    expect(screen.getByText('طرح حرفه‌ای')).toBeInTheDocument()
    expect(screen.getByText('طرح تجاری')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'پرداخت ماهانه' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /پرداخت سالانه/ })
    ).toBeInTheDocument()
  })

  it('switches between monthly and yearly billing cycles', () => {
    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <PlanUpgradeDialog open={true} onOpenChange={vi.fn()} />
      </SWRConfig>
    )

    const yearlyBtn = screen.getByText('پرداخت سالانه')
    fireEvent.click(yearlyBtn)

    // In yearly mode, "۲ ماه رایگان" discount is visible
    expect(screen.getByText('۲ ماه رایگان')).toBeInTheDocument()
    expect(screen.getAllByText(/معادل ۱۰ ماه/).length).toBeGreaterThan(0)
  })

  it('allows clicking upgrade on a higher tier', async () => {
    const handleUpgraded = vi.fn()
    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <PlanUpgradeDialog
          open={true}
          onOpenChange={vi.fn()}
          onUpgraded={handleUpgraded}
        />
      </SWRConfig>
    )

    const proUpgradeBtn = screen.getByRole('button', {
      name: /ارتقا به طرح حرفه‌ای/,
    })
    expect(proUpgradeBtn).toBeInTheDocument()
    fireEvent.click(proUpgradeBtn)

    await waitFor(() => {
      expect(handleUpgraded).toHaveBeenCalled()
    })
  })
})
