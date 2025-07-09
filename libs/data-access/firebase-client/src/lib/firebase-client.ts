// libs/data-access/firebase-client/src/lib/firebase-client.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyC1oSFjBMDsJ0tTHZxyOdQdVdlT1lRNhMg',
  authDomain: 'retrieval-augmented-clipboard.firebaseapp.com',
  projectId: 'retrieval-augmented-clipboard',
  storageBucket: 'retrieval-augmented-clipboard.firebasestorage.app',
  messagingSenderId: '1055063554848',
  appId: '1:1055063554848:web:e6b8ec25d54763c1cb7545',
  measurementId: 'G-6Q6NK9BVT7',
};

// Initialize
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// If running locally, point at emulators
if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
