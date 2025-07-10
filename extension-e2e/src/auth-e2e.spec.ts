import { test, expect } from '@playwright/test';

test.describe('Auth popup happy path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // root served by Nx dev server
  });

  test('sign-in → sign-up toggle and field validation', async ({ page }) => {
    // Sign-In heading present
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    // switch to sign-up
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(
      page.getByRole('heading', { name: /create account/i })
    ).toBeVisible();

    // email validation shows helper text
    await page.locator('#auth-email').fill('bad-value');
    await page.locator('#auth-pwd').click(); // blur email
    await expect(page.getByText(/valid e-mail address/i)).toBeVisible();

    // confirm-password mismatch
    await page.locator('#auth-pwd').fill('secret123');
    await page.locator('#auth-confirm').fill('oops');
    await page.locator('#auth-confirm').blur();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();

    // back to sign-in
    await page.getByRole('button', { name: /back to sign in/i }).click();
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });
});
