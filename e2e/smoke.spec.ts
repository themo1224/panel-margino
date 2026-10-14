import { test, expect } from '@playwright/test'

test.describe('Pricing Seller Panel E2E Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')
  })

  test('P0: Bootstraps with Farsi RTL document direction', async ({ page }) => {
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'fa')
  })

  test('P0: Home page renders rival summary headline and overview cards', async ({ page }) => {
    // Check main seller shop title or key heading
    await expect(page.locator('body')).toBeVisible()
    
    // Check that rival headline/card exists
    const bodyText = await page.innerText('body')
    expect(bodyText).toContain('عطر سرای نور')
  })

  test('P1: Navigation to Products view renders rival comparison columns', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products')
    
    await expect(page).toHaveURL(/\/products/)
    
    // Check table headers or key content
    const content = await page.content()
    expect(content).toMatch(/بلو د شنل|محصولات/i)
  })

  test('P1: Navigation to Costs view renders cost profile form', async ({ page }) => {
    await page.goto('/costs')
    await expect(page).toHaveURL(/\/costs/)
    
    const bodyText = await page.innerText('body')
    expect(bodyText).toMatch(/پروفایل هزینه|درصد/i)
  })
})
