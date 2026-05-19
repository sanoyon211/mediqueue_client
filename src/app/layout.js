import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MediQueue - Tutor Booking System',
  description: 'Book qualified tutors instantly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground transition-colors duration-350`}
      >
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">{children}</main>

            <Footer />
          </div>

          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className:
                'dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800 font-semibold text-sm rounded-xl',
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
