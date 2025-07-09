import { geminiClient } from './gemini-client.js';

describe('geminiClient', () => {
  it('should work', () => {
    expect(geminiClient()).toEqual('gemini-client');
  });
});
