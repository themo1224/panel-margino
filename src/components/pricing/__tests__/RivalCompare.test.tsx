import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RivalCompare } from '../RivalCompare'

describe('RivalCompare Component', () => {
  it('renders store price and cheapest rival price correctly', () => {
    render(
      <RivalCompare
        storePrice={4850000}
        rivalCheapest={4320000}
        vsStorePct={12}
        source="torob"
        rivalCount={11}
        status="matched"
      />
    )

    // Check Torob source badge
    expect(screen.getByText('ترب')).toBeInTheDocument()

    // Check rival count
    expect(screen.getByText(/۱۱.*رقیب/)).toBeInTheDocument()

    // Check delta label (shorter form in redesign)
    expect(screen.getByText(/گران‌تر/)).toBeInTheDocument()
  })

  it('renders stale badge when status is stale', () => {
    render(
      <RivalCompare
        storePrice={1450000}
        rivalCheapest={1290000}
        vsStorePct={12}
        source="snapp"
        rivalCount={5}
        status="stale"
      />
    )

    expect(screen.getByText('منقضی')).toBeInTheDocument()
    expect(screen.getByText('اسنپ')).toBeInTheDocument()
  })

  it('returns null when status is finding or rivalCheapest is null', () => {
    const { container } = render(
      <RivalCompare
        storePrice={5100000}
        rivalCheapest={null}
        vsStorePct={null}
        source="torob"
        rivalCount={0}
        status="finding"
      />
    )

    expect(container.firstChild).toBeNull()
  })
})
