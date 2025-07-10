// extension/src/app/app.spec.tsx
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { initializeClientApp } from '@rac/data-access-firebase-client';
import { App } from './app';

beforeAll(() => {
  // initialize Firebase (env can be mocked)
  initializeClientApp({ DEV: true, VITE_API_KEY: 'test' });
});

describe('App smoke test', () => {
  it('mounts without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // basic smoke assertion: something basic exists
    expect(container).toBeDefined();
  });
});
