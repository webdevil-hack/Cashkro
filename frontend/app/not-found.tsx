// path: frontend/app/not-found.tsx
'use client';

import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* 404 Icon */}
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn btn-primary btn-lg flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/stores"
              className="text-primary hover:underline text-sm"
            >
              Browse Stores
            </Link>
            <Link
              href="/coupons"
              className="text-primary hover:underline text-sm"
            >
              View Coupons
            </Link>
            <Link
              href="/dashboard"
              className="text-primary hover:underline text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/contact"
              className="text-primary hover:underline text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}