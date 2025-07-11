// apps/functions/src/test-setup.ts
// JEST Setup File
import 'cross-fetch/polyfill';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder and TextDecoder, which are expected by some
// of the Firebase and Genkit dependencies but are not globally available
// in the default Node.js test environment.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
