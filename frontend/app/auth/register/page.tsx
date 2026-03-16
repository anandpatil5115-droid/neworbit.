'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { setAccessToken, setUserInfo } from '@/lib/auth';
import { FloatingTechLogos } from '@/components/ui/floating-tech-logos';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(Math.min(4, score));
  }, [password]);

  const getStrengthColor = (index: number) => {
    if (strength <= index) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      setAccessToken(res.data.accessToken);
      setUserInfo(res.data.user);
      router.push('/subjects');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to register');
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
          <div className="md:hidden flex items-center justify-center mb-8 w-12 h-12 bg-[#0f0f0f] rounded-lg mx-auto">
             <span className="text-white font-bold text-xl">NO</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Join thousands of learners today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

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
              
              {/* Password strength meter */}
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((index) => (
                  <div 
                    key={index} 
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(index)}`} 
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-4 flex justify-center items-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/70" />
              ) : (
                <>
                  Create account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
