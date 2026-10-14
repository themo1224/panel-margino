import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PriceOverridePopover } from '../PriceOverridePopover'
import type { ProductRivalRow } from '@/types/apps/pricing'

const mockProduct: ProductRivalRow = {
  id: 'p1',
  name: 'تست ادکلن شنل',
  sku: 'PRF-001',
  storePrice: 5200000,
  costFloor: 4100000,
  recommendedPrice: 4790000,
  rivalStatus: 'matched',
  rivalSource: 'torob',
  rivalCheapest: 4800000,
  rivalMedian: 4950000,
  rivalCount: 5,
  vsStorePct: 8.33,
  lastRivalAt: '2026-10-14T10:00:00Z',
  pendingRivalMatch: null,
}

describe('PriceOverridePopover Component', () => {
  it('renders trigger button and opens popover on click', async () => {
    const handleApply = vi.fn()
    render(<PriceOverridePopover product={mockProduct} onApply={handleApply} />)

    const triggerBtn = screen.getByTitle('ویرایش دستی قیمت پیشنهادی')
    expect(triggerBtn).toBeInTheDocument()

    fireEvent.click(triggerBtn)

    expect(screen.getByText('تنظیم دستی قیمت پیشنهادی')).toBeInTheDocument()
    expect(screen.getByText('تست ادکلن شنل')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4790000')).toBeInTheDocument()
  })

  it('displays warning when entered price is lower than costFloor', async () => {
    const handleApply = vi.fn()
    render(<PriceOverridePopover product={mockProduct} onApply={handleApply} />)

    fireEvent.click(screen.getByTitle('ویرایش دستی قیمت پیشنهادی'))

    const input = screen.getByDisplayValue('4790000')
    // Enter price lower than costFloor (4100000)
    fireEvent.change(input, { target: { value: '3900000' } })

    expect(
      screen.getByText(/توجه: این مبلغ کمتر از کف هزینه/)
    ).toBeInTheDocument()
  })

  it('rounds price when quick rounding button is clicked', async () => {
    const handleApply = vi.fn()
    render(<PriceOverridePopover product={mockProduct} onApply={handleApply} />)

    fireEvent.click(screen.getByTitle('ویرایش دستی قیمت پیشنهادی'))

    // Initial is 4790000 -> round to 50000 should be 4800000
    const roundBtn = screen.getByText('گرد کردن به ۵۰,۰۰۰')
    fireEvent.click(roundBtn)

    expect(screen.getByDisplayValue('4800000')).toBeInTheDocument()
  })

  it('submits customized price when form is submitted', async () => {
    const handleApply = vi.fn().mockResolvedValue(undefined)
    render(<PriceOverridePopover product={mockProduct} onApply={handleApply} />)

    fireEvent.click(screen.getByTitle('ویرایش دستی قیمت پیشنهادی'))

    const input = screen.getByDisplayValue('4790000')
    fireEvent.change(input, { target: { value: '4750000' } })

    const submitBtn = screen.getByText('ثبت و اعمال در ووکامرس')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleApply).toHaveBeenCalledWith(mockProduct, 4750000)
    })
  })
})
