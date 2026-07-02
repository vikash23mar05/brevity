'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to log in');
      }

      router.push('/dashboard');
      router.refresh(); // Force refresh to apply cookies
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
      <div className="w-full max-w-[420px] bg-white border border-[#e8e8e8] rounded-[12px] p-11 shadow-sm">
        <Link href="/" className="block text-[13px] font-extrabold tracking-[0.12em] uppercase text-black mb-8 no-underline">
          Brevity
        </Link>

        <h1 className="text-[24px] font-extrabold text-black mb-1.5">Welcome back</h1>
        <p className="text-[14px] text-[#555] mb-8">Log in to your account to manage your links.</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[12px] font-semibold text-[#111] mb-1.5 tracking-[0.02em]" htmlFor="email">Email</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="16" width="16" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]">
                <path stroke="currentColor" d="m0.5 6.5 11.375 7h0.25l11.375 -7m0 -2.5v16.5H23c-3 -0.5 -8 -0.75 -11 -0.75S4 20 1 20.5H0.5V4c3 -0.5 8.5 -0.75 11.5 -0.75s8.5 0.25 11.5 0.75Z" strokeWidth="1.5"></path>
              </svg>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[14px] text-black bg-white border-[1.5px] border-[#e8e8e8] rounded-[7px] pl-10 pr-3.5 py-2.5 outline-none focus:border-[#2233ee] transition-colors" 
                placeholder="you@example.com" 
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[12px] font-semibold text-[#111] mb-1.5 tracking-[0.02em]" htmlFor="password">Password</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="16" width="16" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]">
                <path stroke="currentColor" d="M6.5 10.5V6a5.5 5.5 0 1 1 11 0v4.5M12 15v4m8.5 4.5h-17v-0.25l0.075 -0.327a26.342 26.342 0 0 0 0 -11.846L3.5 10.75v-0.25h17v0.25l-0.075 0.327a26.34 26.34 0 0 0 0 11.846l0.075 0.327v0.25Z" strokeWidth="1.5"></path>
              </svg>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-[14px] text-black bg-white border-[1.5px] border-[#e8e8e8] rounded-[7px] pl-10 pr-3.5 py-2.5 outline-none focus:border-[#2233ee] transition-colors" 
                placeholder="••••••••" 
                required
              />
            </div>
            <a href="#" className="block text-right text-[12px] font-medium text-[#999] hover:text-[#2233ee] mt-1.5 no-underline">Forgot password?</a>
          </div>

          {error && <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center text-[13px] font-semibold text-white bg-black border-[1.5px] border-black rounded-[7px] px-5 py-2.5 hover:bg-[#2233ee] hover:border-[#2233ee] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-[13px] text-[#555] text-center mt-6">
          Don't have an account? <Link href="/register" className="text-black font-semibold hover:text-[#2233ee]">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
