'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri'; 
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; 

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-950 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Site info */}
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span>MediQueue</span>
          </Link>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Eliminating scheduling conflicts and organizing online learning
            sessions. Find and book professional tutors effortlessly.
          </p>
        </div>

        {/* Learning Services */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Learning Services
          </h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link
                href="/tutors?subject=Mathematics"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Mathematics Tuition
              </Link>
            </li>
            <li>
              <Link
                href="/tutors?subject=Physics"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Physics & Chemistry
              </Link>
            </li>
            <li>
              <Link
                href="/tutors?subject=Computer Science"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Computer Programming
              </Link>
            </li>
            <li>
              <Link
                href="/tutors?subject=Language"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Language Learning
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              <span>Dhanmondi, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-slate-400" />
              <span>+880 1712-345678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              <span>support@mediqueue.edu</span>
            </li>
          </ul>
        </div>

        {/* Social media links */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all text-slate-500 dark:text-slate-400"
            >
              <RiTwitterXFill size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all text-slate-500 dark:text-slate-400"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all text-slate-500 dark:text-slate-400"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all text-slate-500 dark:text-slate-400"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Available Sun-Thu, 9AM-6PM
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} MediQueue. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
