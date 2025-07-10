import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForm } from './auth';

jest.mock('@rac/data-access-firebase-client', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
}));

describe('AuthForm', () => {
  it('renders sign-in heading and toggles mode', () => {
    render(<AuthForm />);
    // This targets the <h2> element specifically
    const heading = screen.getByRole('heading', { level: 2, name: 'Sign In' });
    expect(heading).toBeVisible();

    fireEvent.click(screen.getByText('Switch to Sign Up'));

    const heading2 = screen.getByRole('heading', { level: 2, name: 'Sign Up' });
    expect(heading2).toBeVisible();
  });
});
