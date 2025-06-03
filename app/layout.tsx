import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

// Modify font loading to use a subset of weights instead of variable font
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'] // Use specific weights instead of variable range
});

export const metadata: Metadata = {
  title: 'GiveMeThatJob - AI Interview Practice',
  description: 'Practice job interviews with AI recruiters that provide personalized feedback',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}