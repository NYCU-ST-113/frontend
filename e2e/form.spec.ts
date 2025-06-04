import { expect, test } from '@playwright/test';

test.describe('Form Interactions', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    // Navigate to the page with the form
    await page.goto('/');
  });

  test('should handle form validation', async ({ page }) => {
    // Find any form on the page
    const forms = await page.getByRole('form').all();
    test.skip(!forms.length, 'No forms found on the page');

    const form = forms[0];
    const inputs = await form.getByRole('textbox').all();
    test.skip(!inputs.length, 'No input fields found in the form');

    // Try submitting with empty fields
    const submitButton = form.getByRole('button').first();
    await submitButton.click();

    // Check for validation messages (could be shown in different ways)
    const hasValidationMessage = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input:invalid');
      return inputs.length > 0;
    });
    expect(hasValidationMessage).toBeTruthy();
  });

  test('should handle input interactions', async ({ page }) => {
    // Find any input field on the page
    const input = page.getByRole('textbox').first();
    test.skip(!await input.isVisible(), 'No visible input fields found');

    // Test input interactions
    await input.click();
    await input.type('Test Value');
    await expect(input).toHaveValue('Test Value');

    // Test input clearing
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('should handle successful form submission', async ({ page }) => {
    // Find any form on the page
    const forms = await page.getByRole('form').all();
    test.skip(!forms.length, 'No forms found on the page');

    const form = forms[0];
    const inputs = await form.getByRole('textbox').all();

    // Fill all text inputs with test data
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder') || '';
      const label = await input.getAttribute('aria-label') || '';
      const testValue = `Test ${placeholder || label || 'Value'}`;
      await input.fill(testValue);
    }

    // Submit the form
    const submitButton = form.getByRole('button').first();
    await submitButton.click();

    // Wait for any success indication
    // This could be a success message, URL change, or other feedback
    const successIndicators = [
      page.getByText(/success/i),
      page.getByText(/saved/i),
      page.getByText(/submitted/i)
    ];

    // Check if any success indicator is visible
    let successFound = false;
    for (const indicator of successIndicators) {
      if (await indicator.isVisible()) {
        successFound = true;
        break;
      }
    }
    expect(successFound).toBeTruthy();
  });
});