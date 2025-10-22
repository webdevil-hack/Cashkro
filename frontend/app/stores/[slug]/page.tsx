// path: frontend/app/stores/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreCard from '@/components/StoreCard';
import CouponCard from '@/components/CouponCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Clock, 
  Users, 
  Tag,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch store details
  const { data: storeData, isLoading: storeLoading } = useQuery(
    ['store', slug],
    () => api.get(`/api/stores/${slug}`),
    {
      enabled: !!slug,
    }
  );

  // Fetch store coupons
  const { data: couponsData, isLoading: couponsLoading } = useQuery(
    ['store-coupons', slug],
    () => api.get(`/api/stores/${slug}/coupons`),
    {
      enabled: !!slug,
    }
  );

  const store = storeData?.data?.store;
  const coupons = couponsData?.data?.coupons || [];

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container-custom py-8">
          <div className="space-y-8">
            <SkeletonLoader className="h-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-80" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container-custom py-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Store not found
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              The store you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/stores" className="btn btn-primary">
              Browse All Stores
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container-custom py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/stores"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Link>
        </div>

        {/* Store Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Store Logo */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={store.logoUrl}
                alt={store.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            {/* Store Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {store.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {store.description}
                  </p>
                  
                  {/* Cashback Info */}
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {formatCashback()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Cashback
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {store.stats.clicks.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Clicks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {store.stats.conversions.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Conversions
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {store.categories.map((category: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Min Order Value */}
                  {formatMinOrder() && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {formatMinOrder()}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorite
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Store Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {store.conversionRate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Conversion Rate
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {store.stats.totalCashback.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Cashback Earned
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {coupons.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Active Coupons
            </div>
          </div>
        </motion.div>

        {/* Coupons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Coupons
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Tag className="w-4 h-4" />
              <span>{coupons.length} coupons</span>
            </div>
          </div>

          {couponsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-80" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No coupons available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Check back later for new deals and offers
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon: any, index: number) => (
                <motion.div
                  key={coupon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CouponCard coupon={coupon} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Terms and Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Terms and Conditions
          </h3>
          <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
            <p>{store.terms}</p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}