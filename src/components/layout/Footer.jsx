'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri'; 
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; 

export default function Footer() {
  return (
    <footer className="border-t border-divider bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Site info */}
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-2xl tracking-wider bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent group"
          >
            <img src="/logo.png" alt="MediQueue Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-200" />
            <span>MediQueue</span>
          </Link>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Eliminating scheduling conflicts and organizing online learning
            sessions. Find and book professional tutors effortlessly.
          </p>
        </div>

        {/* Learning Services */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-violet-500">
            Learning Services
          </h4>
          <ul className="space-y-2 text-sm text-foreground/75">
            <li>
              <Link
                href="/tutors?subject=Mathematics"
                className="hover:text-violet-500 transition-colors"
              >
                Mathematics Tuition
              </Link>
            </li>
            <li>
              <Link
                href="/tutors?subject=Physics"
                className="hover:text-violet-500 transition-colors"
              >
                Physics & Chemistry
              </Link>
            </li>
            <li>
              <Link
                href="/tutors?subject=Computer Science"
                className="hover:text-violet-500 transition-colors"
              >
                Computer Programming
              </Link>
            </li>
            <li>
              <Link
                href="/tutors?subject=Language"
                className="hover:text-violet-500 transition-colors"
              >
                Language Learning
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-violet-500">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-foreground/75">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-violet-500" />
              <span>Dhanmondi, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-violet-500" />
              <span>+880 1712-345678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-violet-500" />
              <span>support@mediqueue.edu</span>
            </li>
          </ul>
        </div>

        {/* Social media links */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-violet-500">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-divider hover:border-violet-500 hover:text-violet-500 transition-all text-foreground"
            >
              <RiTwitterXFill size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-divider hover:border-violet-500 hover:text-violet-500 transition-all text-foreground"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-divider hover:border-violet-500 hover:text-violet-500 transition-all text-foreground"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-divider hover:border-violet-500 hover:text-violet-500 transition-all text-foreground"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
          <p className="text-xs text-foreground/50">
            Available Sun-Thu, 9AM-6PM
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
        <p>&copy; {new Date().getFullYear()} MediQueue. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
