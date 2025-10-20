'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Search, Filter, Clock, Star, ExternalLink, ChevronDown } from 'lucide-react'
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
  category: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    'all', 'fashion', 'electronics', 'home', 'beauty', 'health', 
    'food', 'travel', 'books', 'sports', 'automotive', 'jewelry'
  ]

  const dealTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'cashback', label: 'Cashback' },
    { value: 'coupon', label: 'Coupon' },
    { value: 'offer', label: 'Special Offer' },
    { value: 'sale', label: 'Sale' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'cashback', label: 'Highest Cashback' },
    { value: 'popular', label: 'Most Popular' }
  ]

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
        image: 'https://images.unsplash.com/photo-1498049794561?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 1250,
        category: 'electronics'
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
        image: 'https://images.unsplash.com/photo-1441986300917?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 980,
        category: 'fashion'
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
        image: 'https://images.unsplash.com/photo-1586023492125?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 2100,
        category: 'home'
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
        image: 'https://images.unsplash.com/photo-1488646953014?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 750,
        category: 'travel'
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
        image: 'https://images.unsplash.com/photo-1596462502278?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 1650,
        category: 'beauty'
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
        image: 'https://images.unsplash.com/photo-1565299624946?w=400&h=300&fit=crop',
        isFeatured: true,
        clickCount: 3200,
        category: 'food'
      }
    ]

    setTimeout(() => {
      setDeals(mockDeals)
      setLoading(false)
    }, 1000)
  }, [])

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

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory
    const matchesType = selectedType === 'all' || deal.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Deals</h1>
          <p className="text-gray-600">Discover amazing cashback offers from top merchants</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search deals, merchants, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input"
              >
                {dealTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDeals.length} of {deals.length} deals
          </p>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
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
                  {deal.isFeatured && (
                    <div className="absolute bottom-4 left-4">
                      <span className="badge bg-yellow-500 text-white">
                        Featured
                      </span>
                    </div>
                  )}
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
                      <a href={`/deals/${deal._id}`}>
                        Get Deal
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedType('all')
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}