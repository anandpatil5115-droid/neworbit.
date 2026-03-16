'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { setAccessToken, setUserInfo } from '@/lib/auth';
import { FloatingTechLogos } from '@/components/ui/floating-tech-logos';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      setUserInfo(res.data.user);
      router.push('/subjects');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* LEFT PANEL */}
      <div className="hidden md:block md:w-[60%] lg:w-[60%] relative bg-[#0f0f0f]">
        <FloatingTechLogos />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[40%] lg:w-[40%] min-h-screen flex items-center justify-center p-8 bg-white md:shadow-[-4px_0_24px_rgba(0,0,0,0.08)] z-10">
        <div className="w-full max-w-md">
          {/* Mobile Only Brand Logo */}
          <div className="md:hidden flex items-center justify-center mb-10 w-12 h-12 bg-[#0f0f0f] rounded-lg mx-auto">
             <span className="text-white font-bold text-xl">NO</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2 flex justify-center items-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/70" />
              ) : (
                <>
                  Sign in
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
            <div className="text-right mt-3">
               <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
