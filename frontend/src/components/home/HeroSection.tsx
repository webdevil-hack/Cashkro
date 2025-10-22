'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, Gift, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-cashkaro-primary via-cashkaro-secondary to-purple-600 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative container-custom section-padding">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Earn <span className="text-yellow-300">Cashback</span> on
            <br />
            Every Purchase
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Shop from 1000+ stores and get up to 30% cashback. 
            Plus exclusive coupons and deals to save even more!
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for stores, brands, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-6 pr-16 text-lg bg-white/95 backdrop-blur-sm border-0 text-gray-800 placeholder:text-gray-500"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-2 bottom-2 px-6 bg-cashkaro-primary hover:bg-cashkaro-primary/90"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Gift className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Partner Stores</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">₹50L+</div>
              <div className="text-white/80">Cashback Paid</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">10L+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-cashkaro-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg"
            >
              Start Shopping
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-cashkaro-primary font-semibold px-8 py-4 text-lg"
            >
              How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 mb-4">Trusted by millions of shoppers</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-sm">⭐ 4.8/5 Rating</div>
              <div className="text-sm">🔒 100% Secure</div>
              <div className="text-sm">💳 Instant Cashback</div>
              <div className="text-sm">📱 Mobile App</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}