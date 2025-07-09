import { chromeStorage } from './chrome-storage.js';

describe('chromeStorage', () => {
  it('should work', () => {
    expect(chromeStorage()).toEqual('chrome-storage');
  });
});
