import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brevity — Shorten links. Track everything.',
  description: 'Production-ready URL shortener with analytics, caching, and rate limiting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
