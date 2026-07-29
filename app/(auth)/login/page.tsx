"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1B2A6B] mb-2">Welcome Back</h1>
        <p className="text-gray-500">Sign in to YDP Admin Portal</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent outline-none transition-all"
            placeholder="admin@ydp.pk"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link href="/reset-password" className="text-sm text-[#00BCD4] hover:underline">
              Forgot password?
            </Link>
          </div>
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="remember" className="w-4 h-4 text-[#1B2A6B] rounded border-gray-300" />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1B2A6B] text-white py-2.5 rounded-lg font-medium hover:bg-[#1B2A6B]/90 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
