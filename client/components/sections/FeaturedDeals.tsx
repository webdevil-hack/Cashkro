'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface Deal {
  _id: string
  title: string
  description: string
  type: 'cashback' | 'coupon' | 'offer' | 'sale'
  cashbackRate?: number
  cashbackAmount?: number
  discountPercentage?: number
  discountAmount?: number
  validUntil: string
  merchant: {
    _id: string
    name: string
    logo: string
  }
  image?: string
  isFeatured: boolean
  clickCount: number
}

export function FeaturedDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDeals: Deal[] = [
      {
        _id: '1',
        title: 'Up to 15% Cashback on Electronics',
        description: 'Get amazing cashback on all electronics from top brands',
        type: 'cashback',
        cashbackRate: 15,
        validUntil: '2024-02-29',
        merchant: {
          _id: '1',
          name: 'Amazon',
          logo: 'https://via.placeholder.com/60x60?text=A'
        },
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 1250
      },
      {
        _id: '2',
        title: 'Flat ₹500 Off on Fashion',
        description: 'Get flat discount on your favorite fashion brands',
        type: 'coupon',
        discountAmount: 500,
        validUntil: '2024-02-25',
        merchant: {
          _id: '2',
          name: 'Myntra',
          logo: 'https://via.placeholder.com/60x60?text=M'
        },
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 980
      },
      {
        _id: '3',
        title: '20% Off + 5% Cashback',
        description: 'Double savings on home and garden products',
        type: 'offer',
        discountPercentage: 20,
        cashbackRate: 5,
        validUntil: '2024-03-05',
        merchant: {
          _id: '3',
          name: 'Flipkart',
          logo: 'https://via.placeholder.com/60x60?text=F'
        },
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 2100
      },
      {
        _id: '4',
        title: 'Up to ₹1000 Cashback on Travel',
        description: 'Book your next trip and earn cashback',
        type: 'cashback',
        cashbackAmount: 1000,
        validUntil: '2024-03-15',
        merchant: {
          _id: '4',
          name: 'MakeMyTrip',
          logo: 'https://via.placeholder.com/60x60?text=MMT'
        },
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 750
      },
      {
        _id: '5',
        title: '30% Off on Beauty Products',
        description: 'Pamper yourself with amazing beauty deals',
        type: 'sale',
        discountPercentage: 30,
        validUntil: '2024-02-28',
        merchant: {
          _id: '5',
          name: 'Nykaa',
          logo: 'https://via.placeholder.com/60x60?text=N'
        },
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 1650
      },
      {
        _id: '6',
        title: 'Flat ₹200 Off on Food Orders',
        description: 'Order your favorite food and save more',
        type: 'coupon',
        discountAmount: 200,
        validUntil: '2024-03-01',
        merchant: {
          _id: '6',
          name: 'Zomato',
          logo: 'https://via.placeholder.com/60x60?text=Z'
        },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 3200
      }
    ]

    setTimeout(() => {
      setDeals(mockDeals)
      setLoading(false)
    }, 1000)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(deals.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(deals.length / 3)) % Math.ceil(deals.length / 3))
  }

  const getDealValue = (deal: Deal) => {
    if (deal.cashbackRate) return `${deal.cashbackRate}% Cashback`
    if (deal.cashbackAmount) return `₹${deal.cashbackAmount} Cashback`
    if (deal.discountPercentage) return `${deal.discountPercentage}% Off`
    if (deal.discountAmount) return `₹${deal.discountAmount} Off`
    return 'Special Offer'
  }

  const getTimeRemaining = (validUntil: string) => {
    const now = new Date()
    const end = new Date(validUntil)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Deals</h2>
            <p className="text-lg text-gray-600">Discover amazing cashback offers from top merchants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Deals</h2>
          <p className="text-lg text-gray-600">Discover amazing cashback offers from top merchants</p>
        </div>

        <div className="relative">
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal._id} className="card hover-lift group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-primary">
                      {getDealValue(deal)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="badge bg-black bg-opacity-50 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeRemaining(deal.validUntil)}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="flex items-center mb-3">
                    <img
                      src={deal.merchant.logo}
                      alt={deal.merchant.name}
                      className="w-8 h-8 rounded-lg mr-3"
                    />
                    <span className="font-medium text-gray-900">{deal.merchant.name}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {deal.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {deal.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{deal.clickCount} clicks</span>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/deals/${deal._id}`}>
                        Get Deal
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {deals.map((deal) => (
                  <div key={deal._id} className="w-full flex-shrink-0 px-2">
                    <div className="card hover-lift group">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="badge badge-primary">
                            {getDealValue(deal)}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="badge bg-black bg-opacity-50 text-white">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeRemaining(deal.validUntil)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <div className="flex items-center mb-3">
                          <img
                            src={deal.merchant.logo}
                            alt={deal.merchant.name}
                            className="w-8 h-8 rounded-lg mr-3"
                          />
                          <span className="font-medium text-gray-900">{deal.merchant.name}</span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {deal.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {deal.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{deal.clickCount} clicks</span>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/deals/${deal._id}`}>
                              Get Deal
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex space-x-1">
                {[...Array(Math.ceil(deals.length / 1))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === currentSlide ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === Math.ceil(deals.length / 1) - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/deals">View All Deals</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}