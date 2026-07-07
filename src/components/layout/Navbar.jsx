'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import { Sun, Moon, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const getUserImage = (image, name) => {
  if (image && typeof image === 'string' && image.startsWith('http')) {
    return image;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=8B5CF6&color=fff&bold=true`;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Successfully logged out!');
          setIsProfileOpen(false);
          router.push('/');
        },
      },
    });
  };

  const isActive = path => pathname === path;

  if (!mounted) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tutors', path: '/tutors' },
  ];

  if (session) {
    navLinks.push(
      { name: 'Add Tutor', path: '/add-tutor' },
      { name: 'My Tutors', path: '/my-tutors' },
      { name: 'My Booked Sessions', path: '/my-bookings' },
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/[0.08] bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span>MediQueue</span>
          </Link>
        </div>


        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>


        <div className="flex items-center gap-4">

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} />
            )}
          </button>


          {isPending ? (
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 animate-spin border-t-transparent" />
          ) : session ? (

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 focus:outline-none"
              >
                <img
                  src={getUserImage(session.user.image, session.user.name)}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-violet-500 transition-transform cursor-pointer hover:scale-105"
                />
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

    
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-lg z-50"
                  >
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-bold truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <User size={16} className="text-violet-500" />
                        <span className="font-medium">{session.user.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-all font-semibold"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (

            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
            >
              Log in
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {session && (
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                  <img
                    src={getUserImage(session.user.image, session.user.name)}
                    alt={session.user.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-violet-500"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              )}
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-base font-semibold py-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-violet-600 dark:text-violet-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!session && (
                <Link
                  href="/login"
                  className="w-full text-center py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm mt-2 shadow-lg shadow-blue-600/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              )}
              {session && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-3 text-base font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-2 cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
