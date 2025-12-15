import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Settler - Financial Reconciliation Protocol',
  description: 'Open-source protocol and SDKs for financial reconciliation, transaction matching, and data synchronization',
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
