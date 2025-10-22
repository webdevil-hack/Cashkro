import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiWallet, BiMoney, BiTrendingUp, BiGift } from 'react-icons/bi';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentCashback, setRecentCashback] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cashbackRes] = await Promise.all([
        api.get('/cashback/my-cashback?limit=5'),
      ]);

      setRecentCashback(cashbackRes.data.cashback);
      setStats(cashbackRes.data.summary);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleCopyReferralCode = async () => {
    if (user?.referralCode) {
      try {
        await navigator.clipboard.writeText(user.referralCode);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BiWallet className="text-green-600 text-2xl" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Confirmed Cashback</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{user?.confirmedCashback || 0}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BiTrendingUp className="text-yellow-600 text-2xl" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Pending Cashback</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{user?.pendingCashback || 0}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BiMoney className="text-blue-600 text-2xl" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Cashback</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{user?.totalCashback || 0}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BiGift className="text-purple-600 text-2xl" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Referral Earnings</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{user?.referralEarnings || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cashback */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Cashback</h2>
                <Link to="/my-cashback" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                  View All
                </Link>
              </div>

              {recentCashback.length > 0 ? (
                <div className="space-y-4">
                  {recentCashback.map((cashback: any) => (
                    <div key={cashback._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {cashback.store?.logo && (
                          <img src={cashback.store.logo} alt={cashback.store.name} className="h-10 w-auto" />
                        )}
                        <div>
                          <h3 className="font-semibold">{cashback.store?.name || 'Store'}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(cashback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+₹{cashback.cashbackAmount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          cashback.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          cashback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {cashback.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No cashback yet</p>
                  <Link to="/stores" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Referral Card */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Refer & Earn</h2>
              <p className="text-sm text-gray-600 mb-4">
                Invite your friends and earn ₹50 for each successful referral!
              </p>
              
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-600 mb-2">Your Referral Code</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary-700 text-lg">
                    {user?.referralCode}
                  </span>
                  <button
                    onClick={handleCopyReferralCode}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                  >
                    {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                  </button>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary w-full">
                Share Referral Link
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/stores" className="btn btn-outline w-full">
                  Browse Stores
                </Link>
                <Link to="/my-cashback" className="btn btn-outline w-full">
                  My Cashback
                </Link>
                <Link to="/deals" className="btn btn-outline w-full">
                  View Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
