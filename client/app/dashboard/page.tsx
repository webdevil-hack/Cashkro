'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Wallet, TrendingUp, ShoppingBag, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface DashboardStats {
  totalOrders: number
  totalSpent: number
  totalCashback: number
  pendingCashback: number
}

interface RecentTransaction {
  _id: string
  orderId: string
  orderValue: number
  cashbackAmount: number
  status: string
  merchant: {
    name: string
    logo: string
  }
  createdAt: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    totalCashback: 0,
    pendingCashback: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalOrders: 24,
          totalSpent: 45600,
          totalCashback: 3420,
          pendingCashback: 850
        })
        
        setRecentTransactions([
          {
            _id: '1',
            orderId: 'ORD-001',
            orderValue: 2500,
            cashbackAmount: 250,
            status: 'confirmed',
            merchant: {
              name: 'Amazon',
              logo: 'https://via.placeholder.com/40x40?text=A'
            },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            orderId: 'ORD-002',
            orderValue: 1800,
            cashbackAmount: 90,
            status: 'pending',
            merchant: {
              name: 'Myntra',
              logo: 'https://via.placeholder.com/40x40?text=M'
            },
            createdAt: '2024-01-14T15:45:00Z'
          },
          {
            _id: '3',
            orderId: 'ORD-003',
            orderValue: 3200,
            cashbackAmount: 160,
            status: 'confirmed',
            merchant: {
              name: 'Flipkart',
              logo: 'https://via.placeholder.com/40x40?text=F'
            },
            createdAt: '2024-01-13T09:20:00Z'
          }
        ])
        
        setIsLoading(false)
      }, 1000)
    }
  }, [user, loading, router])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statCards = [
    {
      title: 'Wallet Balance',
      value: formatCurrency(user.wallet.balance),
      change: '+₹120',
      changeType: 'positive' as const,
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Earned',
      value: formatCurrency(user.wallet.totalEarned),
      change: '+₹450',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      change: '+3',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pending Cashback',
      value: formatCurrency(stats.pendingCashback),
      change: '₹850',
      changeType: 'neutral' as const,
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your cashback earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' && (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {stat.changeType === 'negative' && (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              </div>
              <div className="card-body">
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={transaction.merchant.logo}
                            alt={transaction.merchant.name}
                            className="w-10 h-10 rounded-lg"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{transaction.merchant.name}</h3>
                            <p className="text-sm text-gray-500">Order #{transaction.orderId}</p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(transaction.orderValue)} • {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{formatCurrency(transaction.cashbackAmount)}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Start shopping to earn cashback!</p>
                  </div>
                )}
              </div>
              <div className="card-footer">
                <a
                  href="/transactions"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  View all transactions →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="card-body space-y-4">
                <a
                  href="/deals"
                  className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Gift className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Browse Deals</span>
                </a>
                <a
                  href="/merchants"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Shop Now</span>
                </a>
                <a
                  href="/wallet"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Wallet className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">My Wallet</span>
                </a>
                <a
                  href="/referrals"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Refer & Earn</span>
                </a>
              </div>
            </div>

            {/* Referral Code */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Your Referral Code</h2>
              </div>
              <div className="card-body">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900 mb-2">{user.referralCode}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Share this code with friends and earn ₹50 for each successful referral
                  </p>
                  <button className="btn btn-primary btn-sm w-full">
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}