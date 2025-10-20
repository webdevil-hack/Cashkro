'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Merchant {
  _id: string
  name: string
  logo: string
  category: string
  cashbackRate: number
  description: string
  isPopular: boolean
  stats: {
    totalUsers: number
    averageRating: number
  }
}

export function PopularMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMerchants: Merchant[] = [
      {
        _id: '1',
        name: 'Amazon',
        logo: 'https://via.placeholder.com/80x80?text=A',
        category: 'Electronics',
        cashbackRate: 12,
        description: 'Everything you need, delivered to your doorstep',
        isPopular: true,
        stats: {
          totalUsers: 2500000,
          averageRating: 4.8
        }
      },
      {
        _id: '2',
        name: 'Myntra',
        logo: 'https://via.placeholder.com/80x80?text=M',
        category: 'Fashion',
        cashbackRate: 8,
        description: 'Fashion and lifestyle for everyone',
        isPopular: true,
        stats: {
          totalUsers: 1800000,
          averageRating: 4.6
        }
      },
      {
        _id: '3',
        name: 'Flipkart',
        logo: 'https://via.placeholder.com/80x80?text=F',
        category: 'General',
        cashbackRate: 10,
        description: 'India\'s leading e-commerce platform',
        isPopular: true,
        stats: {
          totalUsers: 3200000,
          averageRating: 4.7
        }
      },
      {
        _id: '4',
        name: 'MakeMyTrip',
        logo: 'https://via.placeholder.com/80x80?text=MMT',
        category: 'Travel',
        cashbackRate: 15,
        description: 'Book flights, hotels, and more',
        isPopular: true,
        stats: {
          totalUsers: 950000,
          averageRating: 4.5
        }
      },
      {
        _id: '5',
        name: 'Nykaa',
        logo: 'https://via.placeholder.com/80x80?text=N',
        category: 'Beauty',
        cashbackRate: 6,
        description: 'Beauty and personal care products',
        isPopular: true,
        stats: {
          totalUsers: 1200000,
          averageRating: 4.4
        }
      },
      {
        _id: '6',
        name: 'Zomato',
        logo: 'https://via.placeholder.com/80x80?text=Z',
        category: 'Food',
        cashbackRate: 5,
        description: 'Food delivery and dining',
        isPopular: true,
        stats: {
          totalUsers: 2100000,
          averageRating: 4.3
        }
      },
      {
        _id: '7',
        name: 'Swiggy',
        logo: 'https://via.placeholder.com/80x80?text=S',
        category: 'Food',
        cashbackRate: 4,
        description: 'Fast food delivery service',
        isPopular: true,
        stats: {
          totalUsers: 1900000,
          averageRating: 4.2
        }
      },
      {
        _id: '8',
        name: 'BookMyShow',
        logo: 'https://via.placeholder.com/80x80?text=BMS',
        category: 'Entertainment',
        cashbackRate: 7,
        description: 'Movie tickets and events',
        isPopular: true,
        stats: {
          totalUsers: 850000,
          averageRating: 4.6
        }
      }
    ]

    setTimeout(() => {
      setMerchants(mockMerchants)
      setLoading(false)
    }, 1000)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Merchants</h2>
            <p className="text-lg text-gray-600">Shop from your favorite brands and earn cashback</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card shimmer h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Merchants</h2>
          <p className="text-lg text-gray-600">Shop from your favorite brands and earn cashback</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {merchants.map((merchant) => (
            <div key={merchant._id} className="card hover-lift group">
              <div className="card-body text-center">
                <div className="relative mb-4">
                  <img
                    src={merchant.logo}
                    alt={merchant.name}
                    className="w-16 h-16 mx-auto rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                  {merchant.isPopular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{merchant.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{merchant.category}</p>
                
                <div className="mb-3">
                  <span className="text-2xl font-bold text-primary-600">
                    {merchant.cashbackRate}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">Cashback</span>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {merchant.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span>{merchant.stats.averageRating}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span>{formatNumber(merchant.stats.totalUsers)} users</span>
                  </div>
                </div>

                <Button size="sm" className="w-full" asChild>
                  <Link href={`/merchants/${merchant._id}`}>
                    Shop Now
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/merchants">View All Merchants</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}