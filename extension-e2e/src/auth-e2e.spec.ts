// extension-e2e/src/auth-e2e.spec.ts

import { test, expect } from '@playwright/test';

const suffix = Date.now();
const testEmail = `testuser${suffix}@example.com`;
const testPwd = 'Secret123!';
// URL of your Auth emulator; adjust host/port if needed
const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

test.describe('Auth Integration & Security Gate', () => {
  // Create a test user via the Auth emulator REST API before any tests run.
  test.beforeAll(async ({ request }) => {
    await request.post(
      `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=anything`,
      {
        data: {
          email: testEmail,
          password: testPwd,
          returnSecureToken: true,
        },
      }
    );
  });

  test('User can sign in and then sign out', async ({ page }) => {
    // 1. Start at the root and expect the auth gate
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();

    // 2. Fill in credentials and sign in
    await page.fill('#auth-email', testEmail);
    await page.fill('#auth-pwd', testPwd);
    await page.click('button:has-text("Sign In")');

    // 3. Verify successful sign-in by seeing the welcome message
    const welcomeHeading = page.getByRole('heading', {
      name: new RegExp(`Welcome, ${testEmail}`),
    });
    await expect(welcomeHeading).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

    // 4. Sign out
    await page.click('button:has-text("Sign Out")');

    // 5. Verify the user is returned to the auth gate
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible({
      timeout: 5_000,
    });
  });

  test('Unauthenticated access is blocked', async ({ page }) => {
    // This test is independent and confirms the auth gate is enforced on a fresh visit.
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
  });
});
