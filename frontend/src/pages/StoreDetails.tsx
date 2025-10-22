import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiExternalLink } from 'react-icons/fi';
import api from '../api/axios';
import { Store, Deal, Coupon } from '../types';
import DealCard from '../components/DealCard';
import CouponCard from '../components/CouponCard';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [store, setStore] = useState<Store | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const [storeRes, dealsRes, couponsRes] = await Promise.all([
        api.get(`/stores/${id}`),
        api.get(`/deals?store=${id}`),
        api.get(`/coupons?store=${id}`)
      ]);

      setStore(storeRes.data.store);
      setDeals(dealsRes.data.deals);
      setCoupons(couponsRes.data.coupons);
    } catch (error) {
      console.error('Error fetching store details:', error);
      toast.error('Failed to load store details');
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to earn cashback');
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.post(`/stores/${id}/click`);
      toast.success('Cashback tracking activated! 🎉');
      
      // Open affiliate link in new tab
      window.open(data.affiliateLink, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      toast.error('Failed to activate cashback tracking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Store not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={store.logo}
              alt={store.name}
              className="h-24 w-auto object-contain"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <FiStar fill="currentColor" />
                  <span className="text-sm font-semibold text-gray-700">
                    {store.rating.toFixed(1)} ({store.totalRatings} ratings)
                  </span>
                </div>
                {store.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
                    Featured Store
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{store.description}</p>
              <div className="flex flex-wrap gap-2">
                {store.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cashback Info */}
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Earn Cashback</p>
                <div className="text-3xl font-bold text-primary-600">
                  {store.cashbackType === 'upto' && `Up to ${store.cashbackValue}%`}
                  {store.cashbackType === 'percentage' && `${store.cashbackValue}%`}
                  {store.cashbackType === 'fixed' && `₹${store.cashbackValue}`}
                </div>
                {store.maxCashback && (
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum Cashback: ₹{store.maxCashback}
                  </p>
                )}
              </div>
              <button
                onClick={handleShopNow}
                className="btn btn-primary px-8 py-3 text-lg flex items-center space-x-2"
              >
                <span>Shop Now & Earn</span>
                <FiExternalLink />
              </button>
            </div>
            {store.cashbackTerms && (
              <div className="mt-4 text-xs text-gray-600">
                <p className="font-semibold mb-1">Terms & Conditions:</p>
                <p>{store.cashbackTerms}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      {coupons.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Available Coupons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        </div>
      )}

      {/* Deals Section */}
      {deals.length > 0 && (
        <div className="container mx-auto px-4 py-12 bg-white">
          <h2 className="text-2xl font-bold mb-6">Current Deals & Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetails;
