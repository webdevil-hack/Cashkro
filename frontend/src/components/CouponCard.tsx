import { useState } from 'react';
import { FiClock, FiCopy, FiCheck, FiTag } from 'react-icons/fi';
import { Coupon } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const store = typeof coupon.store === 'object' ? coupon.store : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success('Coupon code copied!');

      // Track coupon use if authenticated
      if (isAuthenticated) {
        await api.post(`/coupons/${coupon._id}/use`);
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {store && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img src={store.logo} alt={store.name} className="h-6 w-auto" />
              <span className="text-sm font-semibold text-gray-700">{store.name}</span>
            </div>
            <div className="flex gap-2">
              {coupon.isExclusive && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                  Exclusive
                </span>
              )}
              {coupon.isVerified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                  Verified
                </span>
              )}
            </div>
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {coupon.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {coupon.description}
        </p>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiTag className="text-orange-600" size={20} />
              <span className="text-xl font-bold text-orange-600">
                {coupon.discountValue}
              </span>
            </div>
          </div>
          {coupon.minOrderValue > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              Min. order: ₹{coupon.minOrderValue}
            </p>
          )}
        </div>

        <div className="border-2 border-dashed border-primary-300 rounded-lg p-3 mb-4 bg-primary-50">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-primary-700 text-lg">
              {coupon.code}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              {copied ? (
                <>
                  <FiCheck size={16} />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <FiCopy size={16} />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          {coupon.expiryDate && (
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>Expires: {format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <span>Used: {coupon.usageCount}</span>
            <span className="text-green-600">✓ {coupon.successRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
