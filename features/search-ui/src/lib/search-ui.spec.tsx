import { render } from '@testing-library/react';

import RacFeaturesSearchUi from './search-ui';

describe('RacFeaturesSearchUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RacFeaturesSearchUi />);
    expect(baseElement).toBeTruthy();
  });
});
