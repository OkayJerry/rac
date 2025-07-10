import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForm } from './auth';

jest.mock('@rac/data-access-firebase-client', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
}));

describe('<AuthForm />', () => {
  it('renders Sign In view by default', () => {
    render(<AuthForm />);
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument(); // RTL best-practice 🙂 :contentReference[oaicite:2]{index=2}
  });

  it('switches to Create Account and back without crashing', () => {
    render(<AuthForm />);

    // go to Sign-Up
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(
      screen.getByRole('heading', { name: /create account/i })
    ).toBeInTheDocument();

    // confirm-password field now exists
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    // back-link at top
    fireEvent.click(screen.getByRole('button', { name: /back to sign in/i }));
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('shows validation error for bad email', () => {
    render(<AuthForm />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText(/please enter a valid e-mail/i)).toBeVisible();
  });
});
