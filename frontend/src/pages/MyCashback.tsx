import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import api from '../api/axios';
import { Cashback } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const MyCashback = () => {
  const { user } = useAuthStore();
  const [cashback, setCashback] = useState<Cashback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    fetchCashback();
  }, [statusFilter]);

  const fetchCashback = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const { data } = await api.get(`/cashback/my-cashback?${params.toString()}`);
      setCashback(data.cashback);
    } catch (error) {
      console.error('Error fetching cashback:', error);
      toast.error('Failed to load cashback data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount < 100) {
      toast.error('Minimum withdrawal amount is ₹100');
      return;
    }

    if (amount > (user?.confirmedCashback || 0)) {
      toast.error('Insufficient confirmed cashback');
      return;
    }

    try {
      await api.post('/cashback/withdraw', {
        amount,
        method: 'bank',
        paymentDetails: {}
      });

      toast.success('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchCashback();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'tracked':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Cashback</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-r from-green-50 to-green-100">
            <h3 className="text-sm text-green-700 mb-1">Confirmed Cashback</h3>
            <p className="text-3xl font-bold text-green-800">
              ₹{user?.confirmedCashback || 0}
            </p>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="mt-4 btn btn-primary w-full text-sm"
              disabled={(user?.confirmedCashback || 0) < 100}
            >
              Withdraw
            </button>
          </div>

          <div className="card p-6 bg-gradient-to-r from-yellow-50 to-yellow-100">
            <h3 className="text-sm text-yellow-700 mb-1">Pending Cashback</h3>
            <p className="text-3xl font-bold text-yellow-800">
              ₹{user?.pendingCashback || 0}
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Being tracked & verified
            </p>
          </div>

          <div className="card p-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-sm text-blue-700 mb-1">Total Earned</h3>
            <p className="text-3xl font-bold text-blue-800">
              ₹{user?.totalCashback || 0}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Lifetime earnings
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <FiFilter />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === ''}
                      onChange={() => setStatusFilter('')}
                      className="text-primary-600"
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === 'confirmed'}
                      onChange={() => setStatusFilter('confirmed')}
                      className="text-primary-600"
                    />
                    <span className="text-sm">Confirmed</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === 'pending'}
                      onChange={() => setStatusFilter('pending')}
                      className="text-primary-600"
                    />
                    <span className="text-sm">Pending</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === 'tracked'}
                      onChange={() => setStatusFilter('tracked')}
                      className="text-primary-600"
                    />
                    <span className="text-sm">Tracked</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Cashback List */}
          <div className="flex-1">
            <div className="card">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : cashback.length > 0 ? (
                <div className="divide-y">
                  {cashback.map((item) => {
                    const store = typeof item.store === 'object' ? item.store : null;
                    return (
                      <div key={item._id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {store?.logo && (
                              <img src={store.logo} alt={store.name} className="h-12 w-auto" />
                            )}
                            <div>
                              <h3 className="font-bold text-lg">{store?.name || 'Store'}</h3>
                              <p className="text-sm text-gray-600">
                                Transaction ID: {item.transactionId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              +₹{item.cashbackAmount}
                            </p>
                            <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Order Amount</p>
                            <p className="font-semibold">₹{item.orderAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Cashback Rate</p>
                            <p className="font-semibold">{item.cashbackRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Clicked At</p>
                            <p className="font-semibold">
                              {format(new Date(item.clickedAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          {item.estimatedConfirmationDate && (
                            <div>
                              <p className="text-gray-600">Est. Confirmation</p>
                              <p className="font-semibold">
                                {format(new Date(item.estimatedConfirmationDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <div className="mt-4 text-sm text-gray-600">
                            <p className="font-semibold mb-1">Notes:</p>
                            <p>{item.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No cashback transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Withdraw Cashback</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{user?.confirmedCashback || 0}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="input"
                placeholder="Enter amount (min ₹100)"
                min="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum withdrawal amount is ₹100
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="btn btn-primary flex-1"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCashback;
