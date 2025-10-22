// path: frontend/components/DashboardWidgets.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import SkeletonLoader from './SkeletonLoader';

interface DashboardWidgetsProps {
  userId: string;
  className?: string;
}

export default function DashboardWidgets({ userId, className = '' }: DashboardWidgetsProps) {
  // Fetch user profile
  const { data: profileData, isLoading: profileLoading } = useQuery(
    'user-profile',
    () => api.get('/api/auth/profile'),
    {
      enabled: !!userId,
    }
  );

  // Fetch transaction stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'transaction-stats',
    () => api.get('/api/transactions/stats/summary?period=30d'),
    {
      enabled: !!userId,
    }
  );

  const user = profileData?.data?.user;
  const stats = statsData?.data?.stats;

  const widgets = [
    {
      title: 'Available Balance',
      value: `₹${user?.wallet?.available?.toLocaleString() || 0}`,
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+₹250 this month',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Cashback',
      value: `₹${user?.wallet?.pending?.toLocaleString() || 0}`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      change: 'Will be credited soon',
      changeType: 'neutral' as const,
    },
    {
      title: 'Total Earned',
      value: `₹${stats?.approvedCashback?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: `+₹${stats?.approvedCashback || 0} lifetime`,
      changeType: 'positive' as const,
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: `${stats?.approvedTransactions || 0} approved`,
      changeType: 'neutral' as const,
    },
  ];

  const recentTransactions = [
    {
      id: '1',
      store: 'Amazon India',
      amount: 2500,
      cashback: 125,
      status: 'approved',
      date: '2024-01-15',
    },
    {
      id: '2',
      store: 'Flipkart',
      amount: 1800,
      cashback: 90,
      status: 'pending',
      date: '2024-01-14',
    },
    {
      id: '3',
      store: 'Myntra',
      amount: 1200,
      cashback: 60,
      status: 'approved',
      date: '2024-01-13',
    },
  ];

  if (profileLoading || statsLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonLoader key={index} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgets.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <motion.div
              key={widget.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${widget.bgColor}`}>
                  <Icon className={`w-6 h-6 ${widget.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {widget.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {widget.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`${
                    widget.changeType === 'positive'
                      ? 'text-green-600'
                      : widget.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {widget.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <button className="text-sm text-primary hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {transaction.store}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  ₹{transaction.amount.toLocaleString()}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600">
                    +₹{transaction.cashback} cashback
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    {transaction.status === 'approved' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {transaction.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Refer & Earn</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Invite friends and earn ₹50 for each successful referral
          </p>
          <button className="btn btn-sm bg-white text-primary hover:bg-gray-100">
            Invite Friends
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Wallet className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Withdraw Cashback</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Transfer your earnings to your bank account
          </p>
          <button className="btn btn-sm bg-white text-green-600 hover:bg-gray-100">
            Withdraw Now
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Support</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Need help? Our support team is here for you
          </p>
          <button className="btn btn-sm bg-white text-purple-600 hover:bg-gray-100">
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
}