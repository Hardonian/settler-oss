import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Settler Console - Managed Operations',
  description: 'Licensed SaaS management layer for Settler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
