'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication logic
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        login({ username: 'Admin', role: 'admin' });
        router.push('/');
      } else if (username === 'user' || username === '') {
        login({ username: username || 'Guest', role: 'public' });
        router.push('/');
      } else {
        setError('Invalid credentials. Use "admin/admin" for admin access.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl premium-gradient shadow-2xl mb-6 flex items-center justify-center text-white scale-110 rotate-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3c1.268 0 2.39.246 3.411.696L14.444 4.5h.556a.5.5 0 00.5-.5V2.5a.5.5 0 00-.5-.5h-1a1.5 1.5 0 00-1.5 1.5v.5h-1v-.5a1.5 1.5 0 00-1.5-1.5h-1A1.5 1.5 0 008 2.5v1.5a.5.5 0 00.5.5h.556l-1.033 1.033A10.026 10.026 0 002.5 11c0 .875.12 1.722.342 2.525M12 11a9 9 0 11-9 9m9-9c1.268 0 2.39.246 3.411.696m0 0A9.986 9.986 0 0115 11" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Welcome Back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Please sign in to your project portal.</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-white/50 dark:border-zinc-800/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or guest"
                className="w-full px-6 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center animate-shake">
                {error}
              </p>
            )}

            <button
              disabled={isLoading}
              className={`w-full py-5 premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-[0.98] flex items-center justify-center ${isLoading ? 'opacity-80' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In & Dive In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <button 
              onClick={() => { setUsername('admin'); setPassword('admin'); }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors"
            >
              Demo Admin Login
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-4 delay-500 duration-1000">
           <button 
            onClick={() => router.push('/')}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center justify-center gap-2 mx-auto"
           >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return Home
           </button>
        </div>
      </div>
    </div>
  );
}
