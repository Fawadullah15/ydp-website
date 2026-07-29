import Link from 'next/link';
import React from 'react';

export default function ResetPasswordPage() {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1B2A6B] mb-2">Reset Password</h1>
        <p className="text-gray-500">Enter your email to receive reset instructions</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent outline-none transition-all"
            placeholder="admin@ydp.org"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-[#1B2A6B] text-white py-2.5 rounded-lg font-medium hover:bg-[#1B2A6B]/90 transition-colors"
        >
          Send Reset Link
        </button>

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-600 hover:text-[#1B2A6B]">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
