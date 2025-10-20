import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <Link to={`/stores/${store._id}`} className="card hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <img
            src={store.logo}
            alt={store.name}
            className="h-16 w-auto object-contain"
          />
          {store.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{store.name}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {store.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-yellow-500">
            <FiStar fill="currentColor" />
            <span className="text-sm font-semibold text-gray-700">
              {store.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({store.totalRatings})
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cashback</span>
            <div className="text-right">
              {store.cashbackType === 'upto' && (
                <span className="text-lg font-bold text-primary-600">
                  Up to {store.cashbackValue}%
                </span>
              )}
              {store.cashbackType === 'percentage' && (
                <span className="text-lg font-bold text-primary-600">
                  {store.cashbackValue}%
                </span>
              )}
              {store.cashbackType === 'fixed' && (
                <span className="text-lg font-bold text-primary-600">
                  ₹{store.cashbackValue}
                </span>
              )}
              {store.maxCashback && (
                <span className="text-xs text-gray-500 block">
                  Max ₹{store.maxCashback}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {store.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
