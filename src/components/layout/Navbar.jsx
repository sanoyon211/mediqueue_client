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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-2xl tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent group"
          >
            <img src="/logo.png" alt="MediQueue Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-200" />
            <span>MediQueue</span>
          </Link>
        </div>


        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-semibold transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-violet-600 dark:text-violet-400 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>


        <div className="flex items-center gap-4">

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
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
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 hover:bg-violet-500 hover:text-white transition-all duration-300 shadow-sm shadow-violet-500/5 hover:shadow-violet-500/15 hover:-translate-y-0.5"
            >
              Login
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
                  className="w-full text-center py-3 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all text-sm mt-2 shadow-md shadow-violet-500/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
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
