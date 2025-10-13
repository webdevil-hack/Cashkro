// path: frontend/app/coupons/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CouponCard from '@/components/CouponCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Search, Filter, Tag, Clock, Star } from 'lucide-react';

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [isExclusive, setIsExclusive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('-createdAt');

  // Fetch coupons
  const { data: couponsData, isLoading: couponsLoading } = useQuery(
    ['coupons', searchQuery, selectedCategory, selectedStore, isExclusive, sortBy],
    () => api.get('/api/coupons', {
      params: {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        store: selectedStore || undefined,
        isExclusive: isExclusive,
        sort: sortBy,
        perPage: 20
      }
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'coupon-categories',
    () => api.get('/api/coupons/categories/list')
  );

  // Fetch stores for filter
  const { data: storesData } = useQuery(
    'stores-for-filter',
    () => api.get('/api/stores?perPage=100')
  );

  const coupons = couponsData?.data?.coupons || [];
  const categories = categoriesData?.data?.categories || [];
  const stores = storesData?.data?.stores || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query dependency
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStore('');
    setIsExclusive(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Coupon Codes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find the best deals and save money with our exclusive coupon codes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coupons, stores, or categories..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Store Filter */}
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Stores</option>
                {stores.map((store: any) => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>

              {/* Exclusive Filter */}
              <select
                value={isExclusive === undefined ? '' : isExclusive.toString()}
                onChange={(e) => setIsExclusive(e.target.value === '' ? undefined : e.target.value === 'true')}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Coupons</option>
                <option value="true">Exclusive Only</option>
                <option value="false">Regular Only</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-priority">Priority</option>
                <option value="-usageCount">Most Used</option>
                <option value="expiryDate">Expiring Soon</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedStore || isExclusive !== undefined) && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {coupons.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Active Coupons
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {coupons.filter((c: any) => c.isExclusive).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Exclusive Deals
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stores.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Partner Stores
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Categories
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              {couponsLoading ? 'Loading...' : `${coupons.length} coupons found`}
            </p>
          </div>
        </div>

        {/* Coupons Grid */}
        {couponsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-80" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No coupons found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coupons.map((coupon: any, index: number) => (
              <motion.div
                key={coupon._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CouponCard coupon={coupon} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {coupons.length > 0 && coupons.length % 20 === 0 && (
          <div className="text-center mt-12">
            <button className="btn btn-outline btn-lg">
              Load More Coupons
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}