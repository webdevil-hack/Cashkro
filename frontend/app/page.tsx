// path: frontend/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import StoreCard from '@/components/StoreCard';
import CouponCard from '@/components/CouponCard';
import DashboardWidgets from '@/components/DashboardWidgets';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';

export default function HomePage() {
  const [featuredStores, setFeaturedStores] = useState([]);
  const [trendingStores, setTrendingStores] = useState([]);
  const [exclusiveCoupons, setExclusiveCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured stores
  const { data: featuredData, isLoading: featuredLoading } = useQuery(
    'featured-stores',
    () => api.get('/stores/featured?limit=8'),
    {
      onSuccess: (data) => {
        setFeaturedStores(data.data.stores);
      }
    }
  );

  // Fetch trending stores
  const { data: trendingData, isLoading: trendingLoading } = useQuery(
    'trending-stores',
    () => api.get('/stores/trending?limit=6'),
    {
      onSuccess: (data) => {
        setTrendingStores(data.data.stores);
      }
    }
  );

  // Fetch exclusive coupons
  const { data: couponsData, isLoading: couponsLoading } = useQuery(
    'exclusive-coupons',
    () => api.get('/coupons/exclusive/list?limit=6'),
    {
      onSuccess: (data) => {
        setExclusiveCoupons(data.data.coupons);
      }
    }
  );

  useEffect(() => {
    if (!featuredLoading && !trendingLoading && !couponsLoading) {
      setLoading(false);
    }
  }, [featuredLoading, trendingLoading, couponsLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <Hero />
        
        {/* Search Bar */}
        <section className="py-8 bg-white dark:bg-gray-900 shadow-sm">
          <div className="container-custom">
            <SearchBar />
          </div>
        </section>

        {/* Featured Stores */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Stores
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our top partner stores and start earning cashback on your favorite brands
              </p>
            </motion.div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {featuredStores.map((store: any) => (
                  <motion.div key={store._id} variants={itemVariants}>
                    <StoreCard store={store} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Exclusive Coupons */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Exclusive Coupons
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Limited-time offers and exclusive deals you won't find anywhere else
              </p>
            </motion.div>

            {couponsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {exclusiveCoupons.map((coupon: any) => (
                  <motion.div key={coupon._id} variants={itemVariants}>
                    <CouponCard coupon={coupon} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Trending Stores */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Trending Now
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See what's popular and trending among our users
              </p>
            </motion.div>

            {trendingLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {trendingStores.map((store: any) => (
                  <motion.div key={store._id} variants={itemVariants}>
                    <StoreCard store={store} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">
                Join Thousands of Happy Users
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Our users have saved millions and earned thousands in cashback
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold mb-2">₹50M+</div>
                <div className="text-lg opacity-90">Cashback Earned</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold mb-2">100K+</div>
                <div className="text-lg opacity-90">Happy Users</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-lg opacity-90">Partner Stores</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-lg opacity-90">Active Coupons</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already earning cashback on every purchase
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-lg px-8"
                >
                  Sign Up Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline btn-lg px-8"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}