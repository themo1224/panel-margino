import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BulkActionToolbar } from '../BulkActionToolbar'

describe('BulkActionToolbar Component', () => {
  it('does not render when selectedCount is 0', () => {
    const { container } = render(
      <BulkActionToolbar
        selectedCount={0}
        totalCount={10}
        onClearSelection={vi.fn()}
        onBatchApply={vi.fn()}
        onBatchRefresh={vi.fn()}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders selected count and action buttons when selectedCount > 0', () => {
    render(
      <BulkActionToolbar
        selectedCount={3}
        totalCount={10}
        onClearSelection={vi.fn()}
        onBatchApply={vi.fn()}
        onBatchRefresh={vi.fn()}
      />
    )

    expect(screen.getByText('محصول انتخاب شده')).toBeInTheDocument()
    expect(screen.getByText('۳')).toBeInTheDocument()
    expect(screen.getByText('اعمال قیمت پیشنهادی')).toBeInTheDocument()
  })

  it('calls onClearSelection when clear button is clicked', () => {
    const handleClear = vi.fn()
    render(
      <BulkActionToolbar
        selectedCount={3}
        totalCount={10}
        onClearSelection={handleClear}
        onBatchApply={vi.fn()}
        onBatchRefresh={vi.fn()}
      />
    )

    const clearBtn = screen.getByTitle('لغو انتخاب محصولات')
    fireEvent.click(clearBtn)
    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it('opens confirmation dialog on apply click and confirms batch apply', async () => {
    const handleBatchApply = vi.fn().mockResolvedValue(undefined)
    render(
      <BulkActionToolbar
        selectedCount={4}
        totalCount={10}
        onClearSelection={vi.fn()}
        onBatchApply={handleBatchApply}
        onBatchRefresh={vi.fn()}
      />
    )

    const applyTrigger = screen.getByText('اعمال قیمت پیشنهادی')
    fireEvent.click(applyTrigger)

    // Check dialog opens
    expect(
      screen.getByText('اعمال گروهی قیمت‌های پیشنهادی')
    ).toBeInTheDocument()

    // Click confirm in dialog
    const confirmBtn = screen.getByText('تأیید و اعمال در ووکامرس')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(handleBatchApply).toHaveBeenCalledTimes(1)
    })
  })

  it('triggers onBatchRefresh when refresh button is clicked', () => {
    const handleRefresh = vi.fn()
    render(
      <BulkActionToolbar
        selectedCount={2}
        totalCount={10}
        onClearSelection={vi.fn()}
        onBatchApply={vi.fn()}
        onBatchRefresh={handleRefresh}
      />
    )

    // Button has "استعلام ترب" or "استعلام"
    const refreshBtn = screen.getByRole('button', { name: /استعلام/ })
    fireEvent.click(refreshBtn)

    expect(handleRefresh).toHaveBeenCalledTimes(1)
  })
})
