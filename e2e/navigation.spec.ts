import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated session
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        role: 'admin'
      }))
    })

    // Start from dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('navbar contains all required elements', async ({ page }) => {
    const navbar = page.getByTestId('navbar')
    await expect(navbar).toBeVisible()

    // Check logo
    const logo = page.locator('img[src="/nycu-logo.png"]')
    await expect(logo).toBeVisible()

    // Check navigation links
    await expect(page.getByTestId('nav-')).toBeVisible() // Home
    await expect(page.getByTestId('nav-applications')).toBeVisible()
    await expect(page.getByTestId('nav-payments')).toBeVisible()
    await expect(page.getByTestId('nav-terms')).toBeVisible()

    // Check admin and logout buttons
    await expect(page.getByTestId('admin-button')).toBeVisible()
    await expect(page.getByTestId('logout-button')).toBeVisible()
  })

  test('sidebar toggle works on different screen sizes', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Open sidebar
    await page.getByTestId('menu-button').click()
    const sidebar = page.getByTestId('sidebar')
    await expect(sidebar).toBeVisible()
    await expect(page.getByTestId('sidebar-backdrop')).toBeVisible()

    // Close with backdrop
    await page.getByTestId('sidebar-backdrop').click()
    await expect(sidebar).toBeHidden()

    // Test on desktop
    await page.setViewportSize({ width: 1024, height: 768 })

    // Open sidebar
    await page.getByTestId('menu-button').click()
    await expect(sidebar).toBeVisible()
    await expect(page.getByTestId('sidebar-backdrop')).toBeHidden() // No backdrop on desktop
  })

  test('navigation links work correctly', async ({ page }) => {
    // Test all main navigation links
    const routes = [
      { testId: 'nav-', path: '/' },
      { testId: 'nav-applications', path: '/applications' },
      { testId: 'nav-payments', path: '/payments' },
      { testId: 'nav-terms', path: '/terms' }
    ]

    for (const route of routes) {
      await page.getByTestId(route.testId).click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBe(`http://localhost:5173${route.path}`)
    }
  })

  test('admin navigation works correctly', async ({ page }) => {
    // Click admin button
    await page.getByTestId('admin-button').click()
    await page.waitForLoadState('networkidle')
    expect(page.url()).toBe('http://localhost:5173/admin')

    // Open sidebar to access admin menu
    await page.getByTestId('menu-button').click()
    const sidebar = page.getByTestId('sidebar')
    await expect(sidebar).toBeVisible()

    // Test all admin navigation links
    const adminRoutes = [
      { text: '管理儀表板', path: '/admin' },
      { text: '個人審核資訊', path: '/admin/profile' },
      { text: '申請管理', path: '/admin/applications' },
      { text: '繳費管理', path: '/admin/payments' },
      { text: '寄送通知', path: '/admin/mail' }
    ]

    for (const route of adminRoutes) {
      await page.getByRole('link', { name: route.text }).click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBe(`http://localhost:5173${route.path}`)
    }
  })

  test('page transitions work correctly', async ({ page }) => {
    // Navigate between pages and check for transition effects
    await page.getByTestId('nav-applications').click()
    await expect(page.locator('.v-enter-active')).toBeVisible()
    await page.waitForLoadState('networkidle')

    await page.getByTestId('nav-payments').click()
    await expect(page.locator('.v-enter-active')).toBeVisible()
    await page.waitForLoadState('networkidle')
  })

  test('navigation preserves state', async ({ page }) => {
    // Navigate to applications
    await page.getByTestId('nav-applications').click()
    await page.waitForLoadState('networkidle')

    // Perform some action that changes the page state
    await page.getByRole('button', { name: '新增申請' }).click()

    // Navigate away and back
    await page.getByTestId('nav-payments').click()
    await page.waitForLoadState('networkidle')

    await page.getByTestId('nav-applications').click()
    await page.waitForLoadState('networkidle')

    // Check if state is preserved (form should still be open)
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})