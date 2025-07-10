import React, { useState } from 'react';
import { auth } from '@rac/data-access-firebase-client';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (mode === 'signIn') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>{mode === 'signIn' ? 'Sign In' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">
        {mode === 'signIn' ? 'Sign In' : 'Register'}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
      >
        {mode === 'signIn' ? 'Switch to Sign Up' : 'Switch to Sign In'}
      </button>
    </form>
  );
}
