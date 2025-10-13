// path: frontend/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardWidgets from '@/components/DashboardWidgets';
import SkeletonLoader from '@/components/SkeletonLoader';
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setIsLoggedIn(true);
  }, [router]);

  // Fetch user profile
  const { data: profileData, isLoading: profileLoading } = useQuery(
    'user-profile',
    () => api.get('/api/auth/profile'),
    {
      enabled: isLoggedIn,
      onSuccess: (data) => {
        setUserId(data.data.user.id);
      },
      onError: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/auth/login');
      }
    }
  );

  // Fetch transaction stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'transaction-stats',
    () => api.get('/api/transactions/stats/summary?period=30d'),
    {
      enabled: isLoggedIn && !!userId,
    }
  );

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery(
    'recent-transactions',
    () => api.get(`/api/transactions/user/${userId}?perPage=5`),
    {
      enabled: isLoggedIn && !!userId,
    }
  );

  const user = profileData?.data?.user;
  const stats = statsData?.data?.stats;
  const transactions = transactionsData?.data?.transactions || [];

  if (!isLoggedIn || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-32" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container-custom py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Here's your cashback dashboard
          </p>
        </motion.div>

        {/* Dashboard Widgets */}
        <DashboardWidgets userId={userId} className="mb-8" />

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              <button className="text-sm text-primary hover:underline">
                View All
              </button>
            </div>

            {transactionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonLoader key={i} className="h-16" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No transactions yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Start shopping to earn cashback!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction: any) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {transaction.storeId?.name || 'Unknown Store'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ₹{transaction.amount?.toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">
                          +₹{transaction.cashbackAmount} cashback
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {transaction.status === 'approved' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : transaction.status === 'pending' ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Withdraw Cashback
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Invite Friends
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    View Analytics
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Browse Coupons
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Invite Friends & Earn</h3>
              <p className="text-lg opacity-90 mb-4">
                Get ₹50 for each friend who signs up and makes their first purchase
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">₹50</div>
                  <div className="text-sm opacity-75">Per Referral</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Unlimited</div>
                  <div className="text-sm opacity-75">Earnings</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-75 mb-1">Your Referral Code</div>
                <div className="font-mono text-lg font-bold">
                  {user?.referralCode || 'LOADING...'}
                </div>
              </div>
              <button className="btn bg-white text-primary hover:bg-gray-100">
                Share Referral Link
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}