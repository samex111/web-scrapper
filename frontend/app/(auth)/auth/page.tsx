'use client';


import { Google } from '@/components/auth/Google';

export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* Google Sign-In */}
      <Google />

     
    </div>
  );
}