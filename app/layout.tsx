import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE FINALS - Ranked Leaderboard',
  description: 'Professional ranked leaderboard for THE FINALS. Track top players, view rank distributions, and analyze competitive stats.',
  keywords: ['THE FINALS', 'leaderboard', 'ranked', 'esports', 'competitive', 'tracker'],
  authors: [{ name: 'TF Companion' }],
  openGraph: {
    title: 'THE FINALS - Ranked Leaderboard',
    description: 'Professional ranked leaderboard for THE FINALS',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
