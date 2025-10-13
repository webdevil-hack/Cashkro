import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CashKaro Clone - Earn Cashback on Every Purchase',
  description: 'Shop at 500+ stores, get exclusive coupons, and earn real cashback on every purchase. Join thousands of smart shoppers!',
  keywords: 'cashback, coupons, shopping, deals, discounts, online shopping',
  authors: [{ name: 'CashKaro Clone Team' }],
  openGraph: {
    title: 'CashKaro Clone - Earn Cashback on Every Purchase',
    description: 'Shop at 500+ stores, get exclusive coupons, and earn real cashback on every purchase.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CashKaro Clone - Earn Cashback on Every Purchase',
    description: 'Shop at 500+ stores, get exclusive coupons, and earn real cashback on every purchase.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}