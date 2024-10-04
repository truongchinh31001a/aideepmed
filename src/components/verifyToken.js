import { getAuth } from 'firebase/auth';

async function verifyToken() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken();

    const response = await fetch('/api/auth/verifyToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
  }
}

export {verifyToken};