import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedStores } from '@/components/home/FeaturedStores'
import { TopCategories } from '@/components/home/TopCategories'
import { HowItWorks } from '@/components/home/HowItWorks'
import { TodaysDeals } from '@/components/home/TodaysDeals'
import { Stats } from '@/components/home/Stats'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <Stats />
        <FeaturedStores />
        <TopCategories />
        <TodaysDeals />
        <HowItWorks />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}