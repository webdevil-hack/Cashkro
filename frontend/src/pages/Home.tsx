import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiGift, FiPercent, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';
import { Store, Deal, Coupon } from '../types';
import StoreCard from '../components/StoreCard';
import DealCard from '../components/DealCard';
import CouponCard from '../components/CouponCard';

const Home = () => {
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [topDeals, setTopDeals] = useState<Deal[]>([]);
  const [exclusiveCoupons, setExclusiveCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [storesRes, dealsRes, couponsRes] = await Promise.all([
        api.get('/stores?featured=true&limit=8'),
        api.get('/deals?featured=true&limit=6'),
        api.get('/coupons?exclusive=true&limit=6')
      ]);

      setFeaturedStores(storesRes.data.stores);
      setTopDeals(dealsRes.data.deals);
      setExclusiveCoupons(couponsRes.data.coupons);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              India's Biggest Cashback & Coupons Site
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Get cashback on every purchase from 1500+ stores. Save more with exclusive deals and coupons!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/stores" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Browse Stores
              </Link>
              <Link to="/register" className="btn bg-primary-700 text-white hover:bg-primary-900 px-8 py-3 text-lg">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1500+</div>
              <div className="text-gray-600">Partner Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">₹500 Cr+</div>
              <div className="text-gray-600">Cashback Earned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">5M+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-bold mb-2">Find Store</h3>
              <p className="text-sm text-gray-600">Browse 1500+ stores and find the best deals</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-bold mb-2">Shop Normally</h3>
              <p className="text-sm text-gray-600">Click through to the store and shop as usual</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-bold mb-2">Get Cashback</h3>
              <p className="text-sm text-gray-600">Earn cashback on every confirmed purchase</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="font-bold mb-2">Withdraw</h3>
              <p className="text-sm text-gray-600">Transfer cashback to your bank account</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FiTrendingUp className="text-primary-600" size={32} />
              <h2 className="text-3xl font-bold">Featured Stores</h2>
            </div>
            <Link to="/stores" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStores.map(store => (
                <StoreCard key={store._id} store={store} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Deals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FiGift className="text-primary-600" size={32} />
              <h2 className="text-3xl font-bold">Hot Deals</h2>
            </div>
            <Link to="/deals" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDeals.map(deal => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Coupons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FiPercent className="text-primary-600" size={32} />
              <h2 className="text-3xl font-bold">Exclusive Coupons</h2>
            </div>
            <Link to="/coupons" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exclusiveCoupons.map(coupon => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join millions of savvy shoppers and start earning cashback today!
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
            Sign Up for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
