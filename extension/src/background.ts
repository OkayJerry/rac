// extension/src/background.ts
console.log('🚀 Background service worker running');

// Example: listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('🔧 Extension installed or updated');
});
