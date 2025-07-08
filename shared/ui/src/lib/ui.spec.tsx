import { render } from '@testing-library/react';

import RacSharedUi from './ui';

describe('RacSharedUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RacSharedUi />);
    expect(baseElement).toBeTruthy();
  });
});
