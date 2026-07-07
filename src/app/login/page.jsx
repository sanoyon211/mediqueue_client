'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; 
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get('callbackURL') || '/';

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push(callbackURL);
    }
  }, [session, router, callbackURL]);

  const handleEmailLogin = async e => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields!');
    }

    try {
      setLoading(true);
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: callbackURL,
        },
        {
          onSuccess: () => {
            toast.success('Welcome back! Successfully logged in.');
            router.push(callbackURL);
            router.refresh();
          },
          onError: ctx => {
            toast.error(ctx.error.message || 'Invalid email or password!');
            setLoading(false);
          },
        },
      );
    } catch (err) {
      toast.error('Something went wrong. Please try again!');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: 'google',
          callbackURL: typeof window !== 'undefined' ? `${window.location.origin}${callbackURL}` : callbackURL,
        },
        {
          onSuccess: () => {
            toast.success('Logged in with Google successfully!');
            router.push(callbackURL);
          },
          onError: ctx => {
            toast.error(ctx.error.message || 'Google login failed!');
          },
        },
      );
    } catch (err) {
      toast.error('Google authentication failed!');
    }
  };

  if (isPending || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-xl relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-2 border border-blue-100 dark:border-blue-800/30">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Sign in to book experienced tutors and manage slots.
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all font-medium text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all font-medium text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/80 dark:bg-slate-900">
            Or continue with
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-3 font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-sm"
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 animate-spin border-t-transparent" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
