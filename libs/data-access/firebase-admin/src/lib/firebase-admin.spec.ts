// libs/data-access/firebase-admin/src/lib/firebase-admin.spec.ts
import { jest } from '@jest/globals';

const mockInitializeApp = jest.fn();
const mockGetApps = jest.fn();
const mockApplicationDefault = jest.fn(() => 'mock-credential');

jest.mock('firebase-admin/app', () => ({
  initializeApp: mockInitializeApp,
  getApps: mockGetApps,
  applicationDefault: mockApplicationDefault,
}));

jest.mock('firebase-admin/auth');
jest.mock('firebase-admin/firestore');
jest.mock('firebase-admin/functions');

describe('firebase-admin initializer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.FUNCTIONS_EMULATOR;
    delete process.env.GCLOUD_PROJECT;
  });

  it('should initialize in prod when no app exists', () => {
    mockGetApps.mockReturnValue([]);
    const { initializeAdminApp } = require('./firebase-admin');
    initializeAdminApp();

    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledWith(undefined);
    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
  });

  it('should initialize in emulator when no app exists', () => {
    process.env.FUNCTIONS_EMULATOR = 'true';
    process.env.GCLOUD_PROJECT = 'test-proj';
    mockGetApps.mockReturnValue([]);

    const { initializeAdminApp } = require('./firebase-admin');
    initializeAdminApp();

    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledWith({
      credential: 'mock-credential',
      projectId: 'test-proj',
    });
    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
  });

  it('should not initialize if an app already exists', () => {
    mockGetApps.mockReturnValue([{}]);
    const { initializeAdminApp } = require('./firebase-admin');
    initializeAdminApp();

    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).not.toHaveBeenCalled();
  });
});
