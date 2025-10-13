// path: frontend/components/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import { Search, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Earn Cashback',
      description: 'Get money back on every purchase'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your data is protected with bank-level security'
    },
    {
      icon: Zap,
      title: 'Instant Rewards',
      description: 'Cashback credited within 24-48 hours'
    }
  ];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Earn{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Cashback
              </span>{' '}
              on Every Purchase
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
            >
              Shop from 500+ top brands and earn up to 10% cashback on every purchase. 
              Plus, get exclusive coupons and deals you won't find anywhere else.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/auth/signup"
                className="btn btn-primary btn-xl px-8 py-4 text-lg font-semibold"
              >
                Start Earning Now
              </Link>
              <Link
                href="/how-it-works"
                className="btn btn-outline btn-xl px-8 py-4 text-lg font-semibold"
              >
                How it Works
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right content - Hero image/illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden">
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 left-8 w-20 h-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">5% Cashback</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-16 right-12 w-24 h-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">₹250 Earned</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-20 left-12 w-28 h-14 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Exclusive Deal</span>
                </motion.div>

                {/* Central illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center"
                  >
                    <TrendingUp className="w-16 h-16 text-white" />
                  </motion.div>
                </div>

                {/* Background elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full" />
                  <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-primary/20 rounded-full" />
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/40 rounded-full" />
                </div>
              </div>

              {/* Stats overlay */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">₹50M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Cashback Earned</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">100K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Happy Users</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}