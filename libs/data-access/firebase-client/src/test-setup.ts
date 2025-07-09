// libs/data-access/firebase-client/src/test-setup.ts
import 'cross-fetch/polyfill';

// This setup is no longer strictly necessary if tests provide their own env,
// but it's good practice to keep for other potential tests in the library.
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      DEV: true,
      VITE_API_KEY: 'mock-api-key',
      VITE_AUTH_DOMAIN: 'mock-auth-domain',
      VITE_PROJECT_ID: 'mock-project-id',
      VITE_STORAGE_BUCKET: 'mock-storage-bucket',
      VITE_MESSAGING_SENDER_ID: 'mock-messaging-sender-id',
      VITE_APP_ID: 'mock-app-id',
      VITE_MEASUREMENT_ID: 'mock-measurement-id',
    },
  },
  writable: true,
});
