import { Link } from 'react-router-dom';
import { FiClock, FiTag } from 'react-icons/fi';
import { Deal } from '../types';
import { format } from 'date-fns';

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => {
  const store = typeof deal.store === 'object' ? deal.store : null;

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      {deal.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {store && (
          <div className="flex items-center space-x-2 mb-3">
            <img src={store.logo} alt={store.name} className="h-6 w-auto" />
            <span className="text-sm text-gray-600">{store.name}</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-2">
            {deal.title}
          </h3>
          {deal.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
              Hot
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {deal.description}
        </p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <FiTag className="text-green-600" size={20} />
            <span className="text-xl font-bold text-green-600">
              {deal.discountValue}
            </span>
          </div>
        </div>

        {deal.expiryDate && (
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <FiClock className="mr-1" />
            <span>Expires: {format(new Date(deal.expiryDate), 'MMM dd, yyyy')}</span>
          </div>
        )}

        <Link
          to={`/stores/${typeof deal.store === 'object' ? deal.store._id : deal.store}`}
          className="btn btn-primary w-full"
        >
          Get Deal
        </Link>
      </div>
    </div>
  );
};

export default DealCard;
