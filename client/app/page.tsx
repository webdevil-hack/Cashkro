import { Suspense } from 'react'
import { Hero } from '@/components/sections/Hero'
import { FeaturedDeals } from '@/components/sections/FeaturedDeals'
import { PopularMerchants } from '@/components/sections/PopularMerchants'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Stats } from '@/components/sections/Stats'
import { Testimonials } from '@/components/sections/Testimonials'
import { Newsletter } from '@/components/sections/Newsletter'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>
        <FeaturedDeals />
        <PopularMerchants />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}