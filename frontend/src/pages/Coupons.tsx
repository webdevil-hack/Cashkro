import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import api from '../api/axios';
import { Coupon } from '../types';
import CouponCard from '../components/CouponCard';

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterExclusive, setFilterExclusive] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');

  useEffect(() => {
    fetchCoupons();
  }, [filterExclusive, filterVerified, sortBy]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterExclusive) params.append('exclusive', 'true');
      if (filterVerified) params.append('verified', 'true');
      params.append('sort', sortBy);
      params.append('limit', '50');

      const { data } = await api.get(`/coupons?${params.toString()}`);
      setCoupons(data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discount Coupons</h1>
          <p className="text-gray-600">
            Get the best coupon codes and save more on your purchases
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <FiFilter />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-sm"
                >
                  <option value="-createdAt">Latest</option>
                  <option value="-usageCount">Most Used</option>
                  <option value="-successRate">Best Success Rate</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterExclusive}
                    onChange={(e) => setFilterExclusive(e.target.checked)}
                    className="text-primary-600"
                  />
                  <span className="text-sm">Exclusive Coupons</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.checked)}
                    className="text-primary-600"
                  />
                  <span className="text-sm">Verified Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Coupons Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : coupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                  <CouponCard key={coupon._id} coupon={coupon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No coupons found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
