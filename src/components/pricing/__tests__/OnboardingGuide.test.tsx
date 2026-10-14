import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { OnboardingGuide } from '../OnboardingGuide'

describe('OnboardingGuide Component', () => {
  it('renders progress correctly when partial steps are complete', () => {
    render(
      <MemoryRouter>
        <OnboardingGuide
          hasApiKey={true}
          costProfileComplete={true}
          productsTotal={0}
          productsWithRivals={0}
        />
      </MemoryRouter>
    )

    // 2 out of 4 steps = 50%
    expect(screen.getByText('۵۰٪')).toBeInTheDocument()
    expect(screen.getByText(/۲ از ۴ مرحله/)).toBeInTheDocument()
    expect(screen.getByText('ساخت کلید API و اتصال افزونه ووکامرس')).toBeInTheDocument()
    expect(screen.getByText('تنظیم فرمول هزینه و حاشیه سود امن')).toBeInTheDocument()
  })

  it('renders 100% completed badge when all steps are done', () => {
    render(
      <MemoryRouter>
        <OnboardingGuide
          hasApiKey={true}
          costProfileComplete={true}
          productsTotal={120}
          productsWithRivals={90}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('۱۰۰٪')).toBeInTheDocument()
    expect(screen.getByText('تکمیل شد')).toBeInTheDocument()
  })

  it('collapses and expands steps when toggle button is clicked', () => {
    render(
      <MemoryRouter>
        <OnboardingGuide
          hasApiKey={false}
          costProfileComplete={false}
          productsTotal={0}
          productsWithRivals={0}
        />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByLabelText('بستن مراحل')
    expect(screen.getByText('دریافت کلید API')).toBeInTheDocument()

    // Collapse
    fireEvent.click(toggleBtn)
    expect(screen.queryByText('دریافت کلید API')).not.toBeInTheDocument()

    // Expand
    const expandBtn = screen.getByLabelText('نمایش مراحل')
    fireEvent.click(expandBtn)
    expect(screen.getByText('دریافت کلید API')).toBeInTheDocument()
  })
})
