// apps/functions/src/index.spec.ts
import { z } from 'zod'; // Import the real Zod to pass it through our mock
// Use a CJS-style require for compatibility with the test SDK.
const functionsTest = require('firebase-functions-test');

// Initialize the SDK in offline mode.
const testEnv = functionsTest();

// Mock onCallGenkit to prevent it from running during test setup.
// This is the key to fixing the error, as it avoids the need to perfectly
// mock the 'name' property of a Genkit flow object.
jest.mock('firebase-functions/v2/https', () => ({
  ...jest.requireActual('firebase-functions/v2/https'), // Keep other exports like onRequest
  onCallGenkit: jest.fn(),
}));

// Mock the Genkit AI object and its methods before importing the functions file.
const mockEmbed = jest.fn();
const mockFlowRun = jest.fn();
jest.mock('genkit', () => ({
  // Provide a mock for the main 'genkit()' function.
  genkit: () => ({
    // Mock the methods on the 'ai' object that we need to control.
    defineFlow: (config: any, implementation: any) => {
      // Since onCallGenkit is mocked, we only need to return a function
      // that has a `.run` method for our spy to attach to.
      const mockFlow = (...args: any[]) => implementation(...args);
      (mockFlow as any).run = implementation;
      return mockFlow;
    },
    embed: mockEmbed,
  }),
  // Also, pass through the real 'zod' object. The @genkit-ai/vertexai plugin
  // depends on this being available when it's imported.
  z,
}));

// Import the functions we want to test AFTER the mocks are in place.
import * as index from './index';
// Import the logger to spy on it and suppress output.
import { logger } from 'firebase-functions';

// Mock the entire 'firebase-admin/firestore' module to simulate Firestore interactions.
const mockFindNearest = jest.fn();
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue(true),
      findNearest: mockFindNearest, // Mock the new findNearest method
    })),
  })),
  FieldValue: {
    vector: (arr: number[]) => arr,
  },
}));

// Partially mock the './index' module to spy on the .run() method of the embedder flow.
jest.spyOn(index.knowledgeBaseEmbedder, 'run').mockImplementation(mockFlowRun);

// Suppress log output during tests.
jest.spyOn(logger, 'info').mockImplementation();
jest.spyOn(logger, 'log').mockImplementation();
jest.spyOn(logger, 'warn').mockImplementation();

describe('Cloud Functions', () => {
  afterEach(() => {
    // Clear all mock histories after each test.
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Clean up the test environment.
    testEnv.cleanup();
  });

  describe('onKnowledgeBaseCreate', () => {
    it('should call the knowledgeBaseEmbedder flow with document data', async () => {
      // Arrange
      const snap = testEnv.firestore.makeDocumentSnapshot(
        { content: 'This is the content to be embedded.' },
        'knowledge_bases/test-doc-123'
      );
      const wrapped = testEnv.wrap(index.onKnowledgeBaseCreate);

      // Act
      await wrapped(snap);

      // Assert
      expect(mockFlowRun).toHaveBeenCalledTimes(1);
      expect(mockFlowRun).toHaveBeenCalledWith({
        docId: 'test-doc-123',
        content: 'This is the content to be embedded.',
      });
    });
  });

  describe('searchKnowledgeBaseFlow', () => {
    it('should embed a query and perform a vector search with a custom limit', async () => {
      // Arrange: Mock the results from the AI embedding and Firestore query.
      mockEmbed.mockResolvedValue([
        { embedding: [0.1, 0.2, 0.3] }, // Mock query vector
      ]);
      mockFindNearest.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: [
            { id: 'doc1', data: () => ({ content: 'result one' }) },
            { id: 'doc2', data: () => ({ content: 'result two' }) },
          ],
        }),
      });

      const query = 'find similar documents';
      // Use the 'topN' parameter for the test.
      const topN = 2;

      // Act: Run the search flow directly, passing 'topN'.
      const results = await index.searchKnowledgeBaseFlow({ query, topN });

      // Assert: Verify that the embedding and search were performed correctly.
      expect(mockEmbed).toHaveBeenCalledWith({
        embedder: expect.any(Object), // textEmbedding004
        content: query,
      });
      // Assert that the 'limit' option passed to findNearest matches 'topN'.
      expect(mockFindNearest).toHaveBeenCalledWith(
        'embedding',
        [0.1, 0.2, 0.3], // The mocked query vector
        { limit: topN, distanceMeasure: 'COSINE' }
      );
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({ id: 'doc1', content: 'result one' });
    });
  });

  describe('helloWorld', () => {
    it('should send a hello message', () => {
      const mockReq = {} as any;
      const mockRes = { send: jest.fn() } as any;
      index.helloWorld(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith(
        'Hello from Firebase - Generated by @nx-toolkits/firebase!'
      );
    });
  });
});
