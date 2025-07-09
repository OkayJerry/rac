// libs/data-access/firebase-client/src/lib/firebase-client.spec.ts
import { jest } from '@jest/globals';

const mockInitializeApp = jest.fn();
const mockGetApps = jest.fn();
const mockGetAuth = jest.fn();
const mockConnectAuthEmulator = jest.fn();
const mockGetFirestore = jest.fn();
const mockConnectFirestoreEmulator = jest.fn();
const mockGetFunctions = jest.fn();
const mockConnectFunctionsEmulator = jest.fn();

jest.mock('firebase/app', () => ({
  initializeApp: mockInitializeApp,
  getApps: mockGetApps,
}));
jest.mock('firebase/auth', () => ({
  getAuth: mockGetAuth,
  connectAuthEmulator: mockConnectAuthEmulator,
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: mockGetFirestore,
  connectFirestoreEmulator: mockConnectFirestoreEmulator,
}));
jest.mock('firebase/functions', () => ({
  getFunctions: mockGetFunctions,
  connectFunctionsEmulator: mockConnectFunctionsEmulator,
}));

const mockProdEnv = {
  DEV: false,
  VITE_API_KEY: 'test-key',
  VITE_AUTH_DOMAIN: 'test-domain',
  VITE_PROJECT_ID: 'test-project',
};

describe('firebase-client initializer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should initialize without emulators in prod', () => {
    mockGetApps.mockReturnValue([]);
    const { initializeClientApp } = require('./firebase-client');
    initializeClientApp(mockProdEnv);

    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    expect(mockConnectAuthEmulator).not.toHaveBeenCalled();
    expect(mockConnectFirestoreEmulator).not.toHaveBeenCalled();
    expect(mockConnectFunctionsEmulator).not.toHaveBeenCalled();
  });

  it('should initialize with emulators in dev', () => {
    mockGetApps.mockReturnValue([]);
    const { initializeClientApp } = require('./firebase-client');
    initializeClientApp({ ...mockProdEnv, DEV: true });

    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    expect(mockConnectAuthEmulator).toHaveBeenCalledTimes(1);
    expect(mockConnectFirestoreEmulator).toHaveBeenCalledTimes(1);
    expect(mockConnectFunctionsEmulator).toHaveBeenCalledTimes(1);
  });

  it('should retrieve services without initializing a new app if one exists', () => {
    mockGetApps.mockReturnValue([{}]);
    const { initializeClientApp } = require('./firebase-client');
    initializeClientApp(mockProdEnv);

    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).not.toHaveBeenCalled();
    expect(mockGetAuth).toHaveBeenCalledTimes(1);
    expect(mockGetFirestore).toHaveBeenCalledTimes(1);
    expect(mockGetFunctions).toHaveBeenCalledTimes(1);
  });
});
