import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SWRConfig } from 'swr'
import { ProductRivalDetailSheet } from '../ProductRivalDetailSheet'

describe('ProductRivalDetailSheet Component', () => {
  it('renders product details and tabs when open', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <ProductRivalDetailSheet
          productId="p1"
          open={true}
          onOpenChange={vi.fn()}
        />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('ادکلن مردانه بلو د شنل ۱۰۰میل')).toBeInTheDocument()
    })

    // Competitors tab
    expect(screen.getByText(/رقبا در ترب/)).toBeInTheDocument()
    expect(screen.getAllByText('دیجی‌کالا')[0]).toBeInTheDocument()

    // Formula tab trigger
    expect(screen.getByText('فرمول کف هزینه')).toBeInTheDocument()

    // Action button
    expect(screen.getByText('اعمال قیمت در ووکامرس')).toBeInTheDocument()
  })
})
