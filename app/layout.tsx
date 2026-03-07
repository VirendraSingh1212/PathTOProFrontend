import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './motion.css';
import Navbar from '@/components/Navbar/Navbar';
import LMSChatbot from '@/components/LMSChatbot';

import AuthInitializer from '@/components/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PathToPro',
  description: 'Learning Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer>
          <div className="flex flex-col min-h-screen bg-gray-50/50">
            <Navbar />
            <main className="flex-1 page-enter">
              {children}
            </main>
            <LMSChatbot />
          </div>
        </AuthInitializer>
      </body>
    </html>
  );
}
