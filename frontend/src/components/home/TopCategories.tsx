'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Utensils, 
  Car, 
  Gamepad2,
  Book,
  Heart,
  Gift,
  Plane,
  ShoppingBag,
  Laptop
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: React.ReactNode
  storeCount: number
  color: string
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    icon: <Smartphone className="w-8 h-8" />,
    storeCount: 150,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    icon: <Shirt className="w-8 h-8" />,
    storeCount: 200,
    color: 'bg-pink-500'
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    icon: <Home className="w-8 h-8" />,
    storeCount: 80,
    color: 'bg-green-500'
  },
  {
    id: '4',
    name: 'Food & Dining',
    slug: 'food-dining',
    icon: <Utensils className="w-8 h-8" />,
    storeCount: 120,
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'Travel',
    slug: 'travel',
    icon: <Plane className="w-8 h-8" />,
    storeCount: 60,
    color: 'bg-purple-500'
  },
  {
    id: '6',
    name: 'Beauty',
    slug: 'beauty',
    icon: <Heart className="w-8 h-8" />,
    storeCount: 90,
    color: 'bg-red-500'
  },
  {
    id: '7',
    name: 'Books',
    slug: 'books',
    icon: <Book className="w-8 h-8" />,
    storeCount: 40,
    color: 'bg-indigo-500'
  },
  {
    id: '8',
    name: 'Gaming',
    slug: 'gaming',
    icon: <Gamepad2 className="w-8 h-8" />,
    storeCount: 35,
    color: 'bg-cyan-500'
  },
  {
    id: '9',
    name: 'Automotive',
    slug: 'automotive',
    icon: <Car className="w-8 h-8" />,
    storeCount: 45,
    color: 'bg-gray-600'
  },
  {
    id: '10',
    name: 'Gifts',
    slug: 'gifts',
    icon: <Gift className="w-8 h-8" />,
    storeCount: 70,
    color: 'bg-yellow-500'
  },
  {
    id: '11',
    name: 'Computers',
    slug: 'computers',
    icon: <Laptop className="w-8 h-8" />,
    storeCount: 55,
    color: 'bg-teal-500'
  },
  {
    id: '12',
    name: 'Shopping',
    slug: 'shopping',
    icon: <ShoppingBag className="w-8 h-8" />,
    storeCount: 180,
    color: 'bg-rose-500'
  }
]

export function TopCategories() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals and cashback offers across all your favorite categories
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>

                  {/* Category name */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-cashkaro-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Store count */}
                  <p className="text-sm text-gray-500">
                    {category.storeCount} stores
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all categories button */}
        <div className="text-center mt-12">
          <Link 
            href="/categories" 
            className="inline-flex items-center px-6 py-3 bg-cashkaro-primary text-white font-medium rounded-lg hover:bg-cashkaro-primary/90 transition-colors"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}