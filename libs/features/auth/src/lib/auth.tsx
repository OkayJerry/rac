// libs/features/auth/src/lib/auth.tsx
import { useState } from 'react';
import {
  Label,
  TextInput,
  Button,
  Checkbox,
  HelperText,
  Spinner,
} from 'flowbite-react';
import { auth } from '@rac/data-access-firebase-client';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

/* Lucide icons via react-icons/lu */
import {
  Mail,
  KeyIcon, // closed key (sign-in password)
  LockOpenIcon, // open lock (sign-up password)
  LockIcon, // closed lock (sign-up confirm)
} from 'lucide-react';

export function AuthForm() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [keepMe, setKeepMe] = useState(false);

  /* ---------- validation ---------- */
  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const pwdValid = pwd.length >= 6;
  const confirmValid = mode === 'signIn' ? true : pwd === confirmPwd;

  const formValid = emailValid && pwdValid && confirmValid && !busy;

  const emailColor = email ? (emailValid ? 'success' : 'failure') : undefined;
  const pwdColor = pwd ? (pwdValid ? 'success' : 'failure') : undefined;
  const confirmColor =
    mode === 'signUp' && confirmPwd
      ? confirmValid
        ? 'success'
        : 'failure'
      : undefined;

  /* ---------- submit ---------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;
    setBusy(true);
    setErr(null);
    try {
      mode === 'signIn'
        ? await signInWithEmailAndPassword(auth, email, pwd)
        : await createUserWithEmailAndPassword(auth, email, pwd);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  function switchTo(modeTo: 'signIn' | 'signUp') {
    setMode(modeTo);
    setErr(null);
    setConfirmPwd('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4"
    >
      {/* back link (sign-up only) */}
      {mode === 'signUp' && (
        <Button
          color="light"
          size="xs"
          className="-mb-2 w-max self-start"
          type="button"
          onClick={() => switchTo('signIn')}
        >
          ← Back to Sign In
        </Button>
      )}

      <h2 className="text-center text-2xl font-semibold">
        {mode === 'signIn' ? 'Sign In' : 'Create Account'}
      </h2>

      {/* email */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="auth-email" color={emailColor}>
            Email
          </Label>
        </div>
        <TextInput
          id="auth-email"
          type="email"
          placeholder="name@example.com"
          required
          shadow
          color={emailColor}
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && !emailValid && (
          <HelperText color="failure">
            Please enter a valid e-mail address
          </HelperText>
        )}
      </div>

      {/* password */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="auth-pwd" color={pwdColor}>
            Password
          </Label>
        </div>
        <TextInput
          id="auth-pwd"
          type="password"
          required
          shadow
          color={pwdColor}
          /* Key icon for sign-in, open-lock for sign-up */
          icon={mode === 'signIn' ? KeyIcon : LockOpenIcon}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        {pwd && !pwdValid && (
          <HelperText color="failure">
            Password must be at least 6 characters
          </HelperText>
        )}
      </div>

      {/* confirm password (sign-up only) */}
      {mode === 'signUp' && (
        <div>
          <div className="mb-2 block">
            <Label htmlFor="auth-confirm" color={confirmColor}>
              Confirm Password
            </Label>
          </div>
          <TextInput
            id="auth-confirm"
            type="password"
            required
            shadow
            color={confirmColor}
            icon={LockIcon}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
          {confirmPwd && !confirmValid && (
            <HelperText color="failure">Passwords do not match</HelperText>
          )}
        </div>
      )}

      {/* remember-me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={keepMe}
          onChange={() => setKeepMe((v) => !v)}
        />
        <Label htmlFor="remember">Remember me</Label>
      </div>

      {/* Firebase error */}
      {err && (
        <HelperText color="failure">
          <span className="font-medium">Oops!</span> {err}
        </HelperText>
      )}

      {/* submit */}
      <Button color="blue" type="submit" disabled={!formValid}>
        {busy && <Spinner size="sm" className="mr-2" />}
        {mode === 'signIn' ? 'Sign In' : 'Register new account'}
      </Button>

      {/* bottom toggle (sign-in only) */}
      {mode === 'signIn' && (
        <Button color="light" type="button" onClick={() => switchTo('signUp')}>
          Don&apos;t have an account? Sign up
        </Button>
      )}
    </form>
  );
}

export default AuthForm;
