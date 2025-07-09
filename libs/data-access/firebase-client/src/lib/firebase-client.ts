// libs/data-access/firebase-client/src/lib/firebase-client.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  getFunctions,
  Functions,
  connectFunctionsEmulator,
} from 'firebase/functions';

export let app: FirebaseApp;
export let auth: Auth;
export let db: Firestore;
export let functions: Functions;

function getFirebaseConfig(env: Record<string, string>) {
  return {
    apiKey: env.VITE_API_KEY ?? '',
    authDomain: env.VITE_AUTH_DOMAIN ?? '',
    projectId: env.VITE_PROJECT_ID ?? '',
    storageBucket: env.VITE_STORAGE_BUCKET ?? '',
    messagingSenderId: env.VITE_MESSAGING_SENDER_ID ?? '',
    appId: env.VITE_APP_ID ?? '',
    measurementId: env.VITE_MEASUREMENT_ID ?? '',
  };
}

export function initializeClientApp(env: Record<string, any>) {
  const existingApps = getApps();

  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    const config = getFirebaseConfig(env);
    app = initializeApp(config);
  }

  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);

  if (env.DEV) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  }
}
