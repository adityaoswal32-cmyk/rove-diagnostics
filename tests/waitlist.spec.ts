import { test, expect } from '@playwright/test';

test('Waitlist rendering and interactivity', async ({ page }) => {
  await page.goto('/');

  const waitlistSection = page.locator('#waitlist');
  await expect(waitlistSection).toBeVisible();

  const emailInput = page.locator('#waitlist-email');
  await expect(emailInput).toBeVisible();
  
  const submitButton = page.locator('button[type="submit"]');
  await expect(submitButton).toHaveText('Join the Waitlist');
});
