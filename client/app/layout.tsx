import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CashKaro Clone - Earn Cashback on Every Purchase',
  description: 'Shop at your favorite stores and earn cashback on every purchase. Get the best deals, coupons, and cashback offers from top merchants.',
  keywords: 'cashback, shopping, deals, coupons, savings, online shopping',
  authors: [{ name: 'CashKaro Clone Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CashKaro Clone - Earn Cashback on Every Purchase',
    description: 'Shop at your favorite stores and earn cashback on every purchase.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CashKaro Clone - Earn Cashback on Every Purchase',
    description: 'Shop at your favorite stores and earn cashback on every purchase.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}