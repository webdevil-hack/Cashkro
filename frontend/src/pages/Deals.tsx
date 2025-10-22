import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import api from '../api/axios';
import { Deal } from '../types';
import DealCard from '../components/DealCard';

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('-createdAt');

  useEffect(() => {
    fetchDeals();
  }, [sortBy]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/deals?sort=${sortBy}&limit=50`);
      setDeals(data.deals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Hot Deals & Offers</h1>
          <p className="text-gray-600">
            Discover the best deals and offers from top brands
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

              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-sm"
                >
                  <option value="-createdAt">Latest</option>
                  <option value="-popularity">Most Popular</option>
                  <option value="-clickCount">Trending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : deals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal) => (
                  <DealCard key={deal._id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No deals found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;
