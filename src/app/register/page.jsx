'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Image,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleRegister = async e => {
    e.preventDefault();

    if (!name || !email || !photoUrl || !password) {
      return toast.error('Please fill in all fields!');
    }

    if (!isPasswordValid) {
      return toast.error('Please meet all password strength requirements!');
    }

    try {
      setLoading(true);
      await authClient.signUp.email(
        {
          email,
          password,
          name,
          image: photoUrl,
          callbackURL: '/',
        },
        {
          onSuccess: () => {
            toast.success('Account created successfully! Welcome aboard.');
            router.push('/');
            router.refresh();
          },
          onError: ctx => {
            toast.error(ctx.error.message || 'Registration failed. Try again!');
            setLoading(false);
          },
        },
      );
    } catch (err) {
      toast.error('An error occurred during registration!');
      setLoading(false);
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
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-6 py-12 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 shadow-xl relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-500 mb-2">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Create Account
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Join MediQueue today to schedule private tutoring sessions.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-medium text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-medium text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Photo URL
            </label>
            <div className="relative">
              <Image
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-medium text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-medium text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>
          </div>

          {/* 🎯 Real-time Password Strength Indicators */}
          {password.length > 0 && (
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl space-y-2 text-xs font-semibold">
              <p className="text-zinc-500 font-bold mb-1">
                Password Requirements:
              </p>

              <div className="flex items-center gap-1.5 transition-all">
                {hasMinLength ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <X size={14} className="text-red-500" />
                )}
                <span
                  className={
                    hasMinLength
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500'
                  }
                >
                  Minimum 6 characters
                </span>
              </div>

              <div className="flex items-center gap-1.5 transition-all">
                {hasUpperCase ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <X size={14} className="text-red-500" />
                )}
                <span
                  className={
                    hasUpperCase
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500'
                  }
                >
                  At least 1 uppercase letter
                </span>
              </div>

              <div className="flex items-center gap-1.5 transition-all">
                {hasLowerCase ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <X size={14} className="text-red-500" />
                )}
                <span
                  className={
                    hasLowerCase
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500'
                  }
                >
                  At least 1 lowercase letter
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6 font-medium">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-violet-500 hover:text-violet-600 font-bold hover:underline transition-all"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
