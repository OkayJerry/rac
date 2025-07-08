// extension-e2e/src/sanity.spec.ts
import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { chromium, type BrowserContext, type Worker } from 'playwright';

const EXTENSION_DIST = path.resolve(__dirname, '../../extension/dist');
const RC_PATH = path.resolve(__dirname, '../../.firebaserc');
const FIREBASE_PROJECT = JSON.parse(fs.readFileSync(RC_PATH, 'utf-8')).projects
  .default;

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';
const FIRESTORE_EMULATOR_URL = 'http://127.0.0.1:8081';
const FUNCTIONS_EMULATOR_URL = 'http://127.0.0.1:5001';

const COLLECTION_PATH = `projects/${FIREBASE_PROJECT}/databases/(default)/documents/sanity`;
const DOC_ID = 'crudTestDoc';
const DOC_PATH = `${COLLECTION_PATH}/${DOC_ID}`;

test.describe('Extension + Backend Sanity Suite', () => {
  let context: BrowserContext;
  let extensionId: string;

  test.beforeAll(async () => {
    // Launch Chrome with only our unpacked extension loaded
    context = await chromium.launchPersistentContext('', {
      headless: process.env.CI ? true : false, // headless in CI
      channel: 'chrome',
      args: [
        process.env.CI && '--no-sandbox',
        `--disable-extensions-except=${EXTENSION_DIST}`,
        `--load-extension=${EXTENSION_DIST}`,
      ].filter(Boolean) as string[],
    });

    // Obtain the service worker so we can derive the extension ID
    let worker: Worker | undefined = context.serviceWorkers()[0];
    if (!worker) {
      worker = await context.waitForEvent('serviceworker');
    }
    extensionId = new URL(worker.url()).hostname;
  });

  test.afterAll(async () => {
    await context.close();
  });

  //
  // Extension UI sanity
  //
  test('popup UI loads', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await expect(page.locator('#root')).toBeVisible();
    await page.close();
  });

  //
  // Cloud Function sanity
  //
  test('helloWorld function responds', async ({ request }) => {
    const res = await request.get(
      `${FUNCTIONS_EMULATOR_URL}/${FIREBASE_PROJECT}/us-central1/helloWorld`
    );
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toMatch(/Hello/i);
  });

  //
  // Auth emulator sanity
  //
  test('Auth emulator can create a user', async ({ request }) => {
    const signUpRes = await request.post(
      `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=anyKey`,
      {
        data: {
          email: 'e2e@sanity.test',
          password: 'pass123',
        },
      }
    );
    expect(signUpRes.ok()).toBeTruthy();
    const body = await signUpRes.json();
    expect(body.idToken).toBeDefined();
    expect(body.localId).toBeDefined();
  });

  //
  // Firestore emulator CRUD sanity (serial)
  //
  test.describe('Firestore Emulator CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    test('CREATE document', async ({ request }) => {
      const url = `${FIRESTORE_EMULATOR_URL}/v1/${COLLECTION_PATH}?documentId=${DOC_ID}`;
      const res = await request.post(url, {
        headers: { Authorization: 'Bearer owner' },
        data: {
          fields: {
            status: { stringValue: 'new' },
            count: { integerValue: '1' },
          },
        },
      });
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.name).toContain(`/sanity/${DOC_ID}`);
    });

    test('READ document', async ({ request }) => {
      const res = await request.get(
        `${FIRESTORE_EMULATOR_URL}/v1/${DOC_PATH}`,
        { headers: { Authorization: 'Bearer owner' } }
      );
      expect(res.ok()).toBeTruthy();
      const doc = await res.json();
      expect(doc.fields.status.stringValue).toBe('new');
      expect(doc.fields.count.integerValue).toBe('1');
    });

    test('UPDATE document', async ({ request }) => {
      const res = await request.patch(
        `${FIRESTORE_EMULATOR_URL}/v1/${DOC_PATH}` +
          '?updateMask.fieldPaths=status&updateMask.fieldPaths=count',
        {
          headers: { Authorization: 'Bearer owner' },
          data: {
            fields: {
              status: { stringValue: 'updated' },
              count: { integerValue: '42' },
            },
          },
        }
      );
      expect(res.ok()).toBeTruthy();
      const updated = await res.json();
      expect(updated.fields.status.stringValue).toBe('updated');
      expect(updated.fields.count.integerValue).toBe('42');
    });

    test('DELETE document', async ({ request }) => {
      const url = `${FIRESTORE_EMULATOR_URL}/v1/${DOC_PATH}`;

      // 1) Delete
      const delRes = await request.delete(url, {
        headers: { Authorization: 'Bearer owner' },
      });
      expect(delRes.ok()).toBeTruthy();

      // 2) Verify deletion
      const getRes = await request.get(url, {
        headers: { Authorization: 'Bearer owner' },
      });
      expect(getRes.status()).toBe(404);
    });
  });
});
