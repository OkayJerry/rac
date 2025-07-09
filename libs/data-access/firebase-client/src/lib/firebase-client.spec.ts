import { firebaseClient } from './firebase-client.js';

describe('firebaseClient', () => {
  it('should work', () => {
    expect(firebaseClient()).toEqual('firebase-client');
  });
});
