// path: frontend/components/SearchBar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Store, Tag } from 'lucide-react';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';

interface SearchResult {
  type: 'store' | 'coupon';
  id: string;
  title: string;
  description: string;
  image?: string;
  cashback?: number;
  discount?: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search stores
  const { data: storesData, isLoading: storesLoading } = useQuery(
    ['search-stores', query],
    () => api.get('/api/stores/search', { params: { q: query, limit: 5 } }),
    {
      enabled: query.length > 2,
      staleTime: 30000,
    }
  );

  // Search coupons
  const { data: couponsData, isLoading: couponsLoading } = useQuery(
    ['search-coupons', query],
    () => api.get('/api/coupons/search', { params: { q: query, limit: 5 } }),
    {
      enabled: query.length > 2,
      staleTime: 30000,
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const newRecent = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const stores = storesData?.data?.stores || [];
  const coupons = couponsData?.data?.coupons || [];
  const isLoading = storesLoading || couponsLoading;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyPress}
          placeholder="Search stores, coupons, categories..."
          className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            {query.length === 0 ? (
              /* Empty state - show recent and trending searches */
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <span className="flex items-center">
                            <Search className="w-4 h-4 mr-2" />
                            {search}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(search);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Trending Searches
                  </h3>
                  <div className="space-y-1">
                    {['Amazon', 'Flipkart', 'Myntra', 'Zomato', 'Swiggy'].map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center px-3 py-2 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : query.length < 3 ? (
              /* Query too short */
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Type at least 3 characters to search
              </div>
            ) : isLoading ? (
              /* Loading state */
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
              </div>
            ) : stores.length === 0 && coupons.length === 0 ? (
              /* No results */
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            ) : (
              /* Search results */
              <div className="p-2">
                {/* Stores */}
                {stores.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-2">
                      Stores
                    </h3>
                    <div className="space-y-1">
                      {stores.map((store: any) => (
                        <button
                          key={store._id}
                          onClick={() => handleSearch(store.name)}
                          className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Store className="w-4 h-4 mr-3 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {store.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {store.currentCashbackPercent}% cashback
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupons */}
                {coupons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-2">
                      Coupons
                    </h3>
                    <div className="space-y-1">
                      {coupons.map((coupon: any) => (
                        <button
                          key={coupon._id}
                          onClick={() => handleSearch(coupon.title)}
                          className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Tag className="w-4 h-4 mr-3 text-green-500" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {coupon.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coupon.storeId?.name} • {coupon.code}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* View all results */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full flex items-center justify-center px-3 py-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}