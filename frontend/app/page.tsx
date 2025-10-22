'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [stores, setStores] = useState([
    {
      id: 1,
      name: 'Amazon',
      logo: '🛒',
      cashback: '5%',
      description: 'Everything Store',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 2,
      name: 'Flipkart',
      logo: '🛍️',
      cashback: '4%',
      description: 'Online Shopping',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 3,
      name: 'Myntra',
      logo: '👗',
      cashback: '6%',
      description: 'Fashion & Lifestyle',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 4,
      name: 'Zomato',
      logo: '🍕',
      cashback: '3%',
      description: 'Food Delivery',
      color: 'bg-green-100 text-green-600'
    }
  ]);

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      store: 'Amazon',
      title: 'Get 20% off on Electronics',
      code: 'ELECTRONICS20',
      discount: '20%',
      expiry: 'Dec 31, 2024',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 2,
      store: 'Flipkart',
      title: 'Flat ₹500 off on Fashion',
      code: 'FASHION500',
      discount: '₹500',
      expiry: 'Jan 15, 2025',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 3,
      store: 'Myntra',
      title: '30% off on Beauty Products',
      code: 'BEAUTY30',
      discount: '30%',
      expiry: 'Feb 28, 2025',
      color: 'bg-blue-100 text-blue-600'
    }
  ]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
    alert(`Code ${code} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CashKaro Clone
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Stores</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Coupons</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Earn Cashback on Every Purchase
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Shop at 500+ stores, get exclusive coupons, and earn real cashback on every purchase. Join thousands of smart shoppers!
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Shopping
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search stores, coupons, or categories..." 
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Stores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${store.color} rounded-lg flex items-center justify-center mr-4 text-2xl`}>
                    {store.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.description}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-600">{store.cashback}</span>
                  <span className="text-gray-600 ml-2">Cashback</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Shop Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Coupons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Exclusive Coupons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${coupon.color} rounded-lg flex items-center justify-center mr-3`}>
                      <span className="font-bold">{coupon.store[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{coupon.store}</h3>
                      <p className="text-sm text-gray-500">Exclusive Offer</p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Exclusive</span>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{coupon.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">Use code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{coupon.code}</span></p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Expires: {coupon.expiry}</span>
                    <button 
                      onClick={() => copyCode(coupon.code)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Partner Stores</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">₹50M+</div>
              <div className="text-blue-200">Cashback Earned</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-200">Happy Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CashKaro Clone</h3>
              <p className="text-gray-400">Earn cashback on every purchase. Shop smart, save more!</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CashKaro Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}