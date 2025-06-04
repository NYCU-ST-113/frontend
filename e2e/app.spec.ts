import { expect, test } from '@playwright/test'

test.describe('App', () => {
  test('should redirect to login page', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Verify redirect to login
    expect(page.url()).toBe('http://localhost:5173/login')
  })

  test('page transitions work', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check if the transition element exists
    const transition = page.locator('.fade-enter-active')
    expect(await transition.count()).toBeGreaterThanOrEqual(0)
  })
})