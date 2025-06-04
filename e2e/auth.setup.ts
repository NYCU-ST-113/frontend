import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  // Store authentication state
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  // Set up auth state that can be restored in other tests
  await page.evaluate(() => {
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    }))
  })

  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})