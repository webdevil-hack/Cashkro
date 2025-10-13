// path: frontend/components/SkeletonLoader.tsx
'use client';

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export default function SkeletonLoader({ 
  className = '', 
  lines = 1, 
  height = 'h-4', 
  width = 'w-full',
  rounded = true 
}: SkeletonLoaderProps) {
  if (lines === 1) {
    return (
      <div 
        className={`skeleton ${height} ${width} ${rounded ? 'rounded' : ''} ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${height} ${width} ${rounded ? 'rounded' : ''} ${
            index === lines - 1 ? 'w-3/4' : ''
          }`}
        />
      ))}
    </div>
  );
}

// Predefined skeleton components
export function StoreCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Banner */}
      <div className="skeleton h-32 w-full" />
      
      {/* Content */}
      <div className="p-6">
        {/* Logo and name */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="skeleton w-12 h-12 rounded-lg" />
          <div className="flex-1">
            <div className="skeleton h-6 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>

        {/* Description */}
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-2/3 mb-4" />

        {/* Categories */}
        <div className="flex space-x-2 mb-4">
          <div className="skeleton h-6 w-16 rounded-md" />
          <div className="skeleton h-6 w-20 rounded-md" />
          <div className="skeleton h-6 w-14 rounded-md" />
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-4">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-4 w-24" />
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <div className="skeleton h-10 flex-1 rounded-lg" />
          <div className="skeleton h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CouponCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Store info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="skeleton w-8 h-8 rounded" />
          <div className="flex-1">
            <div className="skeleton h-5 w-3/4 mb-1" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Discount value */}
        <div className="text-center mb-4">
          <div className="skeleton h-8 w-32 mx-auto mb-2" />
          <div className="skeleton h-4 w-2/3 mx-auto" />
        </div>

        {/* Description */}
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-3/4 mb-4" />

        {/* Coupon code */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="skeleton h-3 w-16 mb-1" />
              <div className="skeleton h-5 w-24" />
            </div>
            <div className="skeleton h-8 w-16 rounded-lg" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>

        {/* Category */}
        <div className="skeleton h-6 w-20 rounded-md mb-4" />

        {/* Button */}
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function UserProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="skeleton w-16 h-16 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-6 w-48 mb-2" />
          <div className="skeleton h-4 w-32" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  );
}

export function TransactionSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="skeleton w-10 h-10 rounded-lg" />
          <div>
            <div className="skeleton h-5 w-32 mb-1" />
            <div className="skeleton h-4 w-24" />
          </div>
        </div>
        <div className="text-right">
          <div className="skeleton h-5 w-16 mb-1" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>
      
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  );
}

export function StatsCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>
      <div className="skeleton h-8 w-20 mb-2" />
      <div className="skeleton h-4 w-32" />
    </div>
  );
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <div className="skeleton h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="skeleton h-4 w-16" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}