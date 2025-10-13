// path: frontend/components/StoreCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Star, TrendingUp, Tag } from 'lucide-react';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface StoreCardProps {
  store: {
    _id: string;
    name: string;
    slug: string;
    logoUrl: string;
    bannerUrl?: string;
    description?: string;
    categories: string[];
    currentCashbackPercent: number;
    cashbackType: 'percent' | 'fixed';
    minOrderValue?: number;
    maxCashback?: number;
    stats: {
      clicks: number;
      conversions: number;
      totalCashback: number;
    };
    featured: boolean;
    tags: string[];
  };
  className?: string;
}

export default function StoreCard({ store, className = '' }: StoreCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch store coupons
  const { data: couponsData } = useQuery(
    ['store-coupons', store.slug],
    () => api.get(`/api/stores/${store.slug}/coupons?limit=3`),
    {
      enabled: isHovered,
      staleTime: 300000, // 5 minutes
    }
  );

  const coupons = couponsData?.data?.coupons || [];

  const handleShopNow = async () => {
    setIsLoading(true);
    try {
      // Create click tracking
      const response = await api.post('/api/click', {
        storeId: store._id,
        redirectToAffiliateUrl: store.website || '#'
      });

      // Redirect to tracking URL
      window.location.href = response.data.data.redirectUrl;
    } catch (error) {
      toast.error('Failed to redirect to store');
      console.error('Click tracking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCashback = () => {
    if (store.cashbackType === 'percent') {
      return `${store.currentCashbackPercent}%`;
    } else {
      return `₹${store.currentCashbackPercent}`;
    }
  };

  const formatMinOrder = () => {
    if (store.minOrderValue) {
      return `Min. order ₹${store.minOrderValue}`;
    }
    return null;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured badge */}
      {store.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </span>
        </div>
      )}

      {/* Banner image */}
      {store.bannerUrl && (
        <div className="relative h-32 overflow-hidden">
          <Image
            src={store.bannerUrl}
            alt={store.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Store logo and name */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={store.logoUrl}
              alt={store.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {store.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-primary">
                {formatCashback()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                cashback
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {store.description}
          </p>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {store.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {category}
            </span>
          ))}
          {store.categories.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              +{store.categories.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>{store.stats.clicks.toLocaleString()} clicks</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>₹{store.stats.totalCashback.toLocaleString()} earned</span>
          </div>
        </div>

        {/* Min order value */}
        {formatMinOrder() && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {formatMinOrder()}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleShopNow}
            disabled={isLoading}
            className="flex-1 btn btn-primary btn-sm flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Shop Now
              </>
            )}
          </button>
          <Link
            href={`/stores/${store.slug}`}
            className="btn btn-outline btn-sm px-3"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Hover overlay with coupons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-white dark:bg-gray-800 p-6 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Coupons
          </h3>
          <Link
            href={`/stores/${store.slug}`}
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        {coupons.length > 0 ? (
          <div className="space-y-2 flex-1 overflow-y-auto">
            {coupons.map((coupon: any) => (
              <div
                key={coupon._id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {coupon.code}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% off`
                    : `₹${coupon.discountValue} off`
                  }
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No coupons available</p>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleShopNow}
            disabled={isLoading}
            className="w-full btn btn-primary btn-sm flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Shop Now & Earn {formatCashback()}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}