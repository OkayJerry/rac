// src/spy.ts

const originalFetch = globalThis.fetch;

globalThis.fetch = async (...args) => {
  const url = args[0] instanceof URL ? args[0].href : String(args[0]);
  
  // Log every fetch request the extension makes
  console.log('[SPY] Fetching resource:', url);

  return originalFetch(...args);
};