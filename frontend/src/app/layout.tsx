import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CashKaro Clone - Earn Cashback on Every Purchase',
  description: 'Get cashback and coupons from 1000+ stores. Save money on every online purchase with our cashback platform.',
  keywords: 'cashback, coupons, deals, online shopping, save money, discounts',
  authors: [{ name: 'CashKaro Clone Team' }],
  openGraph: {
    title: 'CashKaro Clone - Earn Cashback on Every Purchase',
    description: 'Get cashback and coupons from 1000+ stores. Save money on every online purchase.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CashKaro Clone',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CashKaro Clone - Earn Cashback on Every Purchase',
    description: 'Get cashback and coupons from 1000+ stores. Save money on every online purchase.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
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