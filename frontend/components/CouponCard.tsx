// path: frontend/components/CouponCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Tag, Clock, Users, Star } from 'lucide-react';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface CouponCardProps {
  coupon: {
    _id: string;
    title: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number;
    expiryDate: string;
    isExclusive: boolean;
    usageCount: number;
    maxUsage?: number;
    category: string;
    terms: string;
    imageUrl?: string;
    priority: number;
    storeId: {
      _id: string;
      name: string;
      slug: string;
      logoUrl: string;
      currentCashbackPercent: number;
    };
  };
  className?: string;
}

export default function CouponCard({ coupon, className = '' }: CouponCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDiscount = () => {
    switch (coupon.discountType) {
      case 'percentage':
        return `${coupon.discountValue}% OFF`;
      case 'fixed':
        return `₹${coupon.discountValue} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      case 'buy_x_get_y':
        return `BUY ${coupon.discountValue} GET 1 FREE`;
      default:
        return 'DISCOUNT';
    }
  };

  const formatExpiry = () => {
    const expiry = new Date(coupon.expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    return `Expires ${expiry.toLocaleDateString()}`;
  };

  const isExpired = new Date(coupon.expiryDate) < new Date();
  const isUsageLimitReached = coupon.maxUsage && coupon.usageCount >= coupon.maxUsage;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setIsCopied(true);
      toast.success('Coupon code copied!');
      
      // Track coupon usage
      try {
        await api.post(`/api/coupons/${coupon._id}/use`);
      } catch (error) {
        console.error('Failed to track coupon usage:', error);
      }

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy coupon code');
    }
  };

  const handleShopNow = async () => {
    try {
      // Create click tracking
      const response = await api.post('/api/click', {
        storeId: coupon.storeId._id,
        couponId: coupon._id,
        redirectToAffiliateUrl: `https://${coupon.storeId.slug}.com`
      });

      // Redirect to tracking URL
      window.location.href = response.data.data.redirectUrl;
    } catch (error) {
      toast.error('Failed to redirect to store');
      console.error('Click tracking error:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${className} ${
        isExpired || isUsageLimitReached ? 'opacity-60' : ''
      }`}
    >
      {/* Exclusive badge */}
      {coupon.isExclusive && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Exclusive
          </span>
        </div>
      )}

      {/* Priority badge */}
      {coupon.priority > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
            #{coupon.priority}
          </span>
        </div>
      )}

      {/* Store info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 relative">
            <img
              src={coupon.storeId.logoUrl}
              alt={coupon.storeId.name}
              className="w-full h-full object-contain rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {coupon.storeId.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {coupon.storeId.currentCashbackPercent}% cashback
            </p>
          </div>
        </div>
      </div>

      {/* Coupon content */}
      <div className="p-4">
        {/* Discount value */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-primary mb-1">
            {formatDiscount()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {coupon.title}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {coupon.description}
        </p>

        {/* Coupon code */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Coupon Code
              </div>
              <div className="font-mono font-semibold text-gray-900 dark:text-white">
                {coupon.code}
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              disabled={isExpired || isUsageLimitReached}
              className="btn btn-sm btn-outline flex items-center space-x-1"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {coupon.minOrderValue && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="w-20 text-gray-500 dark:text-gray-400">Min. order:</span>
              <span>₹{coupon.minOrderValue}</span>
            </div>
          )}
          {coupon.maxDiscount && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="w-20 text-gray-500 dark:text-gray-400">Max. discount:</span>
              <span>₹{coupon.maxDiscount}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatExpiry()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span>{coupon.usageCount.toLocaleString()} used</span>
            {coupon.maxUsage && (
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                / {coupon.maxUsage.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            <Tag className="w-3 h-3 mr-1" />
            {coupon.category}
          </span>
        </div>

        {/* Terms toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left text-sm text-primary hover:underline mb-4"
        >
          {isExpanded ? 'Hide' : 'Show'} Terms & Conditions
        </button>

        {/* Terms */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            {coupon.terms}
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleShopNow}
            disabled={isExpired || isUsageLimitReached}
            className="flex-1 btn btn-primary btn-sm flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Shop Now
          </button>
        </div>

        {/* Status messages */}
        {isExpired && (
          <div className="mt-2 text-center text-sm text-red-500">
            This coupon has expired
          </div>
        )}
        {isUsageLimitReached && (
          <div className="mt-2 text-center text-sm text-red-500">
            Usage limit reached
          </div>
        )}
      </div>
    </motion.div>
  );
}