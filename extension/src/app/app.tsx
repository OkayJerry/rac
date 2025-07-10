// extension/src/app/app.tsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@rac/data-access-firebase-client';
import { AuthForm } from '@rac/features-auth';
import { signOut } from 'firebase/auth';
import { Button, Spinner } from 'flowbite-react';

export function App() {
  const [user, loading] = useAuthState(auth);

  // While the auth state is loading, it's good practice to show a loading indicator.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // If there's no user, show the authentication form.
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <AuthForm />
      </div>
    );
  }

  // If the user is signed in, show the welcome message and a sign-out button.
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <Button color="light" onClick={() => signOut(auth)}>
          Sign Out
        </Button>
      </div>
      {/* Your existing app UI for signed-in users can go here */}
    </div>
  );
}
