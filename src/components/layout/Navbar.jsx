'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import { Sun, Moon, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button, Avatar } from '@heroui/react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="font-bold text-2xl tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent"
          >
            MediQueue
          </Link>
        </div>

        {/* Desktop Navigation Links */}
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

        {/* Right-side Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggler Button */}
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

          {/* User Section (Better Auth Integrated) */}
          {isPending ? (
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 animate-spin border-t-transparent" />
          ) : session ? (
            /* Profile Dropdown Container */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 focus:outline-none"
              >
                <Avatar
                  isBordered
                  className="w-8 h-8 border-violet-500 transition-transform cursor-pointer"
                  color="secondary"
                  name={session.user.name}
                  src={session.user.image}
                />
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

              {/* Framer-Motion Animated Profile Dropdown Card */}
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
            <Button
              as={Link}
              href="/login"
              color="secondary"
              variant="flat"
              className="font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 hover:bg-violet-500/25"
            >
              Login
            </Button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown (Framer-Motion Animated) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
