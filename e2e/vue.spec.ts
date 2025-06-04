import { expect, test } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the login page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Should be redirected to login
  expect(page.url()).toBe('http://localhost:5173/login');

  // Check for NYCU IAM title
  await expect(page.locator('h1')).toHaveText('NYCU IAM');
});
