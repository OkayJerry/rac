// libs/data-access/firebase-client/src/lib/firebase-client.spec.ts

// Mock the Firebase modules
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/functions');

describe('Firebase Client Initialization', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset the module cache before each test
    jest.resetModules();

    // Mock window.location for a "production" environment by default
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, hostname: 'production.host' },
    });
  });

  afterAll(() => {
    // Restore the original location object
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('should initialize Firebase services for production', async () => {
    // 1. Execute the module code
    await import('./firebase-client.js');

    // 2. Get the fresh mocks AFTER the module has been loaded
    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const {
      getFirestore,
      connectFirestoreEmulator,
    } = require('firebase/firestore');
    const {
      getFunctions,
      connectFunctionsEmulator,
    } = require('firebase/functions');

    // 3. Assert against the new mocks
    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(getFirestore).toHaveBeenCalledTimes(1);
    expect(getFunctions).toHaveBeenCalledTimes(1);

    // Verify emulators are NOT connected
    expect(connectFirestoreEmulator).not.toHaveBeenCalled();
    expect(connectFunctionsEmulator).not.toHaveBeenCalled();
  });

  it('should connect to emulators when running locally', async () => {
    // Set hostname to localhost to trigger emulator logic
    Object.defineProperty(window.location, 'hostname', {
      value: 'localhost',
    });

    // 1. Execute the module code
    await import('./firebase-client.js');

    // 2. Get the fresh mocks AFTER the module has been loaded
    const { initializeApp } = require('firebase/app');
    const { connectFirestoreEmulator } = require('firebase/firestore');
    const { connectFunctionsEmulator } = require('firebase/functions');

    // 3. Assert against the new mocks
    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(connectFirestoreEmulator).toHaveBeenCalledTimes(1);
    expect(connectFunctionsEmulator).toHaveBeenCalledTimes(1);
  });
});
