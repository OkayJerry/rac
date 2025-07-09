import { firebaseAdmin } from './firebase-admin.js';

describe('firebaseAdmin', () => {
  it('should work', () => {
    expect(firebaseAdmin()).toEqual('firebase-admin');
  });
});
