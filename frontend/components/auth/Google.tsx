'use client';

import { useEffect } from 'react';
import { loginWithGoogle } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { GoogleButton } from './GoogleButton';

declare global {
  interface Window {
    google: any;
  }
}

export function Google() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleResponse,
    });
  }, []);

  async function handleGoogleResponse(response: any) {
    try {
      const idToken = response.credential;

      const data = await loginWithGoogle({ idToken });

      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      console.error('Google login failed', err);
    }
  }

  function handleGoogleLogin() {
    console.log('Google button clicked');
    window.google.accounts.id.prompt();
  }

  return <GoogleButton onClick={handleGoogleLogin} />;
}
