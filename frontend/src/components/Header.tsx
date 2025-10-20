import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stores?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          🎉 Get Extra Cashback on Top Stores! Limited Time Offer 🎉
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
              CK
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Cash<span className="text-primary-600">Karo</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for stores, deals, coupons..."
                className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/stores" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Stores
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Deals
            </Link>
            <Link to="/coupons" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Coupons
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/my-cashback" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                  <BiWallet size={20} />
                  <span className="font-semibold">₹{user?.confirmedCashback || 0}</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <FiUser size={20} />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/my-cashback" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Cashback
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </form>
            <nav className="space-y-2">
              <Link to="/stores" className="block py-2 text-gray-700 hover:text-primary-600">
                Stores
              </Link>
              <Link to="/deals" className="block py-2 text-gray-700 hover:text-primary-600">
                Deals
              </Link>
              <Link to="/coupons" className="block py-2 text-gray-700 hover:text-primary-600">
                Coupons
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <Link to="/my-cashback" className="block py-2 text-gray-700 hover:text-primary-600">
                    My Cashback (₹{user?.confirmedCashback || 0})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/register" className="block py-2">
                    <button className="btn btn-primary w-full">Sign Up</button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
