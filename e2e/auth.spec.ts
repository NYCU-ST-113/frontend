import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('redirects to login page when accessing protected route', async ({ page }) => {
    // Try accessing multiple protected routes
    const protectedRoutes = ['/dashboard', '/admin', '/applications', '/payments']

    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBe('http://localhost:5173/login')
    }
  })

  test('login page has correct UI elements', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Check title
    const title = page.getByRole('heading', { name: '服務申請系統' })
    await expect(title).toBeVisible()

    // Check login button
    const loginButton = page.getByTestId('login-button')
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()

    // Check button attributes
    const buttonClasses = await loginButton.getAttribute('class')
    expect(buttonClasses).toContain('p-button-raised')
    expect(buttonClasses).toContain('p-button-rounded')
  })

  test('login button initiates OAuth flow', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Click login and expect redirect to auth provider
    const loginButton = page.getByTestId('login-button')
    await loginButton.click()

    // Should be redirected to auth URL
    await page.waitForURL(/.*\/auth/)
  })

  test('callback page handles successful login', async ({ page }) => {
    // Mock successful OAuth callback
    await page.goto('/callback?code=test-code')
    await page.waitForLoadState('networkidle')

    // Should be redirected to dashboard
    expect(page.url()).toBe('http://localhost:5173/dashboard')

    // Check if token is stored
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
  })

  test('callback page handles login errors', async ({ page }) => {
    // Mock failed OAuth callback
    await page.goto('/callback?error=access_denied')
    await page.waitForLoadState('networkidle')

    // Should be redirected back to login
    expect(page.url()).toBe('http://localhost:5173/login')

    // Should show error message
    const errorMessage = page.getByTestId('error-message')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('登入失敗')
  })

  test('logout clears session and redirects to login', async ({ page }) => {
    // Set up authenticated session
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }))
    })

    // Go to dashboard and click logout
    await page.goto('/dashboard')
    const logoutButton = page.getByTestId('logout-button')
    await logoutButton.click()

    // Should be redirected to login
    expect(page.url()).toBe('http://localhost:5173/login')

    // Storage should be cleared
    const token = await page.evaluate(() => localStorage.getItem('token'))
    const user = await page.evaluate(() => localStorage.getItem('user'))
    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})