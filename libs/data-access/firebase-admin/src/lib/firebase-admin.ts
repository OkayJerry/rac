// libs/data-access/firebase-admin/src/lib/firebase-admin.ts
import {
  initializeApp,
  getApps,
  applicationDefault,
  App,
} from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getFunctions, Functions } from 'firebase-admin/functions';

export let adminAuth: Auth;
export let adminDb: Firestore;
export let adminFunctions: Functions;

export function initializeAdminApp() {
  const existingApps = getApps();
  let app: App;

  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    const options = process.env.FUNCTIONS_EMULATOR
      ? {
          credential: applicationDefault(),
          projectId: process.env.GCLOUD_PROJECT,
        }
      : undefined;
    app = initializeApp(options);
  }

  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
  adminFunctions = getFunctions(app);
}
