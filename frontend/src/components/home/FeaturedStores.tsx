'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, Star, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storeAPI } from '@/lib/api'

interface Store {
  id: string
  name: string
  slug: string
  logo: string
  cashbackRate: number
  maxCashback?: number
  category: string
  isFeatured: boolean
  _count: {
    coupons: number
    deals: number
  }
}

export function FeaturedStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedStores()
  }, [])

  const fetchFeaturedStores = async () => {
    try {
      const response = await storeAPI.getFeaturedStores(12)
      setStores(response.data)
    } catch (error) {
      console.error('Failed to fetch featured stores:', error)
      // Fallback data for demo
      setStores([
        {
          id: '1',
          name: 'Amazon',
          slug: 'amazon',
          logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop',
          cashbackRate: 2.5,
          maxCashback: 1000,
          category: 'Electronics',
          isFeatured: true,
          _count: { coupons: 15, deals: 8 }
        },
        {
          id: '2',
          name: 'Flipkart',
          slug: 'flipkart',
          logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
          cashbackRate: 3.0,
          maxCashback: 2000,
          category: 'Electronics',
          isFeatured: true,
          _count: { coupons: 12, deals: 6 }
        },
        {
          id: '3',
          name: 'Myntra',
          slug: 'myntra',
          logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
          cashbackRate: 4.5,
          maxCashback: 1500,
          category: 'Fashion',
          isFeatured: true,
          _count: { coupons: 20, deals: 10 }
        },
        {
          id: '4',
          name: 'Nykaa',
          slug: 'nykaa',
          logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
          cashbackRate: 5.0,
          maxCashback: 800,
          category: 'Beauty',
          isFeatured: true,
          _count: { coupons: 18, deals: 12 }
        },
        {
          id: '5',
          name: 'Zomato',
          slug: 'zomato',
          logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
          cashbackRate: 6.0,
          maxCashback: 500,
          category: 'Food',
          isFeatured: true,
          _count: { coupons: 10, deals: 15 }
        },
        {
          id: '6',
          name: 'BookMyShow',
          slug: 'bookmyshow',
          logo: 'https://images.unsplash.com/photo-1489599511344-f4c6c7c8e3b8?w=100&h=100&fit=crop',
          cashbackRate: 3.5,
          maxCashback: 300,
          category: 'Entertainment',
          isFeatured: true,
          _count: { coupons: 8, deals: 5 }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Stores
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shop from top brands and earn amazing cashback on every purchase
          </p>
        </div>

        {/* Stores grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/stores/${store.slug}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  {/* Store logo */}
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>

                  {/* Store name */}
                  <h3 className="text-lg font-semibold text-center mb-2 group-hover:text-cashkaro-primary transition-colors">
                    {store.name}
                  </h3>

                  {/* Cashback rate */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Percent className="w-3 h-3 mr-1" />
                      Up to {store.cashbackRate}% Cashback
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center text-sm text-gray-500 mb-3">
                    {store.category}
                  </div>

                  {/* Coupons and deals count */}
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>{store._count.coupons} Coupons</span>
                    <span>•</span>
                    <span>{store._count.deals} Deals</span>
                  </div>

                  {/* Popular indicator */}
                  {store.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-cashkaro-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Button asChild size="lg" className="btn-primary">
            <Link href="/stores" className="flex items-center">
              View All Stores
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}