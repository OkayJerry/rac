// tests/mocks/client-vector-search.ts

export async function getEmbedding(text: string): Promise<number[]> {
    console.log(`[MOCK] getEmbedding called for: "${text}"`);
    return [0.1, 0.2, 0.3, 0.4, 0.5]; // Return a dummy vector instantly
  }