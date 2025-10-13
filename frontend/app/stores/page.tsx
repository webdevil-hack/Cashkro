// path: frontend/app/stores/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreCard from '@/components/StoreCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch stores
  const { data: storesData, isLoading: storesLoading } = useQuery(
    ['stores', searchQuery, selectedCategory, sortBy],
    () => api.get('/api/stores', {
      params: {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
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
    'store-categories',
    () => api.get('/api/stores/categories')
  );

  const stores = storesData?.data?.stores || [];
  const categories = categoriesData?.data?.categories || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query dependency
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Partner Stores
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Shop from 500+ top brands and earn cashback on every purchase
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </form>

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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-currentCashbackPercent">Highest Cashback</option>
              <option value="currentCashbackPercent">Lowest Cashback</option>
              <option value="-stats.clicks">Most Popular</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              {storesLoading ? 'Loading...' : `${stores.length} stores found`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Stores Grid/List */}
        {storesLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-64" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No stores found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="btn btn-primary"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
          >
            {stores.map((store: any, index: number) => (
              <motion.div
                key={store._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <StoreCard store={store} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {stores.length > 0 && stores.length % 20 === 0 && (
          <div className="text-center mt-12">
            <button className="btn btn-outline btn-lg">
              Load More Stores
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}