// extension-e2e/src/auth-e2e.spec.ts
import path from 'path';
import { test, expect } from '@playwright/test';
import { chromium, type BrowserContext } from 'playwright';

// Path to the built extension, needed for launching the browser context.
const EXTENSION_DIST = path.resolve(__dirname, '../../extension/dist');

const suffix = Date.now();
const testEmail = `testuser${suffix}@example.com`;
const testPwd = 'Secret123!';
const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

test.describe('Auth Integration & Security Gate', () => {
  let context: BrowserContext;

  // Launch a single persistent browser context before all tests in this suite.
  test.beforeAll(async () => {
    // Launch Chrome with our extension loaded, running headless in CI.
    context = await chromium.launchPersistentContext('', {
      headless: process.env.CI ? true : false,
      channel: 'chrome',
      args: [
        // The --no-sandbox flag is required to run in a containerized CI environment.
        process.env.CI ? '--no-sandbox' : '',
        `--disable-extensions-except=${EXTENSION_DIST}`,
        `--load-extension=${EXTENSION_DIST}`,
      ].filter(Boolean),
    });

    // Create the test user via the Auth emulator REST API.
    // We can use the browser context's request object for this.
    const page = await context.newPage();
    await page.request.post(
      `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=anything`,
      {
        data: {
          email: testEmail,
          password: testPwd,
          returnSecureToken: true,
        },
      }
    );
    await page.close();
  });

  // Close the browser context after all tests have run.
  test.afterAll(async () => {
    await context.close();
  });

  // Each test will now create and use its own page from the shared context.
  test('User can sign in and then sign out', async () => {
    const page = await context.newPage();

    // 1. Start at the root and expect the auth gate
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();

    // 2. Fill in credentials and sign in
    await page.fill('#auth-email', testEmail);
    await page.fill('#auth-pwd', testPwd);
    await page.click('button:has-text("Sign In")');

    // 3. Verify successful sign-in
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

    await page.close();
  });

  test('Unauthenticated access is blocked', async () => {
    const page = await context.newPage();

    // This test confirms the auth gate is enforced on a fresh visit.
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();

    await page.close();
  });
});
