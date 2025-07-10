import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@rac/data-access-firebase-client';
import { AuthForm } from '@rac/features-auth';

export function App() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div>
      {/* Your existing app UI for signed-in users */}
      <h1>Welcome, {user.email}</h1>
    </div>
  );
}
